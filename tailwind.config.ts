import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ebf4ff",
          100: "#c3dafe",
          200: "#a3bffa",
          300: "#7f9cf5",
          400: "#667eea",
          500: "#4c51bf",
          600: "#1a365d",
          700: "#153054",
          800: "#0f2440",
          900: "#0a1a30",
        },
        accent: {
          50: "#fffaf0",
          100: "#feebc8",
          200: "#fbd38d",
          300: "#f6ad55",
          400: "#ed8936",
          500: "#dd6b20",
          600: "#c05621",
        },
      },
      fontFamily: {
        sans: [
          "PingFang SC",
          "Microsoft YaHei",
          "Hiragino Sans GB",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
