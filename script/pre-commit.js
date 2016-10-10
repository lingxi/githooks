'use strict'

require('shelljs/global')
global.config.silent = true

const errorExit = require('../helper/error_exit')
const Lint = require('../helper/lint')
const isMatch = require('../helper/is_match')
const findIgnoreFiles = require('../helper/find_ignore_files')
const readPkg = require('../helper/read_pkg')
const path = require('path')
const fs = require('fs')



if (!which('git')) {
  errorExit('Sorry, this script requires git')
}

let root = exec('git rev-parse --show-toplevel')

/**
 * git 和 eslint 环境检测
 */
let rootPath, eslintPath
if (root.code === 0) {
  rootPath = root.stdout.replace('\n', '')
} else {
  errorExit('no git res')
}
const PACKAGE = readPkg(rootPath)

eslintPath = `${rootPath}/node_modules/.bin/eslint`

try {
  fs.statSync(eslintPath)
} catch (e) {
  errorExit('请安装并配置好eslint')
}

/**
 * 获取待lint的文件和被忽略的文件
 * @type {any}
 */
let lintFiles = exec('git diff --cached --name-only --diff-filter=ACM')
  .grep(/\.js$|vue$/).stdout

let ignoreFiles = findIgnoreFiles(rootPath)

let lintFileList = lintFiles
  .split('\n')
  .filter(file=>file != '' && !isMatch(file,ignoreFiles))

/**
 * 从package.json内读取配置信息
 */
let pkg_mode = PACKAGE.config && PACKAGE.config.lint && PACKAGE.config.lint.mode
let lint =new Lint(lintFileList, Lint.MODE_MAP[pkg_mode] || Lint.MODE_MAP.strict)

let pass = lint.exec()

if (!pass) {
  errorExit('you may not pass lint,error show above !!!!')
}else {
  echo('eslint pass !!')
}