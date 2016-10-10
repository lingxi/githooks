'use strict'

function isMatch (file, ignoreFiles) {
  return !!~ignoreFiles.indexOf(file)
}

module.exports = isMatch
