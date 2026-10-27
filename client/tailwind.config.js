/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F4EDE0',
          light: '#FAF6EE',
          dark: '#EADFCF',
        },
        card: {
          DEFAULT: '#FBF7EF',
          border: '#E4D9C4',
        },
        terracotta: {
          DEFAULT: '#D4704B',
          hover: '#C25E39',
          light: '#F8ECE7',
        },
        mustard: {
          DEFAULT: '#E0B050',
          hover: '#CD9D3D',
          light: '#FCF7E8',
          dark: '#946F19',
        },
        teal: {
          DEFAULT: '#3F7F8C',
          hover: '#346B76',
          light: '#EAF3F4',
        },
        sage: {
          DEFAULT: '#7C9A6B',
          hover: '#688558',
          light: '#F0F5EE',
          dark: '#3E5C31',
        },
        charcoal: {
          DEFAULT: '#2B2622',
          light: '#6E665E',
          muted: '#8A827A',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
