/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBg: "#FDF8F1",
        mainText: "#828282",
        secondaryText: "#777777",
        accent: "#FF13C4",
      },
    },
  },
  plugins: [],
};
