import AWS from 'aws-sdk'

export default class S3 {
  constructor (options) {
    AWS.config.update({ accessKeyId: options.access_key_id, secretAccessKey: options.secret_access_key });
    this._s3 = new AWS.S3()
  }

  createHealthCheck () {
    return (callback) => {
      try {
        this._s3.listBuckets(function (err, data) {
          if (err) {
            callback(true, 'Error when accessing Amazon S3')
          } else {
            callback(null, 'Amazon S3 is available')
          }
        })
      } catch (err) {
        console.error(`error in S3 health check: ${err}`)
        callback(true, 'Error when accessing Amazon S3')
      }
    }
  }
}
