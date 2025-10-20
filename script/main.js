// === URL Parameters ===
const params = new URLSearchParams(window.location.search);
const markdownFile = params.get("file");
const pageTitle = params.get("title") || "Untitled";
const showToc = params.get("showToc") !== "false"; // true by default

document.title = decodeURIComponent(pageTitle);

// === Upload Dialog ===
function showUploadDialog() {
  Swal.fire({
    title: "<strong>Upload a Markdown File</strong>",
    html: `
      <div id="drop-area" style="border: 2px dashed #ccc; padding: 20px; text-align: center; border-radius: 10px;">
        <p>Drag and drop a <strong>.md</strong> file here</p>
        <p>or</p>
        <input type="file" id="fileElem" accept=".md" style="display:none" />
        <button type="button" id="fileSelect" class="swal2-confirm swal2-styled" style="background-color: #3085d6;">
          Choose a File
        </button>
        <p id="fileName" style="margin-top: 10px; color: #333;"></p>
        <div style="margin-top: 15px; text-align: left;">
          <input type="checkbox" id="showTocCheckbox" checked />
          <label for="showTocCheckbox">Show Table of Contents</label>
        </div>
      </div>
    `,
    footer: '<a href="https://ileginyora.com/d2.html?file=./projects/mark-view/mark-view.md&title=Mark+View+documentation">Read the project overview</a>',
    showCloseButton: false,    // No close (X) button
    showCancelButton: true,
    allowOutsideClick: false,   // Disable closing by clicking outside
    focusConfirm: false,
    confirmButtonText: `<i class="fa fa-thumbs-up"></i> Submit`,
    confirmButtonAriaLabel: "Submit file",
    cancelButtonText: "Cancel",
    cancelButtonAriaLabel: "Cancel upload",
    preConfirm: () => {
      const fileInput = document.getElementById("fileElem");
      const showTocCheckbox = document.getElementById("showTocCheckbox");

      if (!fileInput.files.length || !fileInput.files[0].name.endsWith(".md")) {
        Swal.showValidationMessage("Please select a valid .md file.");
        return false;
      }

      const file = fileInput.files[0];
      const showToc = showTocCheckbox.checked;

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const content = e.target.result;
          sessionStorage.setItem("markdown_content", content);

          const uploadedFilename = encodeURIComponent(file.name);
          const title = encodeURIComponent("Uploaded Markdown File");

          window.location.href = `index.html?file=${uploadedFilename}&title=${title}&showToc=${showToc}`;
          resolve();
        };
        reader.readAsText(file);
      });
    },
    didOpen: () => {
      const dropArea = document.getElementById("drop-area");
      const fileInput = document.getElementById("fileElem");
      const fileButton = document.getElementById("fileSelect");
      const fileName = document.getElementById("fileName");

      const validateFile = (file) => {
        if (file && file.name.endsWith(".md")) {
          fileName.textContent = `Selected file: ${file.name}`;
          fileName.style.color = "#333";
          return true;
        } else {
          fileName.textContent = "Invalid file type. Only .md allowed.";
          fileName.style.color = "red";
          fileInput.value = "";
          return false;
        }
      };

      fileButton.addEventListener("click", () => fileInput.click());

      fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) validateFile(fileInput.files[0]);
      });

      ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, e => { e.preventDefault(); e.stopPropagation(); }, false);
      });

      ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
          dropArea.style.borderColor = "#3c8dbc";
          dropArea.style.background = "#f0f8ff";
        }, false);
      });

      ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
          dropArea.style.borderColor = "#ccc";
          dropArea.style.background = "white";
        }, false);
      });

      dropArea.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0 && validateFile(files[0])) {
          fileInput.files = files;
        }
      });
    }
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      window.location.href = "index.html";
    }
  });
}


function setupDropArea() {
  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("fileElem");
  const fileButton = document.getElementById("fileSelect");
  const fileName = document.getElementById("fileName");

  fileButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => validateFile(fileInput.files[0], fileName));

  ["dragenter", "dragover", "dragleave", "drop"].forEach(event => {
    dropArea.addEventListener(event, e => e.preventDefault());
  });

  dropArea.addEventListener("drop", e => {
    const file = e.dataTransfer.files[0];
    if (validateFile(file, fileName)) fileInput.files = e.dataTransfer.files;
  });
}

function validateFile(file, display) {
  if (file && file.name.endsWith(".md")) {
    display.textContent = `Selected file: ${file.name}`;
    display.style.color = "#333";
    return true;
  }
  display.textContent = "Invalid file type. Only .md allowed.";
  display.style.color = "red";
  return false;
}

// === Load Markdown ===
async function loadMarkdown() {
  const cachedContent = sessionStorage.getItem("markdown_content");

  if (cachedContent) {
    renderMarkdown(cachedContent);
    sessionStorage.removeItem("markdown_content");
  } else if (markdownFile) {
    try {
      const response = await fetch(markdownFile);
      if (!response.ok) throw new Error("File not found");
      renderMarkdown(await response.text());
    } catch (err) {
      document.getElementById("content").innerHTML = "Error loading the Markdown file.";
      console.error("Markdown load error:", err);
    }
  } else {
    showUploadDialog();
  }
}

