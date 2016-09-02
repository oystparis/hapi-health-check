/* global after, beforeEach, afterEach, describe, it */
import Server from './create_server'
import { expect } from 'chai'

const options = {
  method: 'GET',
  url: '/test-status?v&h'
}

describe('S3 health check', () => {
  beforeEach((done) => Server.start(() => done()))
  afterEach(done => Server.stop(() => done()))

  it('must work', (done) => {
    Server.inject(options, res => {
      expect(res.result.service.status.state).to.equal('GOOD')
      expect(res.result.service.status.message[3]).to.equal('Amazon S3 is available')
      done()
    })
  })
})
