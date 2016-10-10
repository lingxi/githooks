'use strict'
require('shelljs/global')

function errorExit(msg) {
  echo('[Error]:' + msg)
  process.exit(1)
}

module.exports = errorExit