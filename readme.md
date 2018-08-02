# phash-im

> Perceptual image hashing via [imagemagick](http://www.fmwconcepts.com/misc_tests/perceptual_hash_test_results_510/index.html).

[![NPM](https://img.shields.io/npm/v/phash-im.svg)](https://www.npmjs.com/package/phash-im) [![Build Status](https://travis-ci.com/transitive-bullshit/phash-im.svg?branch=master)](https://travis-ci.com/transitive-bullshit/phash-im) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

There are many ways to compute [perceptual image hashes](https://www.wikiwand.com/en/Perceptual_hashing), with the open source [pHash](http://www.phash.org/) library being one of the most popular. After researching a few dozen different approaches, we've settled on imagemagick's implementation, for the following reasons:

- **modern** - based on an [approach](http://www.naturalspublishing.com/files/published/54515x71g3omq1.pdf) from 2011
- **robust** against a variety of [attacks](http://www.fmwconcepts.com/misc_tests/perceptual_hash_test_results_510/index.html)
- thoroughly **[tested](https://github.com/transitive-bullshit/phash-im/tree/master/index.test.js)**
- **easy to install** - [imagemagick](http://imagemagick.org) has great cross-platform support


## Install

- Install a recent version of [imagemagick](http://imagemagick.org) >= `v7` (`brew install imagemagick` on Mac OS).

```bash
npm install --save phash-im
# or
yarn add phash-im
```


## Usage

```js
const phash = require('phash-im')

const hash1 = await phash.compute('./media/lena.png')
const hash2 = await phash.compute('./media/barbara.png')

const diff = await phash.compare(hash1, hash2)
```


## API

### phash.compute(input)

Returns: `Promise<Array<Number>>`

Computes the perceptual hash of the given image. Note that the result will be an array of 42 floating point values, corresponding to the 7 image moments comprised of 2 points each across 3 color channels RGB (`7 * 2 * 3 = 42`).

#### input

Type: `String`
**Required**

Path to an image file.

### phash.compare(hash1, hash2)

Returns: `Promise<Number>`

Computes the L2 norm of the two hashes returnd by `phash.compute` (sum of squared differences).

#### hash1

Type: `Array<Number>`
**Required**

Perceptual hash of first image.

#### hash2

Type: `Array<Number>`
**Required**

Perceptual hash of second image.


## Related

- [phash-imagemagick](https://github.com/scienceai/phash-imagemagick) - Alternate version of this module which parses imagemagick output instead of using json.
- [pHash](http://www.phash.org/) - A popular open source perceptual hash library.


## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
