/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        toggler: "rgb(var(--toggler))",
        togglerHover: "rgb(var(--toggler-hover))",
        filler: "rgb(var(--filler))",
      }
    },
  },
  plugins: [],
};
