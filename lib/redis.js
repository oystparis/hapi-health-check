export default class Redis {
  constructor (options) {
    this._redis = require('redis').createClient(options.url)
  }

  createHealthCheck () {
    return (callback) => {
      try {
        const echo = 'healthcheck'

        this._redis.echo(echo, (err, obj) => {
          const failure = !(obj === echo)
          if (err || failure) {
            callback(true, 'Error when accessing Redis')
          } else {
            callback(null, 'Redis is available')
          }
        })
      } catch (err) {
        console.error(`error in Redis health check: ${err}`)
        callback(true, 'Error when accessing Redis')
      }
    }
  }
}
