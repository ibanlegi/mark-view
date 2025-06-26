# MarkView

## Project Overview

This project is a simple web-based Markdown viewer that dynamically loads and renders Markdown files as HTML. It supports syntax highlighting, table of contents (TOC) generation, copy-to-clipboard functionality for code blocks, and responsive design for mobile devices.

The main goal is to provide a clean and user-friendly interface to view Markdown documents directly in a browser with additional usability features.

---

## Project Structure

### Files and Their Roles

- **index.html**  
  The main HTML file that serves as the container for the app. It includes the basic page layout, navigation, TOC, content area, and script imports.

- **script/main.js**  
  The JavaScript file responsible for the core logic:  
  - Fetching and parsing the Markdown file specified in the URL parameters  
  - Converting Markdown to HTML using [Showdown](https://github.com/showdownjs/showdown)  
  - Generating the table of contents dynamically  
  - Adding copy buttons to code blocks  
  - Handling responsive TOC toggling for mobile devices  
  - Managing back-to-top button visibility  
  - Adding IDs and numbering to headings for better navigation

- **css/styles.css**  
  CSS styles for the Markdown content presentation.

- **css/styles_print.css**  
  Print-specific CSS styles for better formatting when printing the page.

- **favicon.png**  
  The favicon displayed in the browser tab.

---

## How to Use / Run

1. **Host the project files on a web server**  
   You can use any static server (e.g., `live-server`, `http-server`, Apache, Nginx).

2. **Open the `index.html` file in a browser** with URL parameters specifying the Markdown file and optional title, for example:  
```

index.html?file=docs/readme.md\&title=Project%20Documentation

```

3. The page will fetch the specified Markdown file, convert it to HTML, and display it with a dynamically generated table of contents.

4. Use the menu button (☰) on mobile to toggle the TOC visibility.

5. Click on "Copy" buttons inside code blocks to copy code snippets to the clipboard.

6. Scroll down to see the "Back to top" button appear for quick navigation.

---

## Dependencies and References

- **Showdown** (Markdown to HTML converter)  
CDN: `https://cdn.jsdelivr.net/npm/showdown/dist/showdown.min.js`  
GitHub: [https://github.com/showdownjs/showdown](https://github.com/showdownjs/showdown)

- **Intersection Observer API**  
Used for observing which headings are currently visible to highlight the corresponding TOC link.

- **Clipboard API**  
Used to copy code snippets to the user's clipboard.

---

## Notes

- The project assumes the Markdown files are accessible on the same server or via CORS-enabled URLs.

- The code includes accessibility features such as keyboard toggling of the TOC menu.

- The TOC supports nested headers (`h2` and `h3`), and headings are automatically numbered for clarity.