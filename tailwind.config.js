/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
      keyframes: {
        'animate-loading': {
          '0%, 100%': { backgroundColor: '#f8fafc' }, // border-indigo-500
          '50%': { backgroundColor: '#cbd5e1' }, // border-pink-500
        },
        'moving-bubble': {
          '0%': { top: 10, opacity: 20 },
          '100%': { top: 1000, opacity: 0 }
        }
      },
      animation: {
        'loading': 'animate-loading 3s ease-in-out infinite',
        'moving-bubble': 'moving-bubble 3s ease-in infinite'
      }
    },
  },
  plugins: [],
};
