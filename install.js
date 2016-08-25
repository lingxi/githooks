'use strict'

require('shelljs/global');
const fs = require('fs');
const path = require('path');

let exists = fs.existsSync || path.existsSync;

let hook = path.resolve(__dirname, 'eslinthook');
let root = exec('git rev-parse --show-toplevel').stdout.replace('\n', '');
let git = path.resolve(root, '.git'),
  hooks = path.resolve(git, 'hooks'),
  precommit = path.resolve(hooks, 'pre-commit');


if (!exists(git) || !fs.lstatSync(git).isDirectory())
  return;

if (!exists(hooks))
  fs.mkdirSync(hooks);

// let f =fs.createWriteStream(precommit)
// fs.createReadStream(hook).pipe(f)
// console.log(hook);
let hookFile = fs.readFileSync(hook).toString();
hookFile = hookFile.replace('$NODEJS', process.execPath);
hookFile = hookFile.replace('$NODEJSPATH',path.resolve(process.execPath,'../'))
fs.writeFileSync(precommit, hookFile);


fs.chmodSync(precommit, '777');
console.log('pre-commit installed')
