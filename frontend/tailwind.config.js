/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0A1B2D",
          primary: "#102A43",
          800: "#1A3654",
          700: "#244A70",
          light: "#E7F0F9",
        },
        action: {
          orange: "#C2410C", // Primary action orange
          hover: "#9A3412",
          light: "#FFEDD5",
        },
        decor: {
          orange: "#F97316", // Decorative orange
          light: "#FFF7ED",
        },
        page: {
          bg: "#F6F8FC",
        },
        card: {
          bg: "#FFFFFF",
        },
        text: {
          main: "#132238",
          secondary: "#526277",
          muted: "#8292A2",
        },
        border: {
          main: "#DCE3ED",
          subtle: "#EAEFF6",
        },
        status: {
          success: "#16734B",
          "success-bg": "#EBFDF4",
          warning: "#8A5100",
          "warning-bg": "#FEF7EE",
          error: "#B42318",
          "error-bg": "#FEF3F2",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(16, 42, 67, 0.06), 0 2px 6px -1px rgba(16, 42, 67, 0.04)',
        'elevated': '0 20px 40px -10px rgba(16, 42, 67, 0.12), 0 0 1px 1px rgba(16, 42, 67, 0.05)',
        'dropdown': '0 10px 30px 0 rgba(16, 42, 67, 0.15)',
      }
    },
  },
  plugins: [],
}
