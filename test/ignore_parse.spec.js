'use strict'
const expect = require('chai').expect
const findIgnoreFiles = require('../helper/find_ignore_files')
const isMatch = require('../helper/is_match')

const root = process.cwd()

describe('解析eslintignore ', ()=> {
  let IgnoreFiles
  before(() => {
    console.time('the first find')
    IgnoreFiles = findIgnoreFiles(root)
    console.timeEnd('the first find')
  })


  // it('读取文件，解析成待匹配文件列表', ()=> {
  //   expect(IgnoreFiles[0]).to.be.contain('helper')
  // })

  it('IgnoreFiles 解析是否缓存', ()=> {
    console.time('the second time')
    findIgnoreFiles(root)
    expect(findIgnoreFiles.cached).to.be.eq(true)
    console.timeEnd('the second time')

    console.time('the third time')
    findIgnoreFiles(root)
    expect(findIgnoreFiles.cached).to.be.eq(true)
    console.timeEnd('the third time')
  })
})

describe('匹配文件',()=>{
  let IgnoreFiles
  before(() => {
    IgnoreFiles = findIgnoreFiles(root)
  });

  it('指定文件在文件列表中',()=>{
    let file = 'util/iconv.js'
    expect(isMatch(file,IgnoreFiles)).to.be.eq(true)
  })

  it('指定文件不在文件列表中',()=>{
    let file = 'foo/bar.js'
    expect(isMatch(file,IgnoreFiles)).to.be.eq(false)

  })

})