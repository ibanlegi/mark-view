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

- **server.js**  
  A simple Node.js Express server script to serve the project files and Markdown documents locally.

- **package.json**  
  Contains metadata and dependencies for the Node.js server.

---

## How to Use / Run

### Option 1: Static Server (any)

1. Host the project files on any static web server (e.g., `live-server`, Apache, Nginx).

2. Open `index.html` in a browser with URL parameters specifying the Markdown file and optional title, for example:  
```

index.html?file=docs/readme.md\&title=Project%20Documentation

```

### Option 2: Node.js Local Server (recommended)

1. Ensure [Node.js](https://nodejs.org/) is installed.

2. Place `server.js` and `package.json` at the root of your project.

3. Open a terminal and run:

```bash
npm install
npm start
````

4. Open your browser and navigate to:

   ```
   http://localhost:3000/index.html?file=path/to/your.md&title=Your%20Title
   ```

   Replace `path/to/your.md` with the relative path to your Markdown file.


### Demo (GIF)

<p align="center">
  <img src="demo.gif" alt="Demo" width="600">
</p>


> This animation shows usage of the viewer with TOC toggle, code block copy, and scrolling. The loaded file is `example.md`.


## Dependencies and References

- **Showdown** (Markdown to HTML converter)  
CDN: `https://cdn.jsdelivr.net/npm/showdown/dist/showdown.min.js`  
GitHub: [https://github.com/showdownjs/showdown](https://github.com/showdownjs/showdown)

- **Express**
  Node.js web framework used to serve files locally.

- **Intersection Observer API**  
Used for observing which headings are currently visible to highlight the corresponding TOC link.

- **Clipboard API**  
Used to copy code snippets to the user's clipboard.

---

## Notes

- The project assumes the Markdown files are accessible on the same server or via CORS-enabled URLs.

- The code includes accessibility features such as keyboard toggling of the TOC menu.

- The TOC supports nested headers (`h2` and `h3`), and headings are automatically numbered for clarity.

- Using the Node.js server is recommended for local testing to avoid CORS issues and easily serve all files.