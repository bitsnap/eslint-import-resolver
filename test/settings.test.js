import test from 'tape';
import _ from 'lodash/fp';

import { readSettings, readDependencies, clear } from 'settings';

test('Should get both module-resolver and resolver settings', (t) => {
  const testSettings = [[`${__dirname}/fixtures/settings`, {
    root: ['resolver-root', 'test', 'module-resolver-root'],
    alias: {
      pam: 'alias',
    },
  }], [
    `${__dirname}/test/fixtures/dependencies`, {
      root: [],
      alias: [],
    },
  ]];

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
    `${__dirname}/test/fixtures/settings`, [],
  ]];

  t.plan(testDependencies.length);
  _.forEach(([d, settings]) => {
    clear();
    t.deepEqual(readDependencies(d), settings);
  })(testDependencies);
});
