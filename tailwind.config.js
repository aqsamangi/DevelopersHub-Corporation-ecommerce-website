/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind scans the HTML pages and the JS files (templates live in JS too).
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    // Same breakpoints as the original project
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      colors: {
        // Palette taken from the colours used in the original project's markup.
        primary: { DEFAULT: '#3B82F6', dark: '#1D4ED8', light: '#DBEAFE', tint: '#BFDBFE' },
        accent: '#FB923C',
        mint: '#34D399',
        ink: '#1C1C1C',
        page: '#F3F4F6',
      },
      boxShadow: {
        card: '0 1px 2px rgba(56,56,56,.08), 0 1px 3px rgba(56,56,56,.12)',
        pop: '0 8px 24px rgba(0,0,0,.14)',
      },
    },
  },
  plugins: [],
};
