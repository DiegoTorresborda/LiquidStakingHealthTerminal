import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f0f4f8",
          100: "#d6e0eb",
          300: "#7e97b2",
          500: "#2f4b67",
          700: "#14263a",
          900: "#07121f"
        },
        slateglass: {
          400: "#25364e",
          500: "#1a2b40",
          600: "#122035",
          700: "#0d182b"
        },
        mint: "#52f0c4",
        amber: "#f8c45d",
        coral: "#ff7e7e"
      },
      boxShadow: {
        card: "0 18px 40px rgba(7, 18, 31, 0.45)",
        glow: "0 0 0 1px rgba(123, 175, 245, 0.18), 0 14px 34px rgba(7, 18, 31, 0.46)"
      },
      backgroundImage: {
        "dash-grid":
          "linear-gradient(to right, rgba(126,151,178,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(126,151,178,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
