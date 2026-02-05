# CMS Setup voor 't Polderhart

## 📋 Overzicht

Deze website gebruikt:
- **Decap CMS** (gratis, git-based) voor team management
- **Google Calendar** (gratis) voor agenda/evenementen
- **Netlify** (gratis hosting) met GitHub integratie

## 🚀 Netlify Deployment

### Stap 1: GitHub Repository

1. Maak een GitHub repository aan (bijv. `polderhart-website`)
2. Push je lokale code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/JOUW-USERNAME/polderhart-website.git
   git branch -M main
   git push -u origin main
   ```

3. **PAS CONFIG AAN**: Open `/admin/config.yml` en wijzig regel 3:
   ```yaml
   repo: JOUW-USERNAME/polderhart-website
   ```

### Stap 2: Netlify Account

1. Ga naar [netlify.com](https://netlify.com)
2. Klik "Sign up" → Kies "Continue with GitHub"
3. Autoriseer Netlify

### Stap 3: Site Deployen

1. Klik "Add new site" → "Import an existing project"
2. Kies "Deploy with GitHub"
3. Selecteer je `polderhart-website` repository
4. Build settings:
   - **Build command**: (laat leeg)
   - **Publish directory**: `/` (root)
5. Klik "Deploy site"

Je site is nu live op: `random-name-123.netlify.app`

### Stap 4: Custom Domein (Optioneel)

1. In Netlify: Domain settings → Add custom domain
2. Volg instructies om DNS bij je domein provider in te stellen

## 🔐 CMS Login Instellen

### Stap 1: GitHub OAuth in Netlify

1. In Netlify dashboard: Site settings → Access control → OAuth
2. Klik "Install provider" bij GitHub
3. Ga naar [GitHub Developer Settings](https://github.com/settings/developers)
4. Klik "New OAuth App"
5. Vul in:
   - **Application name**: `Polderhart CMS`
   - **Homepage URL**: `https://jouw-site.netlify.app`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
6. Klik "Register application"
7. Kopieer **Client ID** en **Client Secret**
8. Terug in Netlify: plak beide waarden → Save

### Stap 2: Netlify Identity (BELANGRIJK!)

**ZONDER deze stap kan NIEMAND inloggen op /admin!**

1. In Netlify dashboard: Site settings → Identity → Enable Identity
2. Klik "Enable Identity"
3. Settings → Registration → Invite only (aangeraden)
4. External providers → Add provider → GitHub
5. Services → Git Gateway → Enable Git Gateway

### Stap 3: Gebruiker Uitnodigen

1. Identity tab → Invite users
2. Voer email in van de persoon die het CMS mag gebruiken
3. Die persoon krijgt een email met een link
4. Na klikken op link: wachtwoord instellen
5. **NU KAN DIE PERSOON INLOGGEN OP: `https://jouw-site.netlify.app/admin`**

## 👥 Team Beheren via CMS

### Teamlid Toevoegen

1. Ga naar `https://jouw-site.netlify.app/admin`
2. Log in met GitHub of je Netlify account
3. Klik "Team" → "New Teamlid"
4. Vul in:
   - **Sectie**: Kies de juiste categorie (Directie, Kleuterklassen, etc.)
   - **Subsectie**: Alleen invullen voor Leerkrachten (Kleuterklassen/Lagere school) of Ondersteunend (Administratie/Opvang)
   - **Naam**: Bijv. "Juf Sarah"
   - **Rol**: Bijv. "Tweede leerjaar"
   - **Email**: Optioneel
   - **Foto**: Upload foto (vierkant werkt het best)
   - **Volgorde**: Laag nummer = eerder in lijst (1, 2, 3...)
5. Klik "Publish" → "Publish now"

**LET OP:** Na publiceren duurt het 1-2 minuten voordat de website update!

### Teamlid Bewerken

1. Ga naar `/admin` → "Team"
2. Klik op het teamlid
3. Bewerk de gegevens
4. Klik "Publish" → "Publish now"

### Teamlid Verwijderen

1. Ga naar `/admin` → "Team"  
2. Klik op het teamlid
3. Klik "Delete entry" (rode knop rechtsboven)
4. Bevestig

### Volgorde Aanpassen

Je kan teamleden een nummer geven (1, 2, 3...) in het **Volgorde** veld.
- Lagere nummers verschijnen eerst
- Binnen dezelfde sectie worden ze gesorteerd op dit nummer

## 📅 Google Calendar Integratie

### Optie 1: Google Calendar Embed (Makkelijkst - GRATIS)

**Wat je nodig hebt:**
- Google account (gratis)
- Google Calendar (gratis)

**Stappen:**

