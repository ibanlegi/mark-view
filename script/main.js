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

          window.location.href = `upload.html?file=${uploadedFilename}&title=${title}&showToc=${showToc}`;
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
}

function addCopyButtons() {
  document.querySelectorAll("#content pre > code").forEach(code => {
    const btn = document.createElement("button");
    btn.textContent = "Copy";
    btn.className = "copy-code-btn";
    Object.assign(btn.style, { position: "absolute", top: "5px", right: "5px" });
    btn.onclick = () => navigator.clipboard.writeText(code.textContent)
      .then(() => btn.textContent = "Copied")
      .finally(() => setTimeout(() => btn.textContent = "Copy", 1500));
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
