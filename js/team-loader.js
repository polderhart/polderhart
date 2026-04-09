/**
 * Team Loader voor 't Polderhart
 * Laadt team members dynamisch uit /content/team/*.json
 * Behoudt de exacte layout van team.html
 */

class TeamLoader {
  constructor() {
    this.teamMembers = [];
    this.container = null;
  }

  /**
   * Laad de groepsfoto uit team-photo.json en toon sectie
   */
  async loadGroupPhoto() {
    try {
      const res = await fetch('/content/settings/team-photo.json');
      if (!res.ok) return;
      const data = await res.json();
      if (data.group_photo) {
        const img = document.getElementById('team-group-photo');
        const section = document.getElementById('team-photo-section');
        if (img && section) {
          const onNetlify = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.hostname !== '';
          img.src = onNetlify
            ? `/.netlify/images?url=${encodeURIComponent(data.group_photo)}&w=1400&q=80`
            : data.group_photo;
          img.alt = data.group_photo_alt || 'Het volledige team van GBS \'t Polderhart';
          section.style.display = '';
        }
      }
    } catch (e) {
      // Geen foto beschikbaar, sectie blijft verborgen
    }
  }

  /**
   * Initialiseer de team loader
   */
  async init() {
    this.container = document.querySelector('#team-container');
    if (!this.container) {
      console.warn('Team container niet gevonden. Zorg dat #team-container bestaat in team.html');
      return;
    }

    await this.loadGroupPhoto();
    await this.loadTeamMembers();
    this.render();
  }

  /**
   * Laad alle team members via manifest bestand
   */
  async loadTeamMembers() {
    try {
      const response = await fetch('/content/team-manifest.json');
      const manifest = await response.json();
      
      const promises = manifest.files.map(filename => 
        fetch(`/content/team/${filename}`)
          .then(r => r.json())
          .catch(e => {
            console.error(`Fout bij laden van ${filename}:`, e);
            return null;
          })
      );

      const members = await Promise.all(promises);
      this.teamMembers = members.filter(m => m !== null);
      this.teamMembers.sort((a, b) => (a.order || 100) - (b.order || 100));
    } catch (error) {
      console.error('Geen team data beschikbaar:', error);
    }
  }

  /**
   * Groepeer team members per sectie en subsectie
   */
  groupMembers() {
    const groups = {
      directie: { title: 'Directie', members: [] },
      leerkrachten: { 
        title: 'Leerkrachten',
        subsections: {
          kleuterklassen: { title: 'Kleuterklassen', members: [] },
          lager: { title: 'Lagere school', members: [] }
        }
      },
      bijzonder: { title: 'Bijzondere leerkrachten', members: [] },
      ondersteunend: {
        title: 'Ondersteunend personeel',
        subsections: {
          admin: { title: 'Administratie', members: [] },
          opvang: { title: 'Opvang en ondersteuning', members: [] }
        }
      }
    };

    this.teamMembers.forEach(member => {
      switch(member.section) {
        case 'directie':
          groups.directie.members.push(member);
          break;
        
        case 'kleuterklassen':
          groups.leerkrachten.subsections.kleuterklassen.members.push(member);
          break;
        
        case 'lager':
          groups.leerkrachten.subsections.lager.members.push(member);
          break;
        
        case 'bijzonder':
          groups.bijzonder.members.push(member);
          break;
        
        case 'admin':
          groups.ondersteunend.subsections.admin.members.push(member);
          break;
        
        case 'opvang':
          groups.ondersteunend.subsections.opvang.members.push(member);
          break;
      }
    });

    return groups;
  }

