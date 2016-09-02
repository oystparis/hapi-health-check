/* global after, beforeEach, afterEach, describe, it */
import Server from './create_server'
import { expect } from 'chai'

const options = {
  method: 'GET',
  url: '/test-status?v&h'
}

describe('Nats health check', () => {
  beforeEach(function (done) {
    this.timeout(3000)
    Server.start(() => {
      setTimeout(done, 1000) // wait for nats connection
    })
  })
  afterEach((done) => Server.stop(() => done()))

  it('must work', (done) => {
    Server.inject(options, res => {
      expect(res.result.service.status.state).to.equal('GOOD')
      expect(res.result.service.status.message[2]).to.equal('Nats is available')
      done()
    })
  })
})
