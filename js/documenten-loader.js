/**
 * Documenten Loader voor 't Polderhart
 * Laadt de documentenlijst uit /content/documenten.json
 * en rendert ze in #documenten-container
 */

(function () {
  async function loadDocumenten() {
    const container = document.getElementById('documenten-container');
    if (!container) return;

    let data;
    try {
      const res = await fetch('/content/documenten.json');
      if (!res.ok) throw new Error('niet beschikbaar');
      data = await res.json();
    } catch (e) {
      console.warn('Documenten niet geladen:', e);
      return;
    }

    const docs = data.documents || [];
    if (docs.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">Geen documenten beschikbaar.</p>';
      return;
    }

    let html = '';
    docs.forEach(function (doc, i) {
      const marginStyle = i < docs.length - 1 ? ' style="margin-bottom: var(--space-5xl);"' : '';
      html += '<div class="card card--static"' + marginStyle + '>';
      html += '<h3 class="card__title">' + escapeHtml(doc.title) + '</h3>';
      if (doc.description) {
        html += '<p class="card__description">' + escapeHtml(doc.description) + '</p>';
      }
      if (doc.file) {
        html += '<div style="margin-top: var(--space-lg);">';
        html += '<a href="' + encodeURI(doc.file) + '" target="_blank" class="btn">Download PDF</a>';
        html += '</div>';
      }
      html += '</div>';
    });

    container.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDocumenten);
  } else {
    loadDocumenten();
  }
})();
