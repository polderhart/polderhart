/**
 * Team Editor – inline foto-positionering
 * Alleen actief wanneer ingelogd via Netlify Identity.
 * Toont een sleepknop op elke teamkaart om het gezicht in de cirkel te centreren.
 */
(function () {
  'use strict';

  function init() {
    if (!window.netlifyIdentity) return;

    window.netlifyIdentity.on('init', function (user) {
      if (user) activate();
    });
    window.netlifyIdentity.on('login', activate);
    window.netlifyIdentity.on('logout', deactivate);

    // Team cards worden na init() asynchroon geladen
    window.addEventListener('team:rendered', function () {
      if (window.netlifyIdentity && window.netlifyIdentity.currentUser()) activate();
    });

    if (window.netlifyIdentity.currentUser && window.netlifyIdentity.currentUser()) activate();
  }

  function activate() {
    document.querySelectorAll('.team-card[data-slug]').forEach(function (card) {
      if (card.querySelector('.team-card__pos-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'team-card__pos-btn';
      btn.title = 'Foto positioneren';
      btn.setAttribute('aria-label', 'Foto positioneren');
      btn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/>' +
        '<polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/>' +
        '<line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>' +
        '</svg>';
      btn.addEventListener('click', function () { openEditor(card); });
      card.appendChild(btn);
    });
    document.body.classList.add('team-editor-active');
  }

  function deactivate() {
    document.querySelectorAll('.team-card__pos-btn').forEach(function (b) { b.remove(); });
    document.body.classList.remove('team-editor-active');
  }

  function parsePosition(posStr) {
    if (!posStr) return [50, 10];
    var match = posStr.match(/([\d.]+)%\s*([\d.]+)%/);
    if (match) return [parseFloat(match[1]), parseFloat(match[2])];
    var x = posStr.includes('left') ? 0 : posStr.includes('right') ? 100 : 50;
    var y = posStr.includes('bottom') ? 90 : posStr.includes('top') ? 10 : 50;
    return [x, y];
  }

  function openEditor(card) {
    var slug = card.dataset.slug;
    var liveImg = card.querySelector('.team-card__photo img');
    if (!liveImg) return;

    // Get current position from inline style attribute (more reliable than getPropertyValue for custom props)
    var styleAttr = liveImg.getAttribute('style') || '';
    var zoomMatch = styleAttr.match(/--photo-zoom:\s*([\d.]+)/);
    var initZoom = zoomMatch ? parseFloat(zoomMatch[1]) : 1;
    var parsed = parsePosition(liveImg.style.objectPosition);
    var posX = parsed[0];
    var posY = parsed[1];
    var zoom = initZoom;

    var overlay = document.createElement('div');
    overlay.className = 'team-editor-overlay';
    overlay.innerHTML =
      '<div class="team-editor-backdrop"></div>' +
      '<div class="team-editor-modal">' +
        '<p class="team-editor-hint">Sleep om het gezicht te centreren in de cirkel.</p>' +
        '<div class="team-editor-circle">' +
          '<img class="team-editor-img" src="' + liveImg.src + '" draggable="false" alt="">' +
        '</div>' +
        '<label class="team-editor-zoom-row">' +
          '<span>Zoom</span>' +
          '<input type="range" class="team-editor-zoom" min="1" max="2.5" step="0.05" value="' + zoom + '">' +
          '<span class="team-editor-zoom-val">' + zoom.toFixed(1) + '×</span>' +
        '</label>' +
        '<div class="team-editor-actions">' +
          '<button class="team-editor-cancel">Annuleren</button>' +
          '<button class="team-editor-save">Opslaan</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    var previewImg = overlay.querySelector('.team-editor-img');
    var zoomInput = overlay.querySelector('.team-editor-zoom');
    var zoomValEl = overlay.querySelector('.team-editor-zoom-val');
    var circle = overlay.querySelector('.team-editor-circle');

    function updatePreview() {
      previewImg.style.objectPosition = posX.toFixed(1) + '% ' + posY.toFixed(1) + '%';
      previewImg.style.transform = 'scale(' + zoom + ')';
    }
    updatePreview();

    // ── Drag to pan ──────────────────────────────────────────
    var isDragging = false;
    var lastX, lastY;

    function startDrag(clientX, clientY) {
      isDragging = true;
      lastX = clientX;
      lastY = clientY;
      circle.style.cursor = 'grabbing';
    }

    function moveDrag(clientX, clientY) {
      if (!isDragging) return;
      var dx = clientX - lastX;
      var dy = clientY - lastY;
      lastX = clientX;
      lastY = clientY;
      // Moving right/down → image slides that way → focal point moves opposite
      posX = Math.max(0, Math.min(100, posX - (dx / circle.offsetWidth * 100)));
      posY = Math.max(0, Math.min(100, posY - (dy / circle.offsetHeight * 100)));
      updatePreview();
    }

    function stopDrag() {
      isDragging = false;
      circle.style.cursor = 'grab';
    }

    circle.addEventListener('mousedown', function (e) { e.preventDefault(); startDrag(e.clientX, e.clientY); });
    circle.addEventListener('touchstart', function (e) { e.preventDefault(); startDrag(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
    document.addEventListener('mousemove', function (e) { moveDrag(e.clientX, e.clientY); });
    document.addEventListener('touchmove', function (e) { if (isDragging) { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); } }, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);

    // ── Zoom slider ──────────────────────────────────────────
    zoomInput.addEventListener('input', function () {
      zoom = parseFloat(zoomInput.value);
      zoomValEl.textContent = zoom.toFixed(1) + '×';
      updatePreview();
    });

    // ── Buttons ──────────────────────────────────────────────
    overlay.querySelector('.team-editor-backdrop').addEventListener('click', closeModal);
    overlay.querySelector('.team-editor-cancel').addEventListener('click', closeModal);
    overlay.querySelector('.team-editor-save').addEventListener('click', function () {
      var saveBtn = overlay.querySelector('.team-editor-save');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Bezig…';
      var position = posX.toFixed(1) + '% ' + posY.toFixed(1) + '%';
      savePosition(slug, position, zoom).then(function (ok) {
        if (ok) {
          liveImg.style.objectPosition = position;
          if (zoom !== 1) {
            liveImg.style.setProperty('--photo-zoom', zoom);
          } else {
            liveImg.style.removeProperty('--photo-zoom');
          }
          closeModal();
        } else {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Opslaan';
          alert('Opslaan mislukt. Probeer opnieuw.');
        }
      });
    });

    function closeModal() {
      overlay.remove();
    }
  }

  async function savePosition(slug, position, zoom) {
    try {
      var user = window.netlifyIdentity.currentUser();
      if (!user) return false;
      var token = await user.jwt();

      var getRes = await fetch('/.netlify/git/github/contents/content/team/' + slug + '.json', {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!getRes.ok) return false;
      var fileData = await getRes.json();
      var content = JSON.parse(atob(fileData.content.replace(/\s/g, '')));

      content.photo_position = position;
      if (zoom && zoom !== 1) {
        content.photo_zoom = String(zoom);
      } else {
        delete content.photo_zoom;
      }

      var putRes = await fetch('/.netlify/git/github/contents/content/team/' + slug + '.json', {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Foto positie bijgewerkt: ' + slug,
          content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
          sha: fileData.sha
        })
      });
      return putRes.ok;
    } catch (e) {
      return false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
