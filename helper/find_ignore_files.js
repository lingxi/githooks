'use strict'
const fs = require('fs')
const path = require('path')
const globule = require('globule')

function ignoreParse (srcBase) {
  let ignore = fs.readFileSync(path.join(srcBase, '.eslintignore')).toString()
  return ignore.split('\n').filter(v => v !== '').map(mapPattern)
}

function mapPattern (pattern) {
  /**
   * TODO:匹配原则待优化
   */
  if (pattern.indexOf('*') > -1 || pattern.indexOf('.') > -1) {
    return pattern
  }
  if (pattern['/'] === pattern.length) {
    return pattern + '**'
  }
  return pattern + '/**'
}

let cacheFileList = []

function findFiles (srcBase) {
  if (findFiles.cached) {
    return cacheFileList
  }

  let patterns = ignoreParse(srcBase)
  let files = globule.find(patterns, { srcBase, nodir: true })
  cacheFileList = files
  findFiles.cached = true

  return files
}

module.exports = findFiles
