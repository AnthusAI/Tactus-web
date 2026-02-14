module.exports = {
  // Explicit requires avoid plugin-name resolution edge cases in some bundlers/loaders.
  plugins: [require("@tailwindcss/postcss"), require("autoprefixer")],
}
