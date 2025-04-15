Okay, let's get your Wagn Project Tracker set up with Vite, update the necessary metadata, and create a polished `README.md` for a GitHub release.

Here's the plan:

1.  **Update `package.json`:** Add Vite, React, Tailwind CSS, and related dependencies/scripts. Include project metadata.
2.  **Install Dependencies:** You'll need to run `bun install` after updating `package.json`.
3.  **Create Vite Config (`vite.config.ts`):** Configure Vite to work with React.
4.  **Create Tailwind Config (`tailwind.config.js`, `postcss.config.js`):** Move the theme configuration from `index.html` to the Tailwind config file.
5.  **Create Main CSS File (`src/index.css`):** Import Tailwind directives and add global styles previously in `index.html`.
6.  **Modify `index.html`:** Move it to the project root, simplify it for Vite, add SEO meta tags, and link the main entry point (`src/main.tsx`).
7.  **Update `src/main.tsx`:** Ensure it imports the new global CSS file.
8.  **Create `README.md`:** Write a comprehensive README for GitHub.
9.  **Create `.gitignore`:** Add a standard gitignore file.

---

**1. Updated `package.json`**

Replace the content of your `package.json` with this:

```json
{
  "name": "wagn-project-tracker",
  "version": "1.0.0",
  "private": true,
  "description": "A simple, offline-first project tracker using React, Zustand, and Tailwind CSS for organizing, estimating, and tracking project tasks with Markdown import/export.",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "echo 'Lint script not configured yet'",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hot-toast": "^2.4.1",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.4.5",
    "vite": "^5.2.13"
  },
  "author": "Wagn AI <hello@wagn.ai> (https://wagn.ai)",
  "license": "MIT",
  "keywords": [
    "project tracker",
    "task management",
    "estimation",
    "pert",
    "react",
    "zustand",
    "tailwind css",
    "markdown",
    "offline first",
    "vite"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/wagn-project-tracker.git" // <-- TODO: Update this URL
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/wagn-project-tracker/issues" // <-- TODO: Update this URL
  },
  "homepage": "https://github.com/YOUR_USERNAME/wagn-project-tracker#readme" // <-- TODO: Update this URL
}
```

_Action:_ Replace `YOUR_USERNAME/wagn-project-tracker` with your actual GitHub username and repository name in the `repository`, `bugs`, and `homepage` fields.

**2. Install Dependencies**

Open your terminal in the project's root directory (`/Users/asant/Code/playground/wagn/project-tracker`) and run:

```bash
bun install
```

**3. Create Vite Config (`vite.config.ts`)**

