# Code Folder - Viewer and Styling Resources

This folder contains all the code and styling for viewing the Lalita Sahasranama commentaries.

## Files Overview

### Main Pages

- **[index.html](index.html)** - Landing page with project overview and navigation
- **[viewer.html](viewer.html)** - Main viewer showing all 1000 names with search functionality
- **[name-view.html](name-view.html)** - Individual name viewer with prev/next navigation and commentary
- **[names-index.html](names-index.html)** - Comprehensive searchable index with grid/list views and filters
- **[soubhagya-index.html](soubhagya-index.html)** - Alternative index page for SoubhagyaBhaskara folder

### Styling

- **[style.css](style.css)** - Main stylesheet with Annapurna SIL font and traditional color scheme
- **[vscode-preview.css](vscode-preview.css)** - VS Code specific markdown preview styling

### Configuration

- **[.gitignore](.gitignore)** - Git ignore rules for this folder

## Features

### viewer.html (Main Lalita Sahasranama Viewer)
- Displays all 1000 names in a searchable list
- Real-time search by name or number
- Click any name to view its detailed commentary
- Clean, list-based interface
- Back to home navigation

### name-view.html (Individual Name Commentary)
- Full commentary display for each name
- Previous/Next navigation buttons
- Dropdown selector to jump to any name
- Keyboard shortcuts (← →)
- Back to list navigation
- Markdown rendering with marked.js
- URL-based navigation (bookmarkable)

### names-index.html (Alternative Browse View)
Based on ashtadhyayi.com/sutraani structure:
- Real-time search by name or number
- Grid and List view toggle
- Quick filter buttons (1-100, 101-300, etc.)
- Quick jump navigation to sections
- Responsive design for all devices

### Styling Features
- Annapurna SIL font for proper Sanskrit rendering
- Traditional maroon (#8B0000) and gold (#DAA520) color scheme
- Gradient backgrounds
- Responsive layout
- Professional academic appearance

## Usage

### For GitHub Pages
All files are ready for GitHub Pages deployment. Access at:
- Main: `https://adarshtadwai.github.io/LalitaSahastranaamaCommentaries/Code/`
- Names Index: `https://adarshtadwai.github.io/LalitaSahastranaamaCommentaries/Code/names-index.html`
- Viewer: `https://adarshtadwai.github.io/LalitaSahastranaamaCommentaries/Code/viewer.html`

### For Local Development
Simply open any HTML file in a web browser. All paths are relative and will work locally.

## File Paths
All HTML files reference the SoubhagyaBhaskara markdown files using relative paths:
- `../SoubhagyaBhaskara/0001.md` to `../SoubhagyaBhaskara/1000.md`

---

ॐ श्रीमात्रे नमः
