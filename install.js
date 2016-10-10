'use strict'

require('shelljs/global')
const fs = require('fs')
const path = require('path')

let exists = fs.existsSync || path.existsSync
let pkgName = require('./package.json').name

// 文件夹选择
let hook = path.resolve(__dirname, 'hook')
let root = exec('git rev-parse --show-toplevel').stdout.replace('\n', '')
let git = path.resolve(root, '.git')
let hooks = path.resolve(git, 'hooks')

let tasks = ['pre-commit', 'commit-msg']

if (!exists(git) || !fs.lstatSync(git).isDirectory()) {
  console.log('请安装git')
  process.exit(0)
}

if (!exists(hooks)) {
  console.log('未找到.git/hooks文件夹，帮您创建')
  fs.mkdirSync(hooks)
}

tasks.forEach((value, index) => {
  let task = path.resolve(hooks, value)
  let hookFile = fs.readFileSync(hook).toString()
  hookFile = hookFile.replace('$NODEJS', process.execPath)
  hookFile = hookFile.replace('$NODEJSPATH', path.resolve(process.execPath, '../'))
  hookFile = hookFile.replace('$TASK', `${pkgName}/script/${value}.js`)
  fs.writeFileSync(task, hookFile)

  fs.chmodSync(task, '777')
  console.log(`${task} installed !`)
})

