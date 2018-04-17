import fs from 'fs';
import path from 'path';
import _ from 'lodash/fp';

export const defaultValidExtensions = ['.js', '.mjs', '.json', '.jsx'];

let settings = {};
let dependencies = {};

const moduleResolverSettings = _.flow(
  _.get('plugins'),
  _.filter(_.isArray),
  _.find(p => _.first(p) === 'module-resolver'),
  _.nth(1),
  _.defaults({
    root: [],
    alias: [],
    externals: [],
  }),
);

const resolverSettings = _.flow(
  _.get('plugins'),
  _.filter(_.isArray),
  _.find(p => _.first(p) === 'resolver'),
  _.nth(1),
  _.defaults({
    resolveDirs: [],
  }),
  r => ({ root: r.resolveDirs, alias: {}, externals: [] }),
);

export const clear = () => {
  settings = {};
  dependencies = {};
};

export const readWebpackConfig = (rootDir = '.', opts) => {
  let webpackConfig;
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    webpackConfig = require(path.join(rootDir, 'webpack.config.js'));
  } catch (err) {
    return { root: [], alias: {}, externals: [] };
  }

  const webpackConfigIndex = _.get('webpackConfigIndex')(opts) || 0;

  if (_.isArray(webpackConfig)) {
    webpackConfig = _.nth(webpackConfigIndex)(webpackConfig) || {};
  } else if (!_.isPlainObject(webpackConfig)) {
    return { root: [], alias: {}, externals: [] };
  }

  let externals = _.get('externals')(webpackConfig) || [];

  if (_.isArray(externals)) {
    externals = _.filter(e => _.isString(e) || _.isRegExp(e))(externals);
  }

  if (_.isPlainObject(externals)) {
    externals = _.keys(externals);
  }

  return {
    root: _.get('resolve.modules')(webpackConfig) || [],
    alias: _.get('resolve.alias')(webpackConfig) || [],
    externals,
  };
};

export const readSettings = (rootDir = '.', opts = {}) => {
  if (_.isEmpty(settings)) {
    let babelRC;
    try {
      babelRC = JSON.parse(fs.readFileSync(`${rootDir}/.babelrc`, {
        encoding: 'utf8',
      }).toString());
    } catch (err) {
      babelRC = {};
    }

    const mrs = moduleResolverSettings(babelRC);
    const ms = resolverSettings(babelRC);
    const wb = readWebpackConfig(rootDir, opts);

    settings = _.fromPairs([
      ['root', _.flow(
        _.flatMap(_.get('root')),
        _.uniq,
      )([ms, mrs, wb])],
      ['alias', _.flow(
        _.map(_.get('alias')),
        _.flatMap(_.toPairs),
        _.uniq,
        _.fromPairs,
      )([ms, mrs, wb])],
      ['externals', _.get('externals')(wb)],
    ]);
  }

  return _.defaults({
    root: [],
    alias: [],
    externals: [],
  })(settings);
};

export const readDependencies = (rootDir = '.') => {
  if (_.isEmpty(dependencies)) {
    let p;
    try {
      p = JSON.parse(fs.readFileSync(`${rootDir}/package.json`, {
        encoding: 'utf8',
      }).toString());
    } catch (err) {
      p = {};
    }

    dependencies = _.flow(
      pkg => _.flatMap(_.identity)(_.map(d => _.keys(_.get(d)(pkg)))([
        'dependencies',
        'peerDependencies',
        'devDependencies',
      ])),
      _.uniq,
      _.compact,
    )(p);
  }

  return dependencies;
};
