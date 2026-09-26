module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  plugins: ['prettier-plugin-tailwindcss'],
  // Tailwind v4 reads its theme from CSS; the class sorter needs the entry point
  tailwindStylesheet: './css/tailwind.css',
}
