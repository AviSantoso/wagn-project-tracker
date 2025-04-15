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
