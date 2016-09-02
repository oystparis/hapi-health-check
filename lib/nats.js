export default class Nats {
  constructor (options) {
    this._nats = require('nats').connect(options.url)
    this._nats.on('error', (err) => {
      console.error(`Error with nats [${options.url}]: ${err}`);
      this._isError = true
    })
    this._nats.on('connect', _ => {
      this._isError = false
    })
  }

  createHealthCheck () {
    return (callback) => {
      if(this._isError) {
        callback(true, 'Error with nats')
      } else {
        callback(null, 'Nats is available')
      }
    }
  }
}
