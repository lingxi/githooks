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


rm('-rf',precommit);
echo(' uninstall eslinthook success!')