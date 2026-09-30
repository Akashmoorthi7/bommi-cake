/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        comic: {
          yellow: '#FFDE00',
          yellowLight: '#FFF275',
          red: '#FF2E55',
          redDark: '#D6002A',
          blue: '#19B5FE',
          blueDark: '#0084C9',
          purple: '#9B51E0',
          pink: '#FF6496',
          green: '#2ED573',
          orange: '#FF7F00',
          cream: '#FFFDF0',
          charcoal: '#1A1A1A',
        }
      },
      fontFamily: {
        comic: ['Bangers', 'cursive'],
        body: ['Comic Neue', 'cursive', 'sans-serif'],
        marker: ['Permanent Marker', 'cursive'],
      },
      boxShadow: {
        'comic-sm': '2px 2px 0px #000000',
        'comic': '4px 4px 0px #000000',
        'comic-md': '6px 6px 0px #000000',
        'comic-lg': '8px 8px 0px #000000',
        'comic-xl': '12px 12px 0px #000000',
        'comic-red': '5px 5px 0px #FF2E55',
        'comic-yellow': '5px 5px 0px #FFDE00',
        'comic-blue': '5px 5px 0px #19B5FE',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        pop: 'pop 0.3s ease-out',
        float: 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
