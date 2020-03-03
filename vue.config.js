const webpack = require('webpack')

function setupAPI () {
  switch (process.env.NODE_ENV) {
    case 'production':
      return "'https://api.pamiatki.kucza.xyz/'"
    default:
      return "'http://192.168.1.148:8081/'"
  }
}

function setupKey () {
  switch (process.env.NODE_ENV) {
    case 'production':
      return process.env.GMAPS_KEY
    default:
      return "''"
  }
}

let apiHost = setupAPI()
let apiKey = setupKey()

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __APIHOST__: apiHost,
        __GOOGLEKEY__: apiKey
      })
    ]
  }
}
