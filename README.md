# TypeScript Template Repository

## Contents

| Name                        | Purpose                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| ./github/node.js.yml        | [GitHub Action](https://github.com/features/actions): test on commit/pull request                         |
| ./github/npm-publish.yml    | [GitHub Action](https://github.com/features/actions): NPM & GitHub publish on release                     |
| ./vscode/settings.json      | VSCode settings file to disable SCSS validation & CSS customData for [Tailwind](https://tailwindcss.com/) |
| ./vscode/tailwind.json      | CSS customData for adding support for on-hover [Tailwind](https://tailwindcss.com/) documentation         |
| ./src/interfaces/generic.ts | Generic data interface used in many of my TypeScript projects                                             |
| ./src/lib/array.ts          | TypeScript Implementation of forEach that allows for async/await support                                  |
| ./src/public/css/style.scss | Basic [Tailwind](https://tailwindcss.com/) SCSS template file                                             |
| ./src/test/index.ts         | Empty TypeScript test file (for use with `npm test`)                                                      |
| ./src/index.ts              | Empty TypeScript project file                                                                             |
| .eslintrc.json              | [ESLint](eslint.org/) configuration                                                                       |
| .eslintignore               | [ESLint](eslint.org/) ignore file                                                                         |
| .gitignore                  | [Git ignore](https://git-scm.com/docs/gitignore)                                                          |
| .npmignore                  | [NPM ignore](https://docs.npmjs.com/using-npm/developers.html#keeping-files-out-of-your-package)          |
| .prettierrc                 | [Prettier](https://prettier.io/) configuration                                                            |
| clean.js                    | Utility to selectively clean /dist/                                                                       |
| LICENSE                     | Standard GPL-3.0 License                                                                                  |
| package.json                | [NPM package](https://docs.npmjs.com/files/package.json)                                                  |
| postcss.config.js           | [PostCSS](https://postcss.org/) configuration                                                             |
| README.md                   | (this file)                                                                                               |
| tailwind.config.js          | [Tailwind](https://tailwindcss.com/) configuration                                                        |
| tsconfig.json               | [TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) configuration               |
| watch.js                    | Utility to watch for file changes and trigger actions                                                     |

---

## Configuration Files

### ESLint

ESLint configuration is used to maintain code quality, readability, and uniformity - across browser-based JavaScript, Node.js, and TypeScript.

-   Main rule set for Node.js files, though these rules are also used for TypeScript - where there is generally a high level of parity.
-   Second rule set for compiled Node.js files (matching: "\*\*/lib/src/\*.js", "\*\*/lib/src/\*\*/\*.js", "\*\*/dist/\*.js", "\*\*/dist/\*\*/\*.js")
-   Third rule set for other JavaScript files (matching: service.js, "\*\*/js/\*.js", "\*\*/js/\*\*/\*.js")

### TypeScript

TypeScript configuration establishes the directory structure and compile rules.

-   Source code is taken from /src/ file
-   Compiled code is written to /dist/

...because TypeScript does not clean up older compiled files, clean.js is used (see below).

The current TypeScript configuration will produce:

-   Compiled files (.js)
-   Compiled map files (.js.map)
-   Declaration files (.d.ts)
-   Declaration map files (.d.ts.map)

---

## Ignore Files

### Git

Git ignore controls which files are sent to Bitbucket/GitHub,

Should include only the minimum number of files needed to reproduce development and testing.

**Note:** There is not a blanket ignore on /dist/, the "git" script must be used.

### NPM

NPM ignore controls which files are sent to NPM,

Should include only the minimum number of files needed to utilise the package.

Tests are ignored, as end-users don't need these - contributors can get them from Git.

---

## package.json

Establishes "main" as "./dist/index" instead of "main.js".

Sets up three scripts:

-   watch-end: runs when development "watch" ends
-   build-ts: compiles TypeScript
-   build-sass: compiles Sass
-   build-tailwind: compiles Tailwind
-   build: executes `npm install`, runs "watch-end", executes `npm ci`, sets the environment to production, runs "build-ts", "build-sass", and "build-tailwind"
-   watch-start: runs "build", sets the environment to development, runs "build-tailwind"
-   watch-after-start: runs the main TypeScript dist/index file
-   test: runs "build", then runs mocha tests (minimum reporting)

For development, run "node watch" - this will start the development/auto-compile process.  
Terminating this script will clean the source code, removing any files that should not be committed.

Before require/importing in another script, "build" must have been run.  
Before committing to the Git repository, "watch-end" must have been run.

Using npm init will update this with other NPM properties (for package creation)

---

## GitHub Actions

### node.js.yml

If a commit/pull request is made onto the "master" branch, the "test" script is run.

### npm-publish.yml

If a release is made through the GitHub repository, the package is published to both NPM and GitHub packages. Requires the NPM_TOKEN secret to be setup in the repository.

**Note:** this may have stopped working, only publishing to NPM now

---

## clean.js

If you make an "example.ts" file and compile it, an "example.js" file is produced, if you later decide you don't need "example.ts" and delete it - the "example.js" file (and .js.map, .d.ts, .d.ts.map files) remains in the repository.

This usually isn't a massive deal, perhaps some wasted size on the NPM package until you notice and delete it, but if you're using functions that read directories (even if these functions aren't in your code - they are in Mocha) then these zombie files could cause problems.

clean.js recursively searches a given directory and deletes any files that look like compiled files, given a set of rules for .TS files and .SCSS files.

---

## watch.js

I've tried numerous watchers and I didn't like them too much, so I wrote a simple little watcher for myself. It is given a set of inputs, in the form of a JavaScript array, that tells it what to watch for - and what to trigger.

For example,

```js
let events = {
    "change .md$": "remark -o",
    "change .scss$": "sass dist/public/css",
    "change ^src.+.ts$": "tsc"
};
```

The above events look for:

-   when a file ending in ".md" is changed, remark is run
-   when a file ending in ".scss" is changed, sass is recompiled in a specific directory
-   when a file inside "src" and ending in ".ts" is changed, TypeScript is compiled

Implementing my watcher this way, instead of a pre-existing software, NPM package, IDE plugin, etc. allows me to be independant of the restrictions of those software. These don't have any dependencies and can be easily expanded to run any command prompt/terminal command.
