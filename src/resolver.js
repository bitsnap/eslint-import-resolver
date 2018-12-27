import path from 'path';
import _ from 'lodash/fp';

import exists from 'exists';
import isCore from 'core';

import { readSettings, readDependencies, defaultValidExtensions } from 'settings';

const replaceAliases = (source, aliases) => _.reduce((r, v) => {
  const [alias, mod] = v;

  return _.flow(
    _.replace(new RegExp(`^${alias}`), mod),
    _.replace(new RegExp(`${alias}$`), mod),
  )(r);
})(source)(_.entries(aliases));

const lookupRelative = (source, file, validExtensions) => {
  const rel = _.replace(/$.\//, '')(source);
  const curDirMod = path.join(path.dirname(file), rel);
  return exists(curDirMod, validExtensions);
};

const lookupExternals = (source, externals) => _.filter(_.overEvery([
  _.isString,
  _.overSome([
    e => _.startsWith(e)(source),
    e => source.match(e),
  ]),
]))(externals);

const lookupRoot = (source, root, roots, validExtensions) => {
  const rootPaths = _.map(r => path.join(root, r, source))(roots);

  return _.flow(
    _.map(p => exists(p, validExtensions)),
    _.compact,
    _.nth(0),
  )(rootPaths);
};

const lookupDeps = (source, root, deps, validExtensions) => {
  if (_.find(d => _.startsWith(d)(source))(deps)) {
    return exists(path.join(root, 'node_modules', source), validExtensions);
  }

  return false;
};

export const resolveAll = (source, file, options = {}) => {
  if (_.overSome([_.isEmpty, s => !s])(source)) {
    return { found: false };
  }

  if (isCore(source)) {
    return { found: true };
  }

  const { root, validExtensions } = _.flow(
    _.defaults({
      root: process.cwd(),
      extensions: defaultValidExtensions,
    }),
    s => ({
      root: _.get('root')(s),
      validExtensions: _.get('extensions')(s),
    }),
  )(options);

  const settings = readSettings(root, options);
  const aliasedSource = replaceAliases(source, settings.alias);
  const deps = readDependencies(root);

  return _.flow(
    _.map(e => (_.isEmpty(e) ? undefined : e)),
    _.compact,
  )([
    lookupRelative(aliasedSource, file, validExtensions),
    lookupExternals(aliasedSource, settings.externals),
    lookupRoot(aliasedSource, root, settings.root, validExtensions),
    lookupDeps(aliasedSource, root, deps, validExtensions),
  ]);
};

const resolve = (source, file, options = {}) => {
  const resolved = resolveAll(source, file, options);
  if (_.get('found')(resolved)) {
    return { found: true, path: file };
  }

  const filePath = _.nth(0)(resolved);
  return { found: _.isString(filePath) || filePath === true, path: filePath };
};

export default resolve;
