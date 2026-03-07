/**
 * Generieke Content Loader voor 't Polderhart
 * Laadt pagina-inhoud uit /content/pages/{pagina}.json
 * + globale schoolinfo uit /content/settings/school-info.json
 *
 * Gebruik in HTML:
 *   data-cms-text="key"     → element.textContent = waarde
 *   data-cms-html="key"     → element.innerHTML  = waarde
 *   data-cms-src="key"      → img.src             = waarde
 *   data-cms-alt="key"      → img.alt / aria-label= waarde
 *   data-cms-href="key"     → a.href               = waarde
 *
 * Sleutels uit school-info.json worden geprefixed met "site_":
 *   data-cms-text="site_email"  → school-info.json → email
 */

(function () {
  const PAGE_MAP = {
    '/':                    'home',
    '/index.html':          'home',
    '/onze-school.html':    'onze-school',
    '/contact.html':        'contact',
    '/schooluren.html':     'schooluren',
    '/opvang-studie.html':  'opvang',
    '/inschrijvingen.html': 'inschrijvingen',
    '/schoolbus.html':      'schoolbus',
    '/vriendenkring.html':  'vriendenkring',
    '/jobs.html':           'jobs',
    '/praktisch.html':      'praktisch',
    '/agenda.html':         'agenda',
    '/documenten.html':     'documenten',
  };

  async function fetchJSON(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  function applyContent(data) {
    document.querySelectorAll('[data-cms-text]').forEach(function (el) {
      const val = data[el.getAttribute('data-cms-text')];
      if (val !== undefined && val !== '') el.textContent = val;
    });

    document.querySelectorAll('[data-cms-html]').forEach(function (el) {
      const val = data[el.getAttribute('data-cms-html')];
      if (val !== undefined && val !== '') el.innerHTML = val;
    });

    const onNetlify = window.location.hostname.endsWith('.netlify.app') || window.location.hostname === 'polderhart.be' || window.location.hostname === 'www.polderhart.be';

    document.querySelectorAll('[data-cms-src]').forEach(function (el) {
      const val = data[el.getAttribute('data-cms-src')];
      if (val !== undefined && val !== '') {
        const isLocal = val.startsWith('/') || val.startsWith('assets/');
        if (isLocal && onNetlify) {
          const w = el.getAttribute('data-cms-img-width') || '1200';
          const path = val.startsWith('/') ? val : '/' + val;
          el.src = '/.netlify/images?url=' + encodeURIComponent(path) + '&w=' + w + '&q=80';
        } else {
          el.src = val;
        }
      }
    });

    document.querySelectorAll('[data-cms-alt]').forEach(function (el) {
      const val = data[el.getAttribute('data-cms-alt')];
      if (val !== undefined && val !== '') {
        if (el.tagName === 'IMG') {
          el.alt = val;
        } else {
          el.setAttribute('aria-label', val);
        }
      }
    });

    document.querySelectorAll('[data-cms-href]').forEach(function (el) {
      const val = data[el.getAttribute('data-cms-href')];
      if (val !== undefined && val !== '') el.href = val;
    });
  }

  /**
   * Vlak geneste objecten als {a: {b: 1}} → {"a_b": 1}
   * Hierdoor werken zowel flat JSON als Decap CMS object-widget output.
   */
  function flattenObject(obj, prefix) {
    return Object.keys(obj).reduce(function (acc, key) {
      const fullKey = prefix ? prefix + '_' + key : key;
      const val = obj[key];
      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        Object.assign(acc, flattenObject(val, fullKey));
      } else {
        acc[fullKey] = val;
      }
      return acc;
    }, {});
  }

  async function init() {
    const path = window.location.pathname;
    const pageName = PAGE_MAP[path] || PAGE_MAP[path.replace(/\/$/, '/index.html')];

    const data = {};

    const [siteData, pageData] = await Promise.all([
      fetchJSON('/content/settings/school-info.json'),
      pageName ? fetchJSON('/content/pages/' + pageName + '.json') : Promise.resolve(null),
    ]);

    if (siteData) {
      const flat = flattenObject(siteData, null);
      Object.keys(flat).forEach(function (key) {
        data['site_' + key] = flat[key];
      });
    }

    if (pageData) {
      Object.assign(data, flattenObject(pageData, null));
    }

    applyContent(data);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
