/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2fbf9",
          400: "#46d6b4",
          500: "#20c997",
          600: "#17a77c"
        }
      },
      boxShadow: {
        glow: "0 20px 80px rgba(32, 201, 151, 0.18)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(32, 201, 151, 0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(96, 165, 250, 0.16), transparent 28%)"
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
