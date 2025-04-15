/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        card: "var(--color-card)",
        "card-border": "var(--color-card-border)",

        btn: "var(--color-button)",
        "btn-hover": "var(--color-button-hover)",

        input: "var(--color-text-input)",
        "input-border": "var(--color-text-input-border)",

        title: "var(--color-title)",
        text: "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",

        state: "var(--color-state)",
        "state-terminating": "var(--color-state-terminating)",
        "state-active": "var(--color-state-active)",
        transition: "var(--color-transition)",
        "transition-active": "var(--color-transition-active)",
      },
    },
  },
  plugins: [],
};
