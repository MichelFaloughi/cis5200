import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{json,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        penn: {
          red: {
            DEFAULT: "#990000",
            50: "#fdf2f2",
            100: "#fbe5e5",
            200: "#f5bcbc",
            300: "#ee8e8e",
            400: "#d94545",
            500: "#b81e1e",
            600: "#990000",
            700: "#7a0000",
            800: "#5c0000",
            900: "#3d0000",
            950: "#1f0000",
          },
          blue: {
            DEFAULT: "#011F5B",
            50: "#eef2fb",
            100: "#d6def4",
            200: "#a6b6e3",
            300: "#6c83cc",
            400: "#3a55ad",
            500: "#0c3589",
            600: "#011F5B",
            700: "#011848",
            800: "#011235",
            900: "#000a1f",
            950: "#000510",
          },
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [typography],
};

export default config;
