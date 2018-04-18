import _ from 'lodash/fp';
import fs from 'fs';
import path from 'path';

import { defaultValidExtensions, parseJson } from 'settings';

export const fileExists = (p, validExtensions = defaultValidExtensions) => {
  const paths = _.concat(
    p,
    _.map(e => `${p}${e}`)(validExtensions),
  );

  return _.find((f) => {
    try {
      return fs.lstatSync(f).isFile();
    } catch (err) {
      return false;
    }
  })(paths);
};

export const dirExists = (p) => {
  try {
    return fs.lstatSync(p).isDirectory();
  } catch (e) {
    return false;
  }
};

const exists = (mod, validExtensions) => _.reduce((result, lookup) => {
  if (!result) {
    return lookup();
  }

  return result;
})(false)([
  () => fileExists(mod, validExtensions),
  () => fileExists(path.join(mod, 'index'), validExtensions),
  () => {
    if (fileExists(path.join(mod, 'package.json'))) {
      const pkg = parseJson(mod, 'package.json');

      const main = _.get('jsnext:main')(pkg) || _.get('main')(pkg) || null;
      if (main) {
        return fileExists(path.join(mod, main), validExtensions);
      }
    }

    return false;
  },
]);

export default exists;
