import _ from 'lodash/fp';
import fs from 'fs';
import path from 'path';

import { defaultValidExtensions } from 'settings';

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

const exists = (mod, validExtensions) => {
  let f = fileExists(mod, validExtensions);
  if (f) {
    return f;
  }

  if (dirExists(mod)) {
    f = fileExists(path.join(mod, 'index'), validExtensions);
    if (f) {
      return f;
    }

    if (fileExists(path.join(mod, 'package.json'))) {
      const p = JSON.parse(fs.readFileSync(`${mod}/package.json`, {
        encoding: 'utf8',
      }).toString());

      const main = _.get('jsnext:main')(p) || _.get('main')(p);
      f = path.join(mod, main);
      if (fileExists(f, validExtensions)) {
        return f;
      }
    }
  }

  return false;
};

export default exists;
