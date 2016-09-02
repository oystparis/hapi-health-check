/* global after, beforeEach, afterEach, describe, it */
import Server from './create_server'
import { expect } from 'chai'

const options = {
  method: 'GET',
  url: '/test-status'
}

describe('Custom path', () => {
  beforeEach((done) => Server.start(() => done()))
  afterEach(done => Server.stop(() => done()))

  it('must work', (done) => {
    Server.inject(options, res => {
      expect(res.statusCode).to.equal(200)
      done()
    })
  })
})
