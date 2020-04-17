# alias-dir

<img src="https://img.shields.io/github/package-json/v/mattcarlotta/alias-dirs?style=for-the-badge"></img> [![Codecov](https://img.shields.io/codecov/c/github/mattcarlotta/alias-dirs?style=for-the-badge)](https://codecov.io/gh/mattcarlotta/alias-dirs) [![Open Issues](https://img.shields.io/github/issues-raw/mattcarlotta/alias-dirs?style=for-the-badge)](https://github.com/mattcarlotta/alias-dirs/issues) [![Dependencies](https://img.shields.io/david/mattcarlotta/alias-dirs.svg?style=for-the-badge)](https://david-dm.org/mattcarlotta/alias-dirs) [![License](https://img.shields.io/github/license/mattcarlotta/alias-dirs?style=for-the-badge)](https://github.com/mattcarlotta/alias-dirs/blob/master/LICENSE)

Create some aliased directories for babel!

No more relative path travesing in babel like so:

```js
import ExampleComponent from "../../../../../components/ExampleComponent"
```

Instead, with the help of the <a href="https://github.com/tleunen/babel-plugin-module-resolver#readme">babel-plugin-module-resolver</a>, this package automatically creates aliases to root-level `.` directories and top-level folders within the `src` directory... so you don't have to:

```js
import ExampleComponent from "~components/ExampleComponent"
```

## Installation

```
npm i -D alias-dirs
```

or

```
yarn -D alias-dirs
```

## Usage

**babel.config.js** (must be a `.js` file)
```js
const aliasDirs = require("alias-dirs")

module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV)

  return {
    presets: [...],
    plugins: [
      [
        "module-resolver",
        {
          alias: aliasDirs()
        }
      ]
    ]
  }
}
```


**And you're all set!** Now you can do stuff like (regardless of directory):

```js
import "~styles"
import ExampleComponent from "~components/Example" 
import ExampleContainer from "~containers/Example"
```

---

# Advanced Usage


## Traversing Root Directories or Subdirectories

By default, this package will only alias root-level folders within the project's root directory `.` and top-level folders within the `./src` directory. 

If you wish to override the default paths, then you can supply an **array of root-level relative string paths** to the *paths* property (do **NOT** include trailing slashes).

For example:
```js
// this traverses all subdirectories within "./server", ignoring the root and "./src" directories
aliasDirs({ paths: ["./server"] })
```

## User-defined Alias Symbols

By default this package will alias all folders with a tilde `~`.

If you wish to override the predefined alias, then you can supply a **string** to the *alias* property.

For example:
```js
aliasDirs({ alias: "$" })
```

*WARNING*: This module will not play well with public or private npm `@` name-spaced packages. Aliasing with an empty string `""` or with the private `@` symbol is discouraged and not recommended as it may conflict with a `node_module` package. A warning will be shown if an empty string or `@` is used. If you want to supress warnings, then add `supressWarnings: true` property. As such, use at your own risk.

## User-defined Ignored Folers

By default this package will ignore the following folders:
```
build
config
coverage
cypress
dist
env
public
```

In addition, these directories will also be automatically ignored by enforcement:
```
^[.]/ // any folders with "." in their name
node_modules
```

If you wish to override the defaults, then you must supply an **array of string folder names** to *ignoredDirectories*:

For example:
```js
// this will ignore ANY folders named "secret"
aliasDirs({ ignoredDirectories: ["secret"] })
```

If you want to keep the default ignored directories and extend from them, then you can utilize the predefined `aliasDirs.ignoredDirectories` array.

For example:
```js
const aliasDirs = require("../index")
const { ignoredDirectories } = aliasDirs

module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV)

  return {
    presets: [...],
    plugins: [
      [
        "module-resolver",
        {
          alias: aliasDirs({
            ignoredDirectories: [ ...ignoredDirectories, "components" ]
          })
        }
      ]
    ]
  }
}
```

## Debugging

If you want to make sure your folders are being properly ignored/aliased, then add a `debug: true` property. This will display a console log of: the traversed paths, the alias, the ignored directories, and the resulting aliased directories.

For example:
```js
aliasDirs({ debug: true })
```


## Example

This package comes with a very simple example.

To run it, clone the repo:
`git clone git@github.com:mattcarlotta/alias-dirs.git`

Install the example dependencies:
`cd example && npm i` or `cd example && yarn`

Run the example:
`npm run example` or `yarn example`
