# @bitsnap/import-resolver

[![npmjs](https://img.shields.io/npm/v/@bitsnap/import-resolver.svg)](https://npmjs.org/package/@bitsnap/import-resolver)
[![downloads](https://img.shields.io/npm/dw/@bitsnap/import-resolver.svg)](https://npmjs.org/package/@bitsnap/import-resolver)
[![CircleCI](https://img.shields.io/circleci/project/github/bitsnap/import-resolver.svg)](https://circleci.com/gh/@itsnap/import-resolver)
[![Coverage Status](https://img.shields.io/coveralls/github/bitsnap/import-resolver.svg)](https://coveralls.io/github/bitsnap/import-resolver?branch=master) 
[![dependencies](https://img.shields.io/david/bitsnap/import-resolver.svg)](https://david-dm.org/bitsnap/import-resolver)
[![devDependencies](https://img.shields.io/david/dev/bitsnap/import-resolver.svg)](https://david-dm.org/bitsnap/import-resolver#info=devDependencies)
	
Universal import resolver for [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import) :cat2:, 
but had been developed for [eslint-plugin-flowtype-typecheck](https://github.com/bitsnap/eslint-plugin-flowtype-typecheck).

Supports resolving of `node_modules`, [babel-plugin-resolver](https://github.com/jshanson7/babel-plugin-resolver) and
[babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver) modules.

I'll add a webpack module resolver soon.

## How to use 

```
> npm i --save-dev @bitsnap/import-resolver eslint lodash
```

*.eslintrc*
```js
{
  "settings": {
    "import/resolver": {
      "@bitsnap/import-resolver": { // defaults
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
