import fs from 'fs';
import _ from 'lodash/fp';
import { loadPartialConfig } from '@babel/core/lib/config';

export const defaultValidExtensions = ['.js', '.mjs', '.json', '.jsx'];

let settings = {};
let dependencies = [];

const pluginOptions = (name, babelRC) => _.flow(
  _.get('options.plugins'),
  _.find({
    file: {
      request: name,
    },
  }),
  _.get('options'),
)(babelRC);

export const clear = () => {
  settings = {};
  dependencies = {};
};

export const parseJson = (rootDir, file) => {
  try {
    return JSON.parse(fs.readFileSync(`${rootDir}/${file}`, {
      encoding: 'utf8',
    }).toString());
  } catch (error) {
    return {};
  }
};

const defaults = {
  root: [],
  alias: {},
  externals: [],
};

export const readSettings = (rootDir = process.cwd()) => {
  if (_.isEmpty(settings)) {
    const babelRCPath = `${rootDir}/.babelrc`;

    try {
      fs.lstatSync(babelRCPath).isFile();
    } catch (error) {
      return defaults;
    }

    const babelRC = loadPartialConfig({
      root: rootDir,
      rootMode: 'root',
      configFile: babelRCPath,
    });

    const mrs = pluginOptions('module-resolver', babelRC);
    let ms = pluginOptions('resolver', babelRC);

    ms = {
      root: _.get('resolveDirs')(ms),
      alias: _.get('alias')(ms),
      externals: _.get('externals')(ms),
    };

    // { alias: [{a: b}, {c: d}]} => { alias: {a: b, c: d}}
    const reduceAlias = o => _.assign(o)({
      alias: _.reduce(_.assign, {})(o.alias),
    });

    settings = _.flow(
      _.assignInWith(_.flow(
        _.concat,
        _.uniq,
        _.compact,
      )),
      reduceAlias,
      _.defaults(defaults),
    )(mrs, ms);
  }

  return settings;
};

export const readDependencies = (rootDir = '.') => {
  if (_.isEmpty(dependencies)) {
    const pkg = parseJson(rootDir, 'package.json');

    dependencies = _.flow(
      _.flatMap(p => _.toPairs(_.get(p)(pkg))),
      _.compact,
      _.map(_.nth(0)),
      _.uniq,
    )([
      'dependencies',
      'peerDependencies',
      'devDependencies',
    ]);
  }

  return dependencies;
};
