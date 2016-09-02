/* global after, beforeEach, afterEach, describe, it */
import Server from './create_server'
import { expect } from 'chai'

const options = {
  method: 'GET',
  url: '/test-status?v&h'
}

describe('Postgres health check', () => {
  beforeEach((done) => Server.start(() => done()))
  afterEach(done => Server.stop(() => done()))

  it('must work', (done) => {
    Server.inject(options, res => {
      expect(res.result.service.status.state).to.equal('GOOD')
      expect(res.result.service.status.message[0]).to.equal('Database is available')
      done()
    })
  })
})