  /**
   * Render een team member card
   */
  renderMemberCard(member) {
    const hasPhoto = member.photo && member.photo !== '';
    const onNetlify = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.hostname !== '';
    const photoSrc = hasPhoto
      ? (onNetlify ? `/.netlify/images?url=${encodeURIComponent(member.photo)}&w=400&q=80` : member.photo)
      : '';
    const photoContent = hasPhoto 
      ? `<img src="${photoSrc}" alt="${member.name}" loading="lazy">`
      : '';
    
    const emailLink = member.email 
      ? `<a href="mailto:${member.email}" class="team-card__email">Stuur een e-mail</a>`
      : '';

    return `
      <div class="team-card">
        <div class="team-card__photo">
          ${photoContent}
        </div>
        <h3 class="team-card__name">${member.name}</h3>
        <p class="team-card__role">${member.role}</p>
        ${emailLink}
      </div>
    `;
  }

  /**
   * Render alle team members met exacte layout van team.html
   */
  render() {
    if (!this.container) return;

    const groups = this.groupMembers();
    let html = '';

    // Directie
    if (groups.directie.members.length > 0) {
      html += `
        <div class="team-section">
          <h2 class="team-section__title">${groups.directie.title}</h2>
          <div class="team-grid">
            ${groups.directie.members.map(m => this.renderMemberCard(m)).join('')}
          </div>
        </div>
      `;
    }

    // Leerkrachten met subsecties
    const leerkrachten = groups.leerkrachten;
    if (leerkrachten.subsections.kleuterklassen.members.length > 0 || 
        leerkrachten.subsections.lager.members.length > 0) {
      html += `<div class="team-section">
        <h2 class="team-section__title">${leerkrachten.title}</h2>`;
      
      // Kleuterklassen
      if (leerkrachten.subsections.kleuterklassen.members.length > 0) {
        html += `
          <h3 class="team-subsection__title">${leerkrachten.subsections.kleuterklassen.title}</h3>
          <div class="team-grid">
            ${leerkrachten.subsections.kleuterklassen.members.map(m => this.renderMemberCard(m)).join('')}
          </div>
        `;
      }
      
      // Lagere school
      if (leerkrachten.subsections.lager.members.length > 0) {
        html += `
          <h3 class="team-subsection__title">${leerkrachten.subsections.lager.title}</h3>
          <div class="team-grid">
            ${leerkrachten.subsections.lager.members.map(m => this.renderMemberCard(m)).join('')}
          </div>
        `;
      }
      
      html += `</div>`;
    }

    // Bijzondere leerkrachten
    if (groups.bijzonder.members.length > 0) {
      html += `
        <div class="team-section">
          <h2 class="team-section__title">${groups.bijzonder.title}</h2>
          <div class="team-grid">
            ${groups.bijzonder.members.map(m => this.renderMemberCard(m)).join('')}
          </div>
        </div>
      `;
    }

    // Ondersteunend personeel met subsecties
    const ondersteunend = groups.ondersteunend;
    if (ondersteunend.subsections.admin.members.length > 0 || 
        ondersteunend.subsections.opvang.members.length > 0) {
      html += `<div class="team-section">
        <h2 class="team-section__title">${ondersteunend.title}</h2>`;
      
      // Administratie
      if (ondersteunend.subsections.admin.members.length > 0) {
        html += `
          <h3 class="team-subsection__title">${ondersteunend.subsections.admin.title}</h3>
          <div class="team-grid">
            ${ondersteunend.subsections.admin.members.map(m => this.renderMemberCard(m)).join('')}
          </div>
        `;
      }
      
      // Opvang en ondersteuning
      if (ondersteunend.subsections.opvang.members.length > 0) {
        html += `
          <h3 class="team-subsection__title">${ondersteunend.subsections.opvang.title}</h3>
          <div class="team-grid">
            ${ondersteunend.subsections.opvang.members.map(m => this.renderMemberCard(m)).join('')}
          </div>
        `;
      }
      
      html += `</div>`;
    }

    this.container.innerHTML = html;
  }
}

// Auto-initialiseer wanneer de pagina geladen is
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const teamLoader = new TeamLoader();
    teamLoader.init();
  });
} else {
  const teamLoader = new TeamLoader();
  teamLoader.init();
}
