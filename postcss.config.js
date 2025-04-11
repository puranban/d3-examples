export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
  },
}
