'use strict'

const ignoreParse = require('../helper/find_ignore_files')
const globule = require('globule')
const path = require('path')

let cwd = path.resolve(process.cwd(), '../')

let ignorePatterns = ignoreParse(cwd).map(mapPattern)

let waitMath = 'util/iconv.js'

console.log(ignorePatterns)

// let pattern = `+(${ignorePatterns.join('|')})`

// console.log(pattern)


let flag = globule.find(ignorePatterns, { srcBase: '../', nodir: true })

console.log(flag.indexOf(waitMath) > -1)


function mapPattern(pattern) {
  if (pattern.indexOf('*') > -1) {
    return pattern
  }
  if (pattern['/'] === pattern.length) {
    return pattern + '**'
  }
  return pattern + '/**'
}
