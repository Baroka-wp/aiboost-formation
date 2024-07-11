/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
   extend: {
      colors: {
        twitter: '#1DA1F2',
        facebook: '#4267B2',
        linkedin: '#0077B5',
      }
   }
  },
  plugins: [],
}