import test from 'tape';
import _ from 'lodash/fp';
import exists, { dirExists } from 'exists';

const extensions = [
  '.js',
  '.json',
  '.jsx',
];

test('should resolve multiple valid extensions', (t) => {
  t.plan(extensions.length + 1);

  const p = `${__dirname}/fixtures/alias/index`;

  t.equal(exists(p, extensions), `${p}.js`);

  _.forEach((e) => {
    t.equal(exists(`${p}${e}`, extensions), `${p}${e}`);
  })(extensions);
});

test('should test directory existence', (t) => {
  t.plan(3);
  t.ok(dirExists(`${__dirname}/fixtures/alias`));
  t.notOk(dirExists(`${__dirname}/x`));
  t.notOk(exists(`${__dirname}/x`));
});

test('should resolve an indexed directory', (t) => {
  t.plan(extensions.length);

  const p = `${__dirname}/fixtures/alias`;
  _.forEach((e) => {
    t.equal(exists(p, [e]), `${p}/index${e}`);
  })(extensions);
});

test('should resolve a node module main targets', (t) => {
  const testFixtures = [
    ['fixtures/node_modules/dummy', 'main-jsnext.js'],
    ['fixtures/node_modules/dummy-main', 'main.js'],
  ];

  t.plan(testFixtures.length);
  _.forEach(([p, m]) => {
    t.equal(exists(`${__dirname}/${p}`, extensions), `${__dirname}/${p}/${m}`);
  })(testFixtures);
});
