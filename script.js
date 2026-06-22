(function () {
  const wedding = {
    title: "Wedding of John Michael Oliba and Jane Namubiru",
    date: "2026-08-29T11:00:00+03:00",
    ceremonyVenue: "Watoto Church Bweyogerere",
    receptionVenue: "PDN opposite Watoto Bweyogerere"
  };

  const guests = window.WEDDING_GUESTS || {};
  const params = new URLSearchParams(window.location.search);
  const guestCode = (params.get("guest") || "").trim().toLowerCase();
  const guestName = guests[guestCode] || "Guest";
  const weddingDate = new Date(wedding.date);

  const guestNameEl = document.getElementById("guestName");
  const guestInlineEl = document.getElementById("guestInline");

  if (guestNameEl) {
    guestNameEl.textContent = guestName;
  }

  if (guestInlineEl) {
    guestInlineEl.textContent = guestName;
  }

  if (guestName !== "Guest") {
    document.title = `${guestName}, you are invited | John & Jane`;
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date();
    const remaining = Math.max(0, weddingDate.getTime() - now.getTime());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const values = {
      countDays: days,
      countHours: pad(hours),
      countMinutes: pad(minutes),
      countSeconds: pad(seconds)
    };

    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  function buildRsvpMessage() {
    const greetingName = guestName === "Guest" ? "Guest" : guestName;
    return `Hello, this is ${greetingName}. I am responding to John Michael Oliba and Jane Namubiru's wedding invitation for Saturday, 29th August 2026.`;
  }

  function wireWhatsAppLinks() {
    const message = encodeURIComponent(buildRsvpMessage());
    document.querySelectorAll(".js-whatsapp").forEach((link) => {
      const phone = link.getAttribute("data-phone");
      if (phone) {
        link.href = `https://wa.me/${phone}?text=${message}`;
        link.target = "_blank";
        link.rel = "noopener";
      }
    });

    const shortcut = document.querySelector(".js-rsvp-shortcut");
    const firstWhatsApp = document.querySelector(".js-whatsapp");
    if (shortcut && firstWhatsApp) {
      shortcut.href = firstWhatsApp.href;
      shortcut.target = "_blank";
      shortcut.rel = "noopener";
    }
  }

  function calendarDescription() {
    return [
      `Guest: ${guestName}`,
      "Ceremony: Watoto Church Bweyogerere at 11:00am.",
      "Reception: PDN opposite Watoto Bweyogerere at 2:00pm.",
      "RSVP: Ogara Collin 0772 559364 / 0702 559364, Glenn Jonathan Ekalu 0772 965252, Stella Ruth Apeduno 0779 460 547."
    ].join("\\n");
  }

  function formatUtc(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  function wireCalendarActions() {
    const start = new Date("2026-08-29T11:00:00+03:00");
    const end = new Date("2026-08-29T18:00:00+03:00");
    const description = calendarDescription();
    const google = document.getElementById("googleCalendar");
    const download = document.getElementById("downloadCalendar");

    if (google) {
      const url = new URL("https://calendar.google.com/calendar/render");
      url.searchParams.set("action", "TEMPLATE");
      url.searchParams.set("text", wedding.title);
      url.searchParams.set("dates", `${formatUtc(start)}/${formatUtc(end)}`);
      url.searchParams.set("location", wedding.ceremonyVenue);
      url.searchParams.set("details", description);
      google.href = url.toString();
    }

    if (download) {
      download.addEventListener("click", () => {
        const ics = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//John and Jane Wedding//Invite//EN",
          "CALSCALE:GREGORIAN",
          "BEGIN:VEVENT",
          "UID:john-jane-wedding-20260829@static-invite",
          `DTSTAMP:${formatUtc(new Date())}`,
          `DTSTART:${formatUtc(start)}`,
          `DTEND:${formatUtc(end)}`,
          `SUMMARY:${wedding.title}`,
          `LOCATION:${wedding.ceremonyVenue}`,
          `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
          "END:VEVENT",
          "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "john-and-jane-wedding.ics";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      });
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
  wireWhatsAppLinks();
  wireCalendarActions();
}());
