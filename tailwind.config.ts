import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#2F919C",
        "brand-strong": "#1F7074",
        surface: "#FFFFFF",
        "surface-muted": "#DCE8E9",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
} satisfies Config;
