# MarkView

## Project Overview

This project is a simple web-based Markdown viewer that dynamically loads and renders Markdown files as HTML. It supports syntax highlighting, table of contents (TOC) generation, copy-to-clipboard functionality for code blocks, and responsive design for mobile devices.

Additionally, it includes a file upload dialog powered by SweetAlert, allowing users to drag-and-drop or select a local .md file to view. The dialog also lets users choose whether to display the table of contents.

The main goal is to provide a clean and user-friendly interface to view Markdown documents directly in a browser with additional usability features.

## Project Structure

### Files and Their Roles

- **index.html**  
  The main HTML file that serves as the container for the app. It includes the basic page layout, navigation, TOC, content area, and script imports.

- **script/main.js**  
  The JavaScript file responsible for the core logic:

  * Fetching and parsing the Markdown file specified in the URL parameters
  * Converting Markdown to HTML using [Showdown](https://github.com/showdownjs/showdown)
  * Generating the table of contents dynamically
  * Adding copy buttons to code blocks
  * Handling responsive TOC toggling for mobile devices
  * Managing back-to-top button visibility
  * Adding IDs and numbering to headings for better navigation
  * **Displaying a SweetAlert upload dialog if no file is specified**, allowing drag & drop or file selection, with an option to show/hide the TOC
  * Redirecting to `index.html` if the upload dialog is canceled
  * Preventing the dialog from being dismissed by clicking outside

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

## How to Use / Run

MarkView offers multiple ways to load and view Markdown files, adapting to different user needs and environments:

### 1. Load a Markdown File via URL Parameters

You can directly open a Markdown file hosted on the server or accessible via a URL by passing the `file` parameter in the URL. For example:

```
index.html?file=docs/readme.md&title=Project%20Documentation&showToc=true
```

* `file` — URL or relative path to the `.md` file.
* `title` — (Optional) Title to display in the browser tab.
* `showToc` — (Optional) `true` or `false` to show or hide the Table of Contents.

This is ideal when you already know the file location or want to link to a specific document.

### 2. Upload a Local Markdown File via Dialog

If you open `index.html` without URL parameters or if the specified file cannot be loaded, MarkView displays an **upload dialog**.

* Drag and drop a local `.md` file or click a button to select one.
* Checkbox option to toggle the Table of Contents display.
* After selecting a file, the viewer renders it directly.
* Canceling the dialog redirects back to the home page (`index.html`).
* The dialog cannot be closed by clicking outside to ensure a deliberate choice.

This method is perfect for users who want to view Markdown files stored locally on their computer without manually specifying URLs.

### 3. Running via Local Node.js Server (Recommended for Development)

* Use the included `server.js` to run a local Express server.
* This avoids common CORS issues when fetching local files.
* Start the server with `npm install` and `npm start`.
* Open the viewer in a browser with URL parameters pointing to Markdown files served by the local server.

This setup is recommended for development, testing, or when working with many Markdown files locally.


### 4. Responsive Viewing on Mobile Devices

MarkView is designed to work well on different screen sizes:

* The Table of Contents (TOC) can be toggled on mobile using a dedicated button.
* Content layout adapts to smaller screens for readability.
* Copy-to-clipboard buttons for code blocks work on mobile browsers.

This ensures a good reading experience wherever you are.


### Demo (GIF)

<p align="center">
  <img src="demo.gif" alt="Demo" width="600">
</p>


> This animation shows usage of the viewer with TOC toggle, code block copy, and scrolling. The loaded file is `example.md`.


## Dependencies and References
 
* **Showdown** (Markdown to HTML converter)
  CDN: [https://cdn.jsdelivr.net/npm/showdown/dist/showdown.min.js](https://cdn.jsdelivr.net/npm/showdown/dist/showdown.min.js)
  GitHub: [https://github.com/showdownjs/showdown](https://github.com/showdownjs/showdown)

* **SweetAlert2** (for the upload dialog)
  GitHub: [https://github.com/sweetalert2/sweetalert2](https://github.com/sweetalert2/sweetalert2)

- **Express**
  Node.js web framework used to serve files locally.

- **Intersection Observer API**  
Used for observing which headings are currently visible to highlight the corresponding TOC link.

- **Clipboard API**  
Used to copy code snippets to the user's clipboard.

## Notes

- The project assumes the Markdown files are accessible on the same server or via CORS-enabled URLs.

- The code includes accessibility features such as keyboard toggling of the TOC menu.

- The TOC supports nested headers (`h2` and `h3`), and headings are automatically numbered for clarity.

- Using the Node.js server is recommended for local testing to avoid CORS issues and easily serve all files.
