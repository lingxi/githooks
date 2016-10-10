'use strict'
const path = require('path')

function readPkg(root) {
  return require(path.resolve(root,'package.json'))
}

module.exports = readPkg