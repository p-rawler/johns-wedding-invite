(function () {
  const namesInput = document.getElementById("namesInput");
  const baseUrlInput = document.getElementById("baseUrl");
  const resultsBody = document.getElementById("resultsBody");
  const linksOutput = document.getElementById("linksOutput");
  const entriesOutput = document.getElementById("entriesOutput");
  const status = document.getElementById("copyStatus");
  const sourceNote = document.getElementById("guestSourceNote");
  const generateBtn = document.getElementById("generateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyLinksBtn = document.getElementById("copyLinksBtn");
  const copyEntriesBtn = document.getElementById("copyEntriesBtn");
  const savedGuests = window.WEDDING_GUESTS || {};

  function defaultBaseUrl() {
    const indexUrl = new URL("index.html", window.location.href);
    indexUrl.search = "";
    indexUrl.hash = "";
    return indexUrl.href;
  }

  function cleanDisplayName(name) {
    return name.trim().replace(/\s+/g, " ");
  }

  function slugify(name) {
    const cleaned = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/['"]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return cleaned || "guest";
  }

  function uniqueCode(name, seen) {
    const base = slugify(name);
    let code = base;
    let count = 2;
    while (seen.has(code)) {
      code = `${base}-${count}`;
      count += 1;
    }
    seen.add(code);
    return code;
  }

  function buildLink(baseUrl, code) {
    const linkUrl = new URL(baseUrl.href);
    linkUrl.searchParams.set("guest", code);
    return linkUrl.href;
  }

  function buildEntry(code, name) {
    return `  ${JSON.stringify(code)}: ${JSON.stringify(name)},`;
  }

  function savedGuestRows(baseUrl, seen) {
    return Object.entries(savedGuests).map(([code, name]) => {
      const displayName = cleanDisplayName(String(name));
      seen.add(code);
      return {
        name: displayName,
        code,
        link: buildLink(baseUrl, code),
        entry: buildEntry(code, displayName),
        source: "guests.js"
      };
    });
  }

  function extraGuestRows(baseUrl, seen) {
    return namesInput.value
      .split(/\r?\n/)
      .map((name) => cleanDisplayName(name))
      .filter(Boolean)
      .map((displayName) => {
        const code = uniqueCode(displayName, seen);
        return {
          name: displayName,
          code,
          link: buildLink(baseUrl, code),
          entry: buildEntry(code, displayName),
          source: "extra"
        };
      });
  }

  function cleanBaseUrl(value) {
    try {
      const url = new URL(value || defaultBaseUrl(), window.location.href);
      url.search = "";
      url.hash = "";
      return url;
    } catch (error) {
      return new URL(defaultBaseUrl());
    }
  }

  function guestRows() {
    const seen = new Set();
    const baseUrl = cleanBaseUrl(baseUrlInput.value);
    return [
      ...savedGuestRows(baseUrl, seen),
      ...extraGuestRows(baseUrl, seen)
    ];
  }

  function render() {
    const rows = guestRows();
    const savedCount = Object.keys(savedGuests).length;
    const extraCount = rows.length - savedCount;
    resultsBody.innerHTML = "";

    rows.forEach((row) => {
      const tr = document.createElement("tr");
      const nameCell = document.createElement("td");
      const codeCell = document.createElement("td");
      const linkCell = document.createElement("td");
      const copyCell = document.createElement("td");
      const code = document.createElement("code");
      const link = document.createElement("a");
      const copyButton = document.createElement("button");

      nameCell.textContent = row.name;
      code.textContent = row.code;
      link.href = row.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = row.link;
      copyButton.className = "mini-button";
      copyButton.type = "button";
      copyButton.dataset.link = row.link;
      copyButton.textContent = "Copy";

      codeCell.appendChild(code);
      linkCell.appendChild(link);
      copyCell.appendChild(copyButton);
      tr.append(nameCell, codeCell, linkCell, copyCell);
      resultsBody.appendChild(tr);
    });

    linksOutput.value = rows.map((row) => row.link).join("\n");
    entriesOutput.value = rows.map((row) => row.entry).join("\n");
    if (sourceNote) {
      sourceNote.textContent = savedCount
        ? `${savedCount} guest${savedCount === 1 ? "" : "s"} loaded from guests.js. Add optional names below only when you need temporary extra links.`
        : "No guests were found in guests.js. Add guests there, or paste optional names below.";
    }
    status.textContent = rows.length
      ? `${rows.length} guest link${rows.length === 1 ? "" : "s"} ready${extraCount > 0 ? `, including ${extraCount} extra` : ""}.`
      : "No guests found.";
  }

  async function copyText(text, label) {
    if (!text.trim()) {
      status.textContent = "Nothing to copy yet.";
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      status.textContent = `${label} copied.`;
    } catch (error) {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.left = "-999px";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
      status.textContent = `${label} copied.`;
    }
  }

  baseUrlInput.value = defaultBaseUrl();
  generateBtn.addEventListener("click", render);
  namesInput.addEventListener("input", render);
  baseUrlInput.addEventListener("input", render);
  clearBtn.addEventListener("click", () => {
    namesInput.value = "";
    render();
  });
  copyLinksBtn.addEventListener("click", () => copyText(linksOutput.value, "Links"));
  copyEntriesBtn.addEventListener("click", () => copyText(entriesOutput.value, "Guest entries"));
  resultsBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-link]");
    if (button) {
      copyText(button.getAttribute("data-link"), "Link");
    }
  });

  render();
}());
