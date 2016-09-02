import Hapi from 'hapi'
import plugin from '../lib'

const HOST = process.env.HOSTNAME || '0.0.0.0'
const PORT = +process.env.PORT || 9999
const Server = module.exports = new Hapi.Server()

Server.connection({ host: HOST, port: PORT })
Server.register({
  register: plugin,
  options: {
    path: '/test-status',
    health_checks: [
      {
        type: 'postgres',
        options: {
          url: process.env.DATABASE_URL,
          ssl: true
        }
      },
      {
        type: 'redis',
        options: {
          url: process.env.REDIS_URL
        }
      },
      {
        type: 'nats',
        options: {
          url: process.env.NATS_URL
        }
      },
      {
        type: 's3',
        options: {
          access_key_id: process.env.ACCESS_KEY_ID,
          secret_access_key: process.env.SECRET_ACCESS_KEY
        }
      }
    ]
  }
}, (err) => {
  if (err) console.log(err)
})

export default Server
