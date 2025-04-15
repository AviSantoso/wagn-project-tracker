import React from "react";
import ReactDOM from "react-dom/client";
import Modal from "react-modal";
import App from "./App.tsx";
import "./index.css"; // <-- Import the global CSS file

// Set the app element for react-modal accessibility
Modal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