function renderMarkdown(text) {
  const converter = new showdown.Converter({
    tables: true, strikethrough: true, tasklists: true, simplifiedAutoLink: true
  });

  const contentEl = document.getElementById("content");
  contentEl.innerHTML = converter.makeHtml(text);

  addCopyButtons();
  addHeadingIds();
  if (showToc) {
    document.getElementById('toc').style.display = "block";
    generateTOC();
    highlightTOC();
  } else {
    document.getElementById('toc').style.display = "none";
  }
  toggleBackToTop();
  addFileIcons();
}

function addFileIcons() {
  const ICONS = {
    github: "https://img.icons8.com/material-rounded/24/github.png",
    wiki: "https://img.icons8.com/?size=100&id=gDi80jDvhca2&format=png&color=000000",
    pdf: "https://img.icons8.com/?size=100&id=4bYa3chMzX2w&format=png&color=000000",
    image: "https://img.icons8.com/?size=100&id=14089&format=png&color=000000",
    default: "https://img.icons8.com/?size=100&id=59826&format=png&color=000000",
  };

  const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];

  const getIconUrl = (url) => {
    if (url.includes("github.com")) return ICONS.github;
    if (url.includes("wiki")) return ICONS.wiki;

    const ext = url.split('.').pop().toLowerCase();
    if (ext === "pdf") return ICONS.pdf;
    if (IMAGE_EXTENSIONS.includes(ext)) return ICONS.image;

    return ICONS.default;
  };

  const createIcon = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    const img = document.createElement("img");
    img.src = getIconUrl(url);
    img.alt = ext ? `[${ext.toUpperCase()}]` : "";
    Object.assign(img.style, {
      width: "16px",
      height: "16px",
      marginRight: "4px",
      verticalAlign: "middle",
    });
    return img;
  };

  document.querySelectorAll("#content a[href]").forEach(link => {
    const url = link.getAttribute("href");
    if (!url) return;
    const icon = createIcon(url);
    link.prepend(icon);
  });
}


function addCopyButtons() {
  document.querySelectorAll("#content pre > code").forEach(code => {
    const btn = document.createElement("button");

    const svg_copier = `
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
  <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
  <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
</svg>`;

    const svg_copie = `
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success">
  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
</svg>`;

    btn.innerHTML = svg_copier;
    btn.className = "copy-code-btn";
    btn.onclick = () => navigator.clipboard.writeText(code.textContent)
      .then(() => {
        btn.innerHTML = svg_copie;
        setTimeout(() => btn.innerHTML = svg_copier, 1500);
      });

    code.parentElement.style.position = "relative";
    code.parentElement.appendChild(btn);
  });
}

function addHeadingIds() {
  const counters = [0, 0, 0];
  document.querySelectorAll("#content h1, #content h2, #content h3").forEach(h => {
    const level = parseInt(h.tagName[1]) - 1;
    counters[level]++;
    for (let i = level + 1; i < 3; i++) counters[i] = 0;
    const numbering = counters.slice(0, level + 1).join(".");
    h.textContent = `${numbering}. ${h.textContent}`;
    h.id = h.id || `header-${numbering.replace(/\./g, '-')}`;
  });
}

function generateTOC() {
  const list = document.getElementById("toc-list");
  list.innerHTML = "";
  document.querySelectorAll("#content h1, #content h2, #content h3").forEach(h => {
    const li = document.createElement("li");
    li.style.marginLeft = `${(parseInt(h.tagName[1]) - 1) * 10}px`;
    const a = document.createElement("a");
    a.href = `#${h.id}`;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
  });
}

function highlightTOC() {
  const links = document.querySelectorAll('#toc a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`#toc a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '0px 0px -80% 0px' });

  document.querySelectorAll('#content h1, #content h2, #content h3').forEach(h => observer.observe(h));
}

function toggleBackToTop() {
  const btn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 300 ? "block" : "none";
  });
}

// === Responsive TOC ===
const toc = document.getElementById('toc');
const tocToggle = document.getElementById('toc-toggle-mobile');
const content = document.getElementById('content');

function adjustPadding() {
  if (showToc && window.innerWidth <= 768 && toc.classList.contains('visible')) {
    content.style.paddingTop = '220px';
  } else {
    content.style.paddingTop = '20px';
  }
}

if (tocToggle) {
  tocToggle.addEventListener('click', () => {
    toc.classList.toggle('visible');
    tocToggle.setAttribute('aria-expanded', toc.classList.contains('visible'));
    adjustPadding();
  });

  tocToggle.addEventListener('keydown', e => {
    if (['Enter', ' '].includes(e.key)) {
      e.preventDefault();
      tocToggle.click();
    }
  });
}

window.addEventListener('load', () => {
  if (showToc && window.innerWidth > 768) {
    toc.classList.add('visible');
  } else {
    toc.classList.remove('visible');
    if (tocToggle) tocToggle.setAttribute('aria-expanded', false);
  }
  loadMarkdown().then(adjustPadding);
});
