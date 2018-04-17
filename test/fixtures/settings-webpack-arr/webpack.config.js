module.exports = [{}, {
  resolve: {
    modules: [
      'webpack-src',
      'webpack-test',
    ],
    alias: {
      css: 'stylesheets',
    },
  },

  externals: [
    'jQuery',
    /angular/,
  ],
}];
