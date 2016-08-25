'use strict';

require('shelljs/global');
const path = require('path')

if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}


let root = exec('git rev-parse --show-toplevel')
let rootPath, eslintPath;
if (root.code === 0) {
  rootPath = root.stdout.replace('\n', '');
  eslintPath = `${rootPath}/node_modules/.bin/eslint`
} else {
  echo('Error: no git res');
  exit(1);
}

let jsfiles = exec('git diff --cached --name-only --diff-filter=ACM').grep('\.js$|\.vue$').stdout;
// let jsfiles = exec('git diff --name-only').stdout;
let jsfileArr = jsfiles.split('\n');
let pass = true;

jsfileArr.forEach((file) => {
  if (file == '') return;
  file = path.join(rootPath, file); // 需要lint的文件的绝对路径
  let lint = exec(`${eslintPath} ${file}`)
  // console.log(lint);
  if (lint.code == 0) return;
  if (lint.code != 1) {
    echo(`未知错误,咨询wj`);
    exit(1);
  }
  let error = lint.grep('error').stdout;
  // console.log(`${eslintPath} ${file}`);
  if (error) {
    pass = false;
  }

})


if (pass) {
  echo('eslint pass')
} else {
  echo('eslint failed')
  exit(1);
}