1. **Maak een kalender** (als je die nog niet hebt):
   - Ga naar [calendar.google.com](https://calendar.google.com)
   - Links onder: "Andere kalenders" → "+" → "Nieuwe kalender maken"
   - Naam: "GBS 't Polderhart Agenda"
   - Klik "Kalender maken"

2. **Maak kalender publiek**:
   - Klik op kalender naam → Instellingen en delen
   - "Toegangsrechten" → Vink aan: "Beschikbaar maken voor publiek"
   - Klik "OK"

3. **Verkrijg embed code**:
   - Scroll naar "Kalender integreren"
   - Kopieer de `<iframe>` code
   - **OF**: Klik "Aanpassen" voor stijl aanpassingen

4. **Voeg toe aan agenda.html**:
   - Open `/agenda.html`
   - Vervang de huidige agenda sectie door:
   ```html
   <section class="section">
       <div class="section__container">
           <h2 class="section__title">Schoolagenda</h2>
           <div style="max-width: 100%; margin: var(--space-3xl) 0;">
               <!-- PLAK HIER JE GOOGLE CALENDAR IFRAME -->
               <iframe 
                   src="https://calendar.google.com/calendar/embed?src=JOUW_CALENDAR_ID%40group.calendar.google.com&ctz=Europe%2FBrussels" 
                   style="border: 0; width: 100%; height: 600px;" 
                   frameborder="0" 
                   scrolling="no">
               </iframe>
           </div>
       </div>
   </section>
   ```

5. **Evenementen toevoegen**:
   - Ga naar [calendar.google.com](https://calendar.google.com)
   - Klik op een datum → Voeg evenement toe
   - Vul titel, tijd, beschrijving in
   - Klik "Opslaan"
   - Het verschijnt automatisch op je website!

**VOORDEEL**: 
- ✅ 100% GRATIS
- ✅ Geen code nodig
- ✅ Update realtime
- ✅ Kan op gsm, tablet, computer beheren
- ✅ Kan toegang geven aan meerdere beheerders

### Optie 2: Custom Kalender Layout Behouden

Als je je huidige mooie agenda-event design wilt behouden, kunnen we dat combineren met Decap CMS.

Voeg dit toe aan `/admin/config.yml`:

```yaml
  - name: "events"
    label: "Agenda"
    label_singular: "Evenement"
    folder: "content/events"
    create: true
    delete: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Titel", name: "title", widget: "string"}
      - {label: "Datum", name: "date", widget: "datetime", date_format: "DD/MM/YYYY", time_format: false}
      - {label: "Beschrijving", name: "description", widget: "text", required: false}
      - {label: "Tijd", name: "time", widget: "string", required: false, hint: "Bijv. '19:00 - 21:00'"}
```

Dan blijft je huidige agenda.html layout behouden!

## 🛠️ Team Pagina Dynamisch Maken

Om de team pagina dynamisch te maken:

1. **Open `/team.html`**
2. **Vervang ALLEEN de team content sectie** (regel ~102):

**VOOR:**
```html
<section class="section">
    <div class="section__container">
        <!-- Directie -->
        <div class="team-section">
            <h2 class="team-section__title">Directie</h2>
            <div class="team-grid">
                <!-- Alle team cards hier... -->
            </div>
        </div>
        <!-- etc... -->
    </div>
</section>
```

**NA:**
```html
<section class="section">
    <div class="section__container" id="team-container">
        <!-- Team members worden hier automatisch geladen -->
    </div>
</section>

<!-- Team Loader Script -->
<script src="js/team-loader.js"></script>
```

3. **Bewaar de rest van team.html** (header, nav, hero, footer blijven hetzelfde!)

## 🎯 Workflow voor Schoolbeheerder

### Team Bijwerken
1. Ga naar `jouw-site.netlify.app/admin`
2. Log in
3. Klik "Team" → bewerk/voeg toe/verwijder
4. Klik "Publish"
5. Wacht 1-2 minuten → wijzigingen zijn live!

### Agenda Bijwerken (Google Calendar)
1. Ga naar [calendar.google.com](https://calendar.google.com)
2. Klik op datum → Voeg evenement toe
3. Vul gegevens in → Opslaan
4. Verschijnt meteen op website!

## 💡 Tips

- **Foto's**: Gebruik vierkante foto's (300x300px of groter) voor beste resultaat
- **Volgorde**: Begin met volgorde 10, 20, 30... dan kan je later tussendoor nummers gebruiken (15, 25)
- **Backup**: Al je wijzigingen worden opgeslagen in GitHub, dus je hebt altijd een backup!
- **Meerdere beheerders**: Je kan meerdere mensen uitnodigen via Netlify Identity

## ❓ Problemen Oplossen

### "Can't access CMS"
- Check of je Netlify Identity hebt ingeschakeld
- Check of je Git Gateway hebt ingeschakeld
- Check of je bent uitgenodigd via Netlify Identity

### "Changes niet zichtbaar"
- Wacht 1-2 minuten (Netlify build tijd)
- Check in GitHub of de commit is aangekomen
- Hard refresh: Cmd+Shift+R (Mac) of Ctrl+Shift+R (Windows)

### "Foto's worden niet getoond"
- Check of het pad klopt in de JSON
- Check of de foto in `/assets/team/` staat
- Verwijder cache en refresh

## 📞 Support

Bij vragen: check de [Decap CMS docs](https://decapcms.org/docs/) of [Netlify docs](https://docs.netlify.com/).
