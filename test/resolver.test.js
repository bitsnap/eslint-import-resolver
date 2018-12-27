import test from 'tape';
import path from 'path';
import _ from 'lodash/fp';
import resolve from 'resolver';
import isCore from 'core';
import { clear } from 'settings';

test('Should resolve core modules', (t) => {
  const testTable = ['fs', 'path', 'child_process'];

  t.plan(testTable.length);
  _.forEach(m => t.ok(resolve(m, __filename).found))(testTable);
});

test('Should resolve modules', (t) => {
  const addRootDir = p => _.map(e => _.concat(e)(p));

  const testTable = addRootDir(path.normalize(`${__dirname}/..`))([
    ['path', 'path'],
    ['fs', 'fs'],
    ['child_process', 'child_process'],
    ['test/../rollup.config.js', 'rollup.config.js'],
    ['./rollup.config', 'rollup.config.js'],
    ['rollup.config.js', 'rollup.config.js'],
    ['rollup.config', 'rollup.config.js'],
    ['resolver.test.js', 'test/resolver.test.js'],
    ['resolver.test', 'test/resolver.test.js'],
    ['core.js', 'src/core.js'],
    ['core', 'src/core.js'],
    ['dummy/dummy.js', 'src/dummy/dummy.js'],
    ['fixtures/pam', 'test/fixtures/alias/index.js'],
    ['fixtures/alias', 'test/fixtures/alias/index.js'],
    ['lodash', 'node_modules/lodash/index.js'],
    ['@babel/core', 'node_modules/@babel/core/lib/index.js'],
    ['lodash/fp', 'node_modules/lodash/fp.js'],
    ['lodash/fp/forEach', 'node_modules/lodash/fp/forEach.js'],
  ]);

  const isExternal = m => _.includes(m)([
    'jQuery',
    'angular',
  ]);

  t.plan(testTable.length + 2);

  _.forEach(([m, modPath, root]) => {
    clear();

    const mod = resolve(
      m,
      path.normalize(`${root}/test.js`),
      { root },
    );
    if (isCore(m) || isExternal(m)) {
      t.ok(mod.found);
    } else {
      t.equal(mod.path, `${root}/${modPath}`);
    }
  })(testTable);

  t.notOk(resolve(
    '',
    path.normalize(`${__dirname}/../test.js`),
    { root: `${__dirname}/..` },
  ).found);

  t.notOk(resolve(
    'blablablar',
    path.normalize(`${__dirname}/../test.js`),
    { root: `${__dirname}/..` },
  ).found);
});
