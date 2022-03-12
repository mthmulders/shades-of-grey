module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-import-url')({
      'modernBrowser': true
    }),
    require('tailwindcss'),
    require('autoprefixer'),
  ]
};