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
    git clone https://github.com/AviSantoso/wagn-project-tracker.git # <-- TODO: Update this URL
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

### Export

- **Export to Markdown:** Generates a markdown file representing the current project structure and estimates. Saves the file locally.
- **Copy to Clipboard:** Copies the markdown representation to the clipboard.

### Try Example

- **Try Example:** Click this button (top right) to load a sample project ("Personal Website Launch"). A confirmation dialog will appear before overwriting your current data. This helps you quickly see how the tracker works.

## Data Structure
