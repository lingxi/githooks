'use strict'

const {validateMessage}  = require('../script/commit-msg')
const expect = require('chai').expect

// fix: feat(0429留言下单): add 'graphiteWidth' option
describe("commit msg hook spec",()=>{
  let str = "br: feat(0429留言下单): add 'graphiteWidth' option"
  it("对单行文本的校验",()=>{
    expect(validateMessage(str)).to.be.eq(true)
  })
})