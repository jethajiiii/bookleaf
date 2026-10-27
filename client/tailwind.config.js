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
          50: '#FDFBF7',
          100: '#F9F5EC',
          200: '#F4EDE0',
          300: '#E8DFC8',
          400: '#D5C7A3',
        },
        card: {
          DEFAULT: '#FBF7EF',
          border: '#E4D9C4',
        },
        terracotta: {
          DEFAULT: '#D4704B',
          hover: '#C25E39',
          light: '#F8ECE7',
          500: '#D96545',
          600: '#C25232',
          700: '#9E3F24',
        },
        mustard: {
          DEFAULT: '#E0B050',
          hover: '#CD9D3D',
          light: '#FCF7E8',
          dark: '#946F19',
          400: '#E8B342',
          500: '#D49D2B',
          600: '#B88219',
        },
        teal: {
          DEFAULT: '#3F7F8C',
          hover: '#346B76',
          light: '#EAF3F4',
        },
        dustyteal: {
          DEFAULT: '#4D8287',
          500: '#4D8287',
          600: '#3D6C70',
          700: '#2E5357',
        },
        sage: {
          DEFAULT: '#7C9A6B',
          hover: '#688558',
          light: '#F0F5EE',
          dark: '#3E5C31',
          400: '#8FA98F',
          500: '#728F72',
          600: '#567156',
        },
        warmwood: {
          400: '#BF8A5C',
          500: '#9C6839',
          600: '#7D5129',
          700: '#59381A',
        },
        ink: {
          DEFAULT: '#2B231D',
          900: '#2B231D',
          800: '#42372E',
          600: '#6E6053',
          400: '#9C8F82',
        },
        charcoal: {
          DEFAULT: '#2B2622',
          light: '#6E665E',
          muted: '#8A827A',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Fraunces', 'Georgia', 'serif'],
        display: ['Cinzel', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        shelf: '0 24px 38px -10px rgba(89, 56, 26, 0.28), 0 12px 18px -8px rgba(0, 0, 0, 0.12)',
        book: '-4px 0 12px rgba(0, 0, 0, 0.18), 3px 0 6px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
