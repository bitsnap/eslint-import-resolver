import fs from 'fs';
import _ from 'lodash/fp';
import { resolveAll } from 'resolver';

const notExists = (f) => {
  try {
    return !fs.lstatSync(f).isFile();
  } catch (error) {
    return true;
  }
};

const files = _.filter(notExists)(process.argv);

_.forEach((file) => {
  const result = resolveAll(file, '', {
    root: process.cwd(),
  });

  if (_.overSome([
    _.equals({ found: false }),
    _.equals([]),
  ])(result)) {
    // eslint-disable-next-line no-console
    console.log(`${file} not found`);
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`resolved ${file} to ${result}`);
})(files);
