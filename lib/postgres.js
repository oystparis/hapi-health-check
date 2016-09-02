import pg from 'pg'
import url from 'url'

export default class Postgres {
  constructor (options) {
    const params = url.parse(options.url);
    const auth = params.auth.split(':');

    const config = {
      user: auth[0],
      password: auth[1],
      host: params.hostname,
      port: params.port,
      database: params.pathname.split('/')[1],
      ssl: options.ssl || false,
      max: 1,
      idleTimeoutMillis: 60000
    };
    this._db = new pg.Pool(config)
  }

  createHealthCheck () {
    return async (callback) => {
      try {
        var result = await this._db.query('SELECT 1 as one')
        if (result.rows[0].one === 1) {
          callback(null, 'Database is available')
        } else {
          callback(true, 'Database is unavailable')
        }
      } catch (err) {
        console.error(`error in Postgres health check: ${err}`)
        callback(true, 'Error when accessing the database')
      }
    }
  }
}
