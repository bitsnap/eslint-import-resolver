import test from 'tape';
import _ from 'lodash/fp';

import { readSettings, readDependencies, clear } from 'settings';

test('Should get both module-resolver and resolver settings', (t) => {
  const testSettings = [[`${__dirname}/fixtures/settings`, {
    root: ['resolver-root', 'test', 'module-resolver-root'],
    alias: {
      pam: 'alias',
    },
    externals: [],
  }], [`${__dirname}/fixtures/settings-webpack`, {
    root: ['webpack-src', 'webpack-test'],
    alias: { css: 'stylesheets' },
    externals: [
      'jQuery',
      /angular/,
    ],
  }], [`${__dirname}/fixtures/dependencies`, {
    root: [],
    alias: [],
    externals: [],
  }]];

  t.plan(testSettings.length);
  _.forEach(([r, settings]) => {
    clear();
    t.deepEqual(readSettings(r), settings);
  })(testSettings);
});

test('Should get package dependencies', (t) => {
  const testDependencies = [[`${__dirname}/fixtures/dependencies`, [
    '@babel/cli', '@babel/core', 'lodash', 'coveralls', 'eslint',
  ]], [
    `${__dirname}/fixtures/settings`, [],
  ]];

  t.plan(testDependencies.length);
  _.forEach(([d, settings]) => {
    clear();
    t.deepEqual(readDependencies(d), settings);
  })(testDependencies);
});

test('Should get webpack array settings', (t) => {
  const objSettings = readSettings(`${__dirname}/fixtures/settings-webpack`, {});
  const arrSettings = readSettings(`${__dirname}/fixtures/settings-webpack-arr`, { webpackConfigIndex: 1 });
  t.plan(1);
  t.deepEqual(arrSettings, objSettings);
});