Create a new file named `vite.config.ts` in the project root directory:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
```

**4. Create Tailwind Config (`tailwind.config.js`, `postcss.config.js`)**

- **`tailwind.config.js`**: Create this file in the project root. We'll move the theme from `index.html` here.

  ```javascript
  /** @type {import('tailwindcss').Config} */
  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Scan all relevant files in src
    ],
    theme: {
      extend: {
        colors: {
          "dawn-coral": "#FF7F6B",
          "horizon-blue": "#4A90E2",
          "morning-gold": "#FFB946",
          "earth-brown": "#8B6D5C",
          "warm-parchment": "#F7F3EE",
          "muted-sage": "#A8B8A0",
          "deep-valley": "#1A2B49",
        },
        fontFamily: {
          serif: ["Spectral", "Georgia", "serif"],
          sans: ["Inter", "system-ui", "sans-serif"],
        },
        boxShadow: {
          soft: "0 4px 12px rgba(26, 43, 73, 0.08)",
          "glow-coral": "0 0 15px 0 rgba(255, 127, 107, 0.5)",
          "glow-blue": "0 0 15px 0 rgba(74, 144, 226, 0.5)",
        },
        borderRadius: {
          xl: "0.8rem",
        },
        // Add the canvas texture as a background image utility
        backgroundImage: {
          "canvas-texture":
            "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238B6D5C' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E\")",
        },
      },
    },
    plugins: [],
  };
  ```

- **`postcss.config.js`**: Create this file in the project root.

  ```javascript
  export default {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };
  ```

**5. Create Main CSS File (`src/index.css`)**

Create a new file `src/index.css`:

```css
/* Import Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Spectral:wght@300;400;600&display=swap");

/* Inject Tailwind's base, components, and utilities styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Apply base font families */
body {
  font-family: theme("fontFamily.sans"); /* Use Inter as default */
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: theme("fontFamily.serif"); /* Use Spectral for headings */
}
```

**6. Modify `index.html`**

- **Move:** Move the existing `index.html` file from its current location (if it's not already there) to the project root directory (`/Users/asant/Code/playground/wagn/project-tracker`).
- **Update Content:** Replace its content with the following:

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <!-- Optional: Add a favicon -->
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Organize, estimate, and track your project tasks with this simple, offline-first project tracker. Supports Markdown import/export and PERT-like estimation."
      />
      <!-- Preconnect for Google Fonts (already handled by CSS @import, but good practice) -->
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <!-- Note: Font loading is now handled in src/index.css -->
      <title>Wagn Project Tracker</title>
    </head>
    <body class="bg-warm-parchment bg-canvas-texture">
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
  ```

  _Changes Made:_

  - Removed inline Tailwind config script.
  - Removed inline `<style>` block (styles moved to `src/index.css` and `tailwind.config.js`).
  - Added `<meta name="description">` for SEO.
  - Updated the `<script src>` to point directly to `/src/main.tsx`, which is Vite's standard entry point.
  - Kept the `bg-warm-parchment` and `bg-canvas-texture` classes on the body (the texture is now defined in `tailwind.config.js`).
  - Removed explicit Google Font `<link>` tags as `@import` in CSS handles it (though preconnect links don't hurt).

**7. Update `src/main.tsx`**

Make sure your `src/main.tsx` imports the new CSS file:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // <-- Import the global CSS file

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**8. Create `README.md`**

Replace the content of your `README.md` with this:

````markdown
# Wagn Project Tracker

A simple, offline-first project tracker built with React, Zustand, and Tailwind CSS. Organize your project sections and tasks, estimate effort using Fibonacci-like values, and track completion. Features Markdown import/export and PERT-like project estimation based on section certainty.

![Screenshot](placeholder.png) <!-- TODO: Add a screenshot of your app -->

## Features

- **Hierarchical Structure:** Organize tasks within sections.
- **Task Estimation:** Assign estimates (1h, 2h, 3h, 5h, 1d, 2d, 3d, 1w) to tasks.
- **Task Completion:** Mark tasks as complete.
- **Drag & Drop (Implicit):** Reorder tasks and sections (Move Up button implemented).
- **Certainty-Based Estimation:** Assign low, medium, or high certainty to sections for PERT-like best/expected/worst case project estimates.
- **Markdown Import/Export:** Save and load your project structure using a simple Markdown format.
- **Copy to Clipboard:** Easily copy the Markdown representation.
- **Offline First:** Uses Zustand with persistence, so your data stays in your browser's local storage.
- **Clean UI:** Styled with Tailwind CSS using a custom theme.

## Tech Stack

- **Frontend:** React, Vite
- **State Management:** Zustand (with `persist` middleware)
- **Styling:** Tailwind CSS
- **Notifications:** react-hot-toast
- **Runtime:** Bun (can also use Node/npm/yarn)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js (LTS version) with npm/yarn.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/YOUR_USERNAME/wagn-project-tracker.git # <-- TODO: Update this URL
    cd wagn-project-tracker
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    # OR using npm:
    # npm install
    # OR using yarn:
    # yarn install
    ```

### Running the Development Server

```bash
bun run dev
# OR using npm:
# npm run dev
# OR using yarn:
# yarn dev
```
````

This will start the Vite development server, typically at `http://localhost:5173`.

### Building for Production

```bash
bun run build
# OR using npm:
# npm run build
# OR using yarn:
# yarn build
```

This command builds the application for production in the `dist` folder. You can preview the production build locally using:

```bash
bun run preview
# OR using npm:
# npm run preview
# OR using yarn:
# yarn preview
```

## Usage

1.  **Project Title:** Click the project title to edit it.
2.  **Add Section:** Click the large blue "+" button to add a new top-level section (branch).
3.  **Add Task:** Click the small green "+" button within a section to add a new task (leaf).
4.  **Edit Names:** Click on any section or task name to edit it. Press Enter or click outside to save.
5.  **Estimate Tasks:** Select an estimate from the dropdown next to each task. High estimates (>= 1 day) are highlighted.
6.  **Complete Tasks:** Click the checkbox next to a task to mark it as complete/incomplete. Completed tasks are visually struck through.
7.  **Reorder:** Use the "^" button to move items up within their parent list.
8.  **Delete:** Use the "x" button to delete tasks or empty sections.
9.  **Certainty (Sections):** Select the uncertainty level (S/M/L) for each section. This affects the overall project estimates.
10. **Import/Export:** Use the top buttons to import from `.md`, export to `.md`, copy Markdown to clipboard, or reset all data.
11. **Estimates:** View the calculated Best, Expected, and Worst case total project estimates at the bottom.

## Markdown Format

The application uses a simple Markdown list format:

```markdown
# Project Name

- Section 1 [Certainty: high]
  - Task 1.1 (2h)
  - ~~Completed Task 1.2~~ (3h) ✓
- Section 2 [Certainty: medium]
  - Task 2.1 (1d)
  - Task 2.2 (unestimated)

## Remaining Estimates

- Best case: Xh
- Expected case: Yh
- Worst case: Zh
```

- `#` denotes the project title.
- `-` denotes sections (branches) or tasks (leaves). Indentation defines hierarchy (2 spaces per level).
- `[Certainty: level]` is added to sections (low, medium, high).
- `(estimate)` is added to tasks (e.g., `(5h)`, `(1d)`, `(unestimated)`).
- `~~strikethrough~~` and `✓` denote completed tasks.
- The `## Remaining Estimates` section is automatically generated on export and used for display, but ignored on import (estimates are recalculated).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

<!-- TODO: Add contribution guidelines if desired -->

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- TODO: Create a LICENSE file with the MIT license text -->

---

_Built by [Wagn AI](https://wagn.ai)_

````
*Action:*
*   Replace `YOUR_USERNAME/wagn-project-tracker` with your actual GitHub details.
*   **Add a screenshot:** Take a nice screenshot of your running application and save it as `placeholder.png` (or update the filename in the README).
*   **Create a `LICENSE` file:** Create a file named `LICENSE` in the root directory and paste the standard MIT License text into it. You can easily find templates online (e.g., on choosealicense.com).

**9. Create `.gitignore`**

Create a file named `.gitignore` in the project root directory:

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.*
!.env.example

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build output
.nuxt
dist

# Remix build output
.cache/
build/
public/build/

# Docusaurus build output
.docusaurus

# Gatsby build output
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp
.cache

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# Vite build output
dist/
````

---

You should now have a project structure ready for Vite development and a GitHub release.

**Next Steps:**

1.  Run `bun install` if you haven't already.
2.  Run `bun run dev` to start the development server and verify everything works as expected.
3.  Commit the changes to Git.
4.  Create the repository on GitHub.
5.  Push your local repository to GitHub.
6.  Update the `repository`, `bugs`, and `homepage` URLs in `package.json` and the URLs in `README.md` to point to your new GitHub repository.
7.  Add a `LICENSE` file.
8.  Add a screenshot (`placeholder.png` or similar).
9.  Commit these final metadata updates and push again.

Your project is now set up with Vite and ready for sharing!
