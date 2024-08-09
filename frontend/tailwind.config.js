/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
        "3%": "3%",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      colors: {
        appPurple: "#af68df",
        appBgColor: "#0a0a0a",
      },
    },
  },

  plugins: [],
};
