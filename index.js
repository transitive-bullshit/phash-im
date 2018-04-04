'use strict'

const execa = require('execa')

exports.compute = async (input) => {
  const cmd = await execa(`convert`, [
    '-quiet',
    '-moments',
    input,
    'json:-'
  ])

  // imagemagick uses some non-standard json...
  const stdout = cmd.stdout.replace(/\b(nan)\b/g, 'null').replace(/␍/g, '')
  console.log(stdout)

  const result = JSON.parse(stdout)

  const { image } = result[0]
  const channels = image.channelPerceptualHash

  const values = []
    .concat(extractChannel(channels.Channel0))
    .concat(extractChannel(channels.Channel1))
    .concat(extractChannel(channels.Channel2))

  return values
}

exports.compare = async (hash1, hash2) => {
  const ssd = hash1.reduce((acc, value1, index) => {
    const value2 = hash2[index]
    const diff = (value1 - value2)
    return diff * diff
  }, 0)

  return Math.sqrt(ssd)
}

function extractChannel (channel) {
  return [
    channel.PH1[0],
    channel.PH1[1],
    channel.PH2[0],
    channel.PH2[1],
    channel.PH3[0],
    channel.PH3[1],
    channel.PH4[0],
    channel.PH4[1],
    channel.PH5[0],
    channel.PH5[1],
    channel.PH6[0],
    channel.PH6[1],
    channel.PH7[0],
    channel.PH7[1]
  ]
}
