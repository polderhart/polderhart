/**
 * Decap CMS live preview voor teamleden
 * Toont de foto in een cirkel met positie + zoom, exact zoals op de website.
 */
(function () {
  var h = CMS.h;

  var TeamPreview = CMS.createClass({
    render: function () {
      var entry = this.props.entry;
      var getAsset = this.props.getAsset;

      var name = entry.getIn(['data', 'name']) || '';
      var role = entry.getIn(['data', 'role']) || '';
      var photo = entry.getIn(['data', 'photo']);
      var position = entry.getIn(['data', 'photo_position']) || 'top center';
      var zoom = parseFloat(entry.getIn(['data', 'photo_zoom'])) || 1;
      var email = entry.getIn(['data', 'email']) || '';

      var photoSrc = photo ? String(getAsset(photo)) : null;

      var circleStyle = {
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        overflow: 'hidden',
        margin: '0 auto 20px',
        background: '#e8e8e8',
        flexShrink: 0,
      };

      var imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: position,
        transform: 'scale(' + zoom + ')',
        transformOrigin: 'center',
        display: 'block',
      };

      var wrapStyle = {
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        textAlign: 'center',
        padding: '48px 24px 32px',
        color: '#1a1a1a',
      };

      var labelStyle = {
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#888',
        marginBottom: '4px',
      };

      var infoStyle = {
        fontSize: '12px',
        color: '#555',
        margin: '0 0 4px',
        padding: '4px 12px',
        background: '#f5f5f5',
        borderRadius: '4px',
        display: 'inline-block',
      };

      return h('div', { style: wrapStyle },
        // Cirkel preview
        h('div', { style: circleStyle },
          photoSrc
            ? h('img', { src: photoSrc, alt: name, style: imgStyle })
            : h('div', { style: { width: '100%', height: '100%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '12px' } }, 'Geen foto')
        ),

        // Naam & rol
        h('h3', { style: { margin: '0 0 6px', fontSize: '1.1rem', fontWeight: '400', letterSpacing: '-0.01em' } }, name || '—'),
        h('p', { style: { margin: '0 0 20px', fontSize: '0.8rem', color: '#888', letterSpacing: '0.01em' } }, role || '—'),

        // Info labels
        h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '16px' } },
          h('p', { style: labelStyle }, 'Positie instelling'),
          h('span', { style: infoStyle }, position),
          zoom !== 1 && h('span', { style: { ...infoStyle, marginTop: '2px' } }, 'Zoom: ' + zoom + '×'),
          email && h('p', { style: { margin: '12px 0 0', fontSize: '11px', color: '#aaa' } }, email)
        )
      );
    }
  });

  CMS.registerPreviewTemplate('team', TeamPreview);

  CMS.registerPreviewStyle(`
    * { box-sizing: border-box; }
    body { margin: 0; background: #fafafa; }
  `);
})();
