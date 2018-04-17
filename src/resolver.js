// because tleunen/babel-plugin-module-resolver is broken
// and building an import resolver is not a rocket science

import path from 'path';
import _ from 'lodash/fp';

import exists from 'exists';
import isCore from 'core';

import { readSettings, readDependencies, defaultValidExtensions } from 'settings';

const resolve = (source, file, options = {}) => {
  if (_.isEmpty(source) || !source) {
    return { found: false };
  }

  if (isCore(source)) {
    return { found: true };
  }

  const root = _.flow(
    _.defaults({
      root: process.cwd(),
    }),
    _.get('root'),
  )(options);

  const settings = readSettings(root, options);

  let aliasedSource = `${source}`;

  aliasedSource = _.reduce((r, v) => {
    const [alias, mod] = v;

    return _.flow(
      _.replace(new RegExp(`^${alias}`), mod),
      _.replace(new RegExp(`${alias}$`), mod),
    )(r);
  })(aliasedSource)(_.entries(settings.alias));

  const validExtensions = _.flow(
    _.defaults({
      extensions: defaultValidExtensions,
    }),
    _.get('extensions'),
  )(options);

  const rel = _.replace(/$.\//, '')(aliasedSource);
  const curDirMod = path.join(path.dirname(file), rel);
  let f = exists(curDirMod, validExtensions);
  if (f) {
    return { found: true, path: f };
  }

  if (_.find(e => (_.isString(e) ?
    _.startsWith(e)(source)
    : source.match(e)))(settings.externals)) {
    return { found: true };
  }

  const rootPaths = _.map(r => path.join(root, r, aliasedSource))(settings.root);
  f = _.flow(
    _.map(p => exists(p, validExtensions)),
    _.compact,
    _.nth(0),
  )(rootPaths);
  if (f) {
    return { found: true, path: f };
  }

  const deps = readDependencies(root);

  if (_.find(d => _.startsWith(d)(source))(deps)) {
    f = exists(path.join(root, 'node_modules', source), validExtensions);
    if (f) {
      return { found: true, path: f };
    }
  }

  return { found: false };
};

export default resolve;
