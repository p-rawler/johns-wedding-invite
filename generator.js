(function () {
  const namesInput = document.getElementById("namesInput");
  const baseUrlInput = document.getElementById("baseUrl");
  const resultsBody = document.getElementById("resultsBody");
  const linksOutput = document.getElementById("linksOutput");
  const entriesOutput = document.getElementById("entriesOutput");
  const status = document.getElementById("copyStatus");
  const generateBtn = document.getElementById("generateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyLinksBtn = document.getElementById("copyLinksBtn");
  const copyEntriesBtn = document.getElementById("copyEntriesBtn");

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
    return namesInput.value
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => {
        const displayName = cleanDisplayName(name);
        const code = uniqueCode(displayName, seen);
        const linkUrl = new URL(baseUrl.href);
        linkUrl.searchParams.set("guest", code);
        return {
          name: displayName,
          code,
          link: linkUrl.href,
          entry: `  ${JSON.stringify(code)}: ${JSON.stringify(displayName)},`
        };
      });
  }

  function render() {
    const rows = guestRows();
    resultsBody.innerHTML = "";

    rows.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.name}</td>
        <td><code>${row.code}</code></td>
        <td><a href="${row.link}" target="_blank" rel="noopener">${row.link}</a></td>
        <td><button class="mini-button" type="button" data-link="${row.link}">Copy</button></td>
      `;
      resultsBody.appendChild(tr);
    });

    linksOutput.value = rows.map((row) => row.link).join("\n");
    entriesOutput.value = rows.map((row) => row.entry).join("\n");
    status.textContent = rows.length ? `${rows.length} guest link${rows.length === 1 ? "" : "s"} ready.` : "No names entered.";
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
