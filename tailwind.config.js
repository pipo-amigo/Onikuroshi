/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
     extend: {
      fontFamily: {
        japanese: ['JAPANESE', 'sans-serif'], // Tailwind class: font-japanese
      },
    },
  },
  plugins: [],
}

