/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        txt: "rgb(var(--color-text) / <alpha-value>)",
        button: "rgb(var(--color-button) / <alpha-value>)",
        button_secondary: "rgb(var(--color-button-secondary) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
