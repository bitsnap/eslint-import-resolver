import babel from 'rollup-plugin-babel';

const bundleBabelRC = {
  exclude: 'node_modules/**',
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: true,
      },
      forceAllTransforms: true,
      exclude: ['transform-regenerator'],
      modules: false,
    }],
    'minify',
  ],
  plugins: [
    ['lodash-magic-import', { cache: true }],
    ['module-resolver', {
      root: ['src'],
    }],
  ],
};

export default {
  input: 'src/main.js',
  plugins: [
    babel({
      babelrc: false,
      ...bundleBabelRC,
    }),
  ],
  external: [
    'lodash-magic-cache',
    'path',
    'fs',
  ],
  output: [{
    file: 'dist/import-resolver.min.js',
    format: 'cjs',
    sourcemap: true,
  }],
};
