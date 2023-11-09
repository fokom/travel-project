const { expect } = require('@jest/globals')
const app = require('../src/server/server')


describe('Testing express server', () => {


    it('should defined in the project ', async() => {

        expect(app).toBeDefined

    })
})
