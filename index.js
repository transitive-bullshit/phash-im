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
  const stdout = cmd.stdout
    .replace(/␍/gm, '')
    .trim()
    .replace(/\b(nan)\b/g, 'null')
  const result = JSON.parse(stdout)

  const { image } = (Array.isArray(result) ? result[0] : result)
  const channels = image.channelPerceptualHash

  const values = []
    .concat(extractChannel(channels.Channel0 || channels.redHue))
    .concat(extractChannel(channels.Channel1 || channels.greenChroma))
    .concat(extractChannel(channels.Channel2 || channels.blueLuma))

  return values
}

exports.compare = async (hash1, hash2) => {
  const ssd = hash1.reduce((acc, value1, index) => {
    const value2 = hash2[index]
    const diff = (value1 - value2)
    return acc + diff * diff
  }, 0)

  return Math.sqrt(ssd)
}

function extractChannel (channel) {
  const results = [
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

  if (typeof results[0] === 'string') {
    return results.map(parseFloat)
  } else {
    return results
  }
}
