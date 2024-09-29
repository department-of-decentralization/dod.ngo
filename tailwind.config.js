// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['var(--font-merriweather)', ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#E65B54',
          50: '#FDF5F4',
          100: '#FBE4E2',
          200: '#F6C1BF',
          300: '#F09F9B',
          400: '#EB7D78',
          500: '#E65B54',
          600: '#DF2C23',
          700: '#B0211A',
          800: '#7F1813',
          900: '#4E0F0B',
          950: '#360A08',
        },
        secondary: {
          DEFAULT: '#FFD200',
          50: '#FFF2B8',
          100: '#FFEFA3',
          200: '#FFE87A',
          300: '#FFE052',
          400: '#FFD929',
          500: '#FFD200',
          600: '#C7A400',
          700: '#8F7600',
          800: '#574700',
          900: '#1F1900',
          950: '#030200',
        },
        butter: {
          DEFAULT: '#F3E4BD',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFFFFF',
          300: '#FFFFFF',
          400: '#F9F2E0',
          500: '#F3E4BD',
          600: '#EAD18E',
          700: '#E2BD5E',
          800: '#D9AA2F',
          900: '#B08820',
          950: '#98751C',
        },
        gray: colors.gray,
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              color: theme('colors.indigo.500'),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
