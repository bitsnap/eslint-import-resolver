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

const opts = {
  plugins: [
    babel({
      babelrc: false,
      ...bundleBabelRC,
    }),
  ],

  external: [
    '@babel/core/lib/config',
    'lodash-magic-cache',
    'path',
    'fs',
  ],
};

export default [{
  input: 'src/cli.js',
  output: {
    file: 'dist/resolve.min.js',
    format: 'cjs',
    sourcemap: true,
  },
  ...opts,
}, {
  input: 'src/main.js',
  output: {
    file: 'dist/import-resolver.min.js',
    format: 'cjs',
    sourcemap: true,
  },
  ...opts,
}];
