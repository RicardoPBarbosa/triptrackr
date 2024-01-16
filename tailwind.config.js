const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", ...defaultTheme.fontFamily.serif],
        body: ["var(--font-body)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#31C6DA",
        secondary: "#E86B3B",
        tertiary: "#F99C4F",
        background: {
          DEFAULT: "#1B1E21",
          light: "#3F4851",
          paper: {
            DEFAULT: "#2C3238",
            light: "#485058",
          },
        },
      },
      borderRadius: {
        ...defaultTheme.borderRadius,
        lg: "0.625rem",
        "2xl": "15px",
      },
      borderColor: {
        ...defaultTheme.borderColor,
        background: "#3F4851",
        paper: "#485058",
      },
    },
  },
  plugins: [],
};
