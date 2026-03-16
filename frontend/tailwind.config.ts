import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0f172a",
        ocean: "#0ea5e9",
        sand: "#f4f1de",
        coral: "#fb7185"
      }
    }
  },
  plugins: []
} satisfies Config;
