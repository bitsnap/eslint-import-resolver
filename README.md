# eslint-import-resolver

[![npmjs](https://img.shields.io/npm/v/eslint-import-resolver.svg)](https://npmjs.org/package/eslint-import-resolver)
[![downloads](https://img.shields.io/npm/dw/eslint-import-resolver.svg)](https://npmjs.org/package/eslint-import-resolver)
[![CircleCI](https://img.shields.io/circleci/project/github/bitsnap/eslint-import-resolver.svg)](https://circleci.com/gh/bitsnap/eslint-import-resolver)
[![Coverage Status](https://coveralls.io/repos/github/bitsnap/eslint-import-resolver/badge.svg?branch=master)](https://coveralls.io/github/bitsnap/eslint-import-resolver?branch=master) 
[![dependencies](https://david-dm.org/bitsnap/eslint-import-resolver.svg)](https://david-dm.org/bitsnap/eslint-import-resolver)
[![devDependencies](https://david-dm.org/bitsnap/eslint-import-resolver/dev-status.svg)](https://david-dm.org/bitsnap/eslint-import-resolver#info=devDependencies)

Universal import resolver for [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import) :cat2:, 
but had been developed for [eslint-plugin-flowtype-typecheck](https://github.com/bitsnap/eslint-plugin-flowtype-typecheck).

Supports resolving of `node_modules`, [babel-plugin-resolver](https://github.com/jshanson7/babel-plugin-resolver) and
[babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver) modules.

I'll add a webpack module resolver soon.

## How to use 

```
> npm i --save-dev eslint-import-resolver eslint lodash
```

*.eslintrc*
```js
{
  "settings": {
    "import/resolver": {
      "eslint-import-resolver": { // defaults
        "root": `${process.cwd}`
        "extensions": ['.js', '.mjs', '.json', '.jsx']
      }
    }
  }
  "plugins": ["eslint-plugin-import"],
  "extends": ["plugin:eslint-plugin-import/recommended"]
}
```

Aliases are applied only for the start and the ending of the module path.
With `"alias": { "mod": "pam" }` `module/mod/index.js` wouldn't be aliased, but `module/mod -> module/pam` will.

Aliasing is pretty uncommon, but can be handy from time to time.

### Q&A

Feel free to ask some questions [via Discord](http://discord.gg/P7W9v9B).

## License

Licensed under [MIT](LICENSE) license, of course.
