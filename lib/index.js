import Nats from './nats'
import pkg from '../package.json'
import Postgres from './postgres'
import { concat, merge } from 'ramda'
import Redis from './redis'
import rootPath from 'app-root-path'
import S3 from './s3'

const register = (server, pluginOptions, next) => {
  const appPkg = require(`${rootPath}/package.json`);
  const env = process.env.NODE_ENV || 'DEV';

  const defaultOptions = {
    path: '/status',
    health_checks: [],
    custom_health_checks: [],
    feature_health_checks: [],
    custom_feature_health_checks: []
  }
  const options = merge(defaultOptions, pluginOptions)

  server.register({
    register: require('hapi-and-healthy'),
    options: {
      env: env,
      name: appPkg.name,
      path: options.path,
      test: {
        node: concat(createHealthCheckArray(options.health_checks), options.custom_health_checks),
        features: concat(createHealthCheckArray(options.feature_health_checks), options.custom_feature_health_checks)
      },
      usage: true,
      version: appPkg.version
    }
  }, (err) => {
    if (err) {
      console.error(`Error when registering plugin hapi-and-healthy : ${err}`)
      throw err
    }
  })

  next()
}

register.attributes = {
  pkg
}

const createHealthCheckArray = (healthChecks) => {
  if (!healthChecks || !Array.isArray(healthChecks)) {
    return []
  }

  const result = []
  for (let check of healthChecks) {
    switch (check.type) {
      case 'postgres':
        result.push(new Postgres(check.options).createHealthCheck())
        break;
      case 'redis':
        result.push(new Redis(check.options).createHealthCheck())
        break;
      case 's3':
        result.push(new S3(check.options).createHealthCheck())
        break;
      case 'nats':
        result.push(new Nats(check.options).createHealthCheck())
        break;
    }
  }

  return result
}

export default register
