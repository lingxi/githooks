'use strict'

const fs = require('fs');
const path = require('path');

let exists = fs.existsSync || path.existsSync;

let hook = path.resolve(__dirname, 'eslinthook');
let root = path.resolve(__dirname, '../', '../');
let git = path.resolve(root, '.git'), hooks = path.resolve(git, 'hooks'),
    precommit = path.resolve(hooks, 'pre-commit');

if (!exists(git) || !fs.lstatSync(git).isDirectory()) {
  root = path.resolve(root, '../../../');
  git = path.resolve(root, '.git');
  hooks = path.resolve(git, 'hooks');
  precommit = path.resolve(hooks, 'pre-commit');
}

if (!exists(git) || !fs.lstatSync(git).isDirectory())
  return;

if (!exists(hooks))
  fs.mkdirSync(hooks);

let f =fs.createWriteStream(precommit)
fs.createReadStream(hook).pipe(f)

f.on('close',()=>{
  console.log(f)
  fs.chmodSync(precommit, '777');
})