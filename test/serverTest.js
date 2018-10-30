const assert = require('assert')
const app = require('../server')
const request = require('supertest')


// testing /get 
describe ('GET /count', function (){
    it('Should return count value from redis' , function(){
            return request(app).get('/count')
                .expect(200)
                .then(res => {
                    assert.ok(res.body > 0)
                })
    })
})