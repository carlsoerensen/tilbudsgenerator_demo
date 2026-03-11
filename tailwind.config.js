/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'progress': 'progress 3.5s ease-in-out forwards',
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '20%': { width: '30%' },
          '60%': { width: '75%' },
          '100%': { width: '95%' },
        },
      },
      minHeight: {
        'safe': 'calc(100dvh - env(safe-area-inset-bottom, 0px))',
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
        'safe-left': 'env(safe-area-inset-left, 0px)',
        'safe-right': 'env(safe-area-inset-right, 0px)',
      },
    },
  },
  plugins: [],
}
