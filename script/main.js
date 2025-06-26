// Get URL parameters
const params = new URLSearchParams(window.location.search);
const markdownFile = params.get("file");
const pageTitle = params.get("title") || "Untitled";

document.title = decodeURIComponent(pageTitle);

// Load and convert markdown to HTML
async function loadMarkdown() {
  try {
    const response = await fetch(markdownFile);
    if (!response.ok) throw new Error("File not found");

    const markdownText = await response.text();
    const converter = new showdown.Converter({
      tables: true,
      strikethrough: true,
      tasklists: true,
      simplifiedAutoLink: true
    });

    const htmlContent = converter.makeHtml(markdownText);
    const contentEl = document.getElementById("content");
    contentEl.innerHTML = htmlContent;

    addCopyButtonsToCodeBlocks();
    addHeadingIdsAndNumbers();
    generateTOC();
    observeHeaders();
    handleBackToTopVisibility();
  } catch (error) {
    document.getElementById("content").innerHTML = "Error loading the Markdown file.";
    console.error("Markdown load error:", error);
  }
}

// Add "Copy" buttons to <pre><code> blocks
function addCopyButtonsToCodeBlocks() {
  const contentEl = document.getElementById("content");
  const codeBlocks = contentEl.querySelectorAll('pre > code');

  codeBlocks.forEach(codeBlock => {
    const pre = codeBlock.parentElement;

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.className = 'copy-code-btn';
    copyBtn.type = 'button';
    copyBtn.title = 'Copy code';

    // Style button
    copyBtn.style.position = 'absolute';
    copyBtn.style.top = '5px';
    copyBtn.style.right = '5px';
    copyBtn.style.padding = '2px 6px';
    copyBtn.style.fontSize = '0.9em';
    copyBtn.style.cursor = 'pointer';

    pre.style.position = 'relative';
    pre.appendChild(copyBtn);

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeBlock.textContent).then(() => {
        copyBtn.textContent = 'Copied';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 1500);
      }).catch(() => {
        alert('Error copying code');
      });
    });
  });
}

// Add IDs and numbering to H2 and H3 headings
function addHeadingIdsAndNumbers() {
  const headers = document.querySelectorAll("#content h1, #content h2, #content h3");
  const counters = [0, 0, 0];

  headers.forEach(header => {
    const level = parseInt(header.tagName[1]) - 1;
    counters[level]++;
    for (let i = level + 1; i < counters.length; i++) counters[i] = 0;

    const numbering = counters.slice(0, level + 1).join('.');
    header.textContent = `${numbering}. ${header.textContent}`;

    if (!header.id) {
      header.id = 'header-' + numbering.replace(/\./g, '-');
    }
  });
}

// Generate the table of contents
function generateTOC() {
  const tocList = document.getElementById("toc-list");
  tocList.innerHTML = "";
  const headers = document.querySelectorAll("#content h1, #content h2, #content h3");

  headers.forEach(header => {
    const level = parseInt(header.tagName[1]) - 1;
    const li = document.createElement("li");
    li.style.marginLeft = `${level * 10}px`;

    const a = document.createElement("a");
    a.href = `#${header.id}`;
    a.textContent = header.textContent;

    li.appendChild(a);
    tocList.appendChild(li);
  });
}

// Observe which heading is in view and highlight it in the TOC
function observeHeaders() {
  const options = {
    root: null,
    rootMargin: '0px 0px -80% 0px',
    threshold: 0
  };
  const links = document.querySelectorAll('#toc a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`#toc a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, options);

  document.querySelectorAll('#content h1, #content h2, #content h3').forEach(header => {
    observer.observe(header);
  });
}

// Show or hide "back to top" button
function handleBackToTopVisibility() {
  const backToTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 300 ? "block" : "none";
  });
}

// Responsive layout for TOC
const toc = document.getElementById('toc');
const tocToggleMobile = document.getElementById('toc-toggle-mobile');
const content = document.getElementById('content');

function updateContentPadding() {
  if (window.innerWidth <= 768 && toc.classList.contains('visible')) {
    content.style.paddingTop = '220px';
  } else {
    content.style.paddingTop = '20px';
  }
}

// Toggle TOC on mobile
tocToggleMobile.addEventListener('click', () => {
  toc.classList.toggle('visible');
  tocToggleMobile.setAttribute('aria-expanded', toc.classList.contains('visible'));
  updateContentPadding();
});

// Toggle TOC with keyboard
tocToggleMobile.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    tocToggleMobile.click();
  }
});

// Init when page loads
window.addEventListener('load', () => {
  if (window.innerWidth > 768) {
    toc.classList.add('visible');
    content.style.paddingTop = '20px';
  } else {
    toc.classList.remove('visible');
    tocToggleMobile.setAttribute('aria-expanded', false);
    content.style.paddingTop = '20px';
  }
  loadMarkdown().then(updateContentPadding);
});
