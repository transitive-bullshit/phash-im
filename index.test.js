'use strict'

const { test } = require('ava')
const path = require('path')
const rmfr = require('rmfr')
const sharp = require('sharp')
const tempy = require('tempy')

const phash = require('.')

const fixturesPath = path.join(__dirname, `media`)

const EPSILON = 0.06

const files = [
  'airplane.png',
  'barbara.png',
  'boats.png',
  'lena.png',
  'mandril.png',
  'peppers.png',
  'tiffany.png',
  'zelda.png'
]

files.forEach((file) => {
  const input = path.join(fixturesPath, file)

  test(`${file} compute`, async (t) => {
    const hash = await phash.compute(input)
    t.truthy(Array.isArray(hash))
    t.is(hash.length, 42)

    hash.forEach((item) => {
      t.is(typeof item, 'number')
    })
  })

  test(`${file} => jpg`, async (t) => {
    const output = tempy.file({ extension: 'jpg' })
    await sharp(input)
      .jpeg({ quality: 40 })
      .toFile(output)

    const hash1 = await phash.compute(input)
    const hash2 = await phash.compute(output)

    const value = await phash.compare(hash1, hash2)
    t.truthy(value < EPSILON)

    await rmfr(output)
  })

  test(`${file} => resize 128x128`, async (t) => {
    const output = tempy.file({ extension: 'png' })
    await sharp(input)
      .resize(128, 128)
      .toFile(output)

    const hash1 = await phash.compute(input)
    const hash2 = await phash.compute(output)

    const value = await phash.compare(hash1, hash2)
    t.truthy(value < EPSILON)

    await rmfr(output)
  })

  test(`${file} => resize 2048x2048`, async (t) => {
    const output = tempy.file({ extension: 'png' })
    await sharp(input)
      .resize(2048, 2048)
      .toFile(output)

    const hash1 = await phash.compute(input)
    const hash2 = await phash.compute(output)

    const value = await phash.compare(hash1, hash2)
    t.truthy(value < EPSILON)

    await rmfr(output)
  })

  test(`${file} => rotate 90 degrees`, async (t) => {
    const output = tempy.file({ extension: 'png' })
    await sharp(input)
      .rotate(90)
      .toFile(output)

    const hash1 = await phash.compute(input)
    const hash2 = await phash.compute(output)

    const value = await phash.compare(hash1, hash2)
    t.truthy(value < EPSILON)

    await rmfr(output)
  })

  test(`${file} => flip => jpg`, async (t) => {
    const output = tempy.file({ extension: 'jpg' })
    await sharp(input)
      .flip()
      .toFile(output)

    const hash1 = await phash.compute(input)
    const hash2 = await phash.compute(output)

    const value = await phash.compare(hash1, hash2)
    t.truthy(value < EPSILON)

    await rmfr(output)
  })

  test(`${file} => blur sigma=10`, async (t) => {
    const output = tempy.file({ extension: 'png' })
    await sharp(input)
      .blur(10)
      .toFile(output)

    const hash1 = await phash.compute(input)
    const hash2 = await phash.compute(output)

    const value = await phash.compare(hash1, hash2)
    t.truthy(value < EPSILON)

    await rmfr(output)
  })
})

for (let i = 0; i < files.length; ++i) {
  const fileI = files[i]
  const inputI = path.join(fixturesPath, fileI)

  for (let j = i + 1; j < files.length; ++j) {
    const fileJ = files[j]
    const inputJ = path.join(fixturesPath, fileJ)

    test(`${fileI} != ${fileJ}`, async (t) => {
      const hash1 = await phash.compute(inputI)
      const hash2 = await phash.compute(inputJ)

      const value = await phash.compare(hash1, hash2)
      t.truthy(value > 0.15)
    })
  }
}
