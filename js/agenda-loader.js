/**
 * Agenda Loader voor 't Polderhart
 * Laadt agenda-evenementen uit /content/agenda/events.json
 * en rendert ze gegroepeerd per maand in #agenda-container
 */

(function () {
  const MAANDEN = [
    "Januari",
    "Februari",
    "Maart",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  const MAAND_KORT = [
    "Jan",
    "Feb",
    "Mrt",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
  ];

  async function loadEvents() {
    const container = document.getElementById("agenda-container");
    if (!container) return;

    let data;
    try {
      const res = await fetch("/content/agenda/events.json");
      if (!res.ok) throw new Error("niet beschikbaar");
      data = await res.json();
    } catch (e) {
      console.warn("Agenda evenementen niet geladen:", e);
      return;
    }

    const events = (data.events || []).slice().sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });

    if (events.length === 0) {
      container.innerHTML =
        '<p style="color: var(--text-secondary); text-align: center; padding: var(--space-3xl) 0;">Geen evenementen gepland.</p>';
      return;
    }

    // Groepeer per schooljaar > maand (op startdatum)
    const grouped = {};
    events.forEach(function (event) {
      const d = new Date(event.date + "T00:00:00");
      const month = d.getMonth();
      const year = d.getFullYear();
      // Schooljaar: sept–aug
      const schoolYear =
        month >= 8 ? year + "-" + (year + 1) : year - 1 + "-" + year;
      const monthKey = year + "-" + String(month).padStart(2, "0");

      if (!grouped[schoolYear]) grouped[schoolYear] = {};
      if (!grouped[schoolYear][monthKey]) {
        grouped[schoolYear][monthKey] = {
          label: MAANDEN[month],
          year: year,
          month: month,
          events: [],
        };
      }
      grouped[schoolYear][monthKey].events.push(event);
    });

    let html = "";

    Object.keys(grouped)
      .sort()
      .forEach(function (schoolYear) {
        const [startYear, endYear] = schoolYear.split("-");
        html +=
          '<div class="agenda-year"><h2 class="agenda-year__title">Schooljaar ' +
          startYear +
          "-" +
          endYear +
          "</h2></div>";

        const months = grouped[schoolYear];
        Object.keys(months)
          .sort()
          .forEach(function (monthKey) {
            const monthData = months[monthKey];
            html +=
              '<div class="agenda-month"><h3 class="agenda-month__title">' +
              monthData.label +
              "</h3>";

            monthData.events.forEach(function (event) {
              const d = new Date(event.date + "T00:00:00");
              const day = d.getDate();
              const monthShort = MAAND_KORT[d.getMonth()];

              let dateHtml;
              if (event.date_end && event.date_end !== event.date) {
                const dEnd = new Date(event.date_end + "T00:00:00");
                const dayEnd = dEnd.getDate();
                if (d.getMonth() === dEnd.getMonth()) {
                  dateHtml =
                    '<div class="agenda-event__date agenda-event__date--range">' +
                    '<div class="agenda-event__day">' +
                    day +
                    "–" +
                    dayEnd +
                    "</div>" +
                    '<div class="agenda-event__month">' +
                    monthShort +
                    "</div>" +
                    "</div>";
                } else {
                  dateHtml =
                    '<div class="agenda-event__date agenda-event__date--range">' +
                    '<div class="agenda-event__day">' +
                    day +
                    " " +
                    monthShort +
                    "</div>" +
                    '<div class="agenda-event__month">– ' +
                    dayEnd +
                    " " +
                    MAAND_KORT[dEnd.getMonth()] +
                    "</div>" +
                    "</div>";
                }
              } else {
                dateHtml =
                  '<div class="agenda-event__date">' +
                  '<div class="agenda-event__day">' +
                  day +
                  "</div>" +
                  '<div class="agenda-event__month">' +
                  monthShort +
                  "</div>" +
                  "</div>";
              }
              html += '<div class="agenda-event">';
              html += dateHtml;
              html += '<div class="agenda-event__content">';
              html +=
                '<h4 class="agenda-event__title">' +
                escapeHtml(event.title) +
                "</h4>";
              if (event.time) {
                html +=
                  '<p class="agenda-event__time">' +
                  escapeHtml(event.time) +
                  "</p>";
              }
              if (event.description) {
                html +=
                  '<p class="agenda-event__description">' +
                  escapeHtml(event.description) +
                  "</p>";
              }
              html += "</div></div>";
            });

            html += "</div>";
          });
      });

    container.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadEvents);
  } else {
    loadEvents();
  }
})();
