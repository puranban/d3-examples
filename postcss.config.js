export default {
  plugins: {
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    autoprefixer: {},
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
  },
}
