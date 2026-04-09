import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6fbf5",
          100: "#E8F5E9",
          200: "#cde9cf",
          300: "#a7d6ad",
          400: "#76bb81",
          500: "#4b9b57",
          600: "#367c40",
          700: "#2E7D32",
          800: "#255f2a",
          900: "#1d4921"
        },
        ink: "#17301B",
        mist: "#f7f6ee",
        cream: "#fbfaf4"
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        display: ["Poppins", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 50px rgba(34, 68, 37, 0.12)",
        card: "0 14px 36px rgba(25, 56, 28, 0.08)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9), transparent 35%), radial-gradient(circle at 80% 0%, rgba(192,232,193,0.45), transparent 40%), linear-gradient(135deg, #eef7ea 0%, #e7f3e3 50%, #d9edd8 100%)"
      },
      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(18px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)"
          },
          "50%": {
            transform: "translateY(-8px)"
          }
        }
      },
      animation: {
        "fade-up": "fadeUp .8s ease-out both",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
