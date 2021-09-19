# Labrador

This is a prototype tool for editing YAML i18n strings.

You have 2 files.
The reference file is the version of the file you want to be translated
and the target file is the translation you want to produce.
You load both of these files into the tool and it generates an interface for you to do the translation.

Press save at any time to download a modified version of the target file with any changes made to it.
Send that file back to whoever asked you to translate it.

Current translations and changes are stored in `localStorage`
so it will persist between reloads.

## Background

I made this repo to play around with [alpine.js](https://alpinejs.dev/),
[css variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
and [vite](https://vitejs.dev/).

## Development

### Setup

Check out the repo and `npm install` to get the latest dependencies.
Run `npm run prepare` to setup the [husky](https://typicode.github.io/husky/) integration.

### Development

```sh
# Run the development server with hot-reloading
npm run dev

# Run the build
npm run build
```

### Formatting

Code is automatically formatted using [prettier](https://prettier.io),
this runs automatically when comitting code.
Commit's will fail if invalid code is staged.
You can manually format code with `npm run format` if you want.

### Commits

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/),
this is linted using [husky](https://typicode.github.io/husky/).

### Releasing

Releases are generated with [standard-version](https://github.com/conventional-changelog/standard-version).
This decides the next version and generates the [CHANGELOG.md](/CHANGELOG.md)
based on commit messages.

```sh
npm run release
```
