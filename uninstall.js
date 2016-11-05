'use strict'

require('shelljs/global')
const path = require('path')

let root = exec('git rev-parse --show-toplevel').stdout.replace('\n', '')
let git = path.resolve(root, '.git')
let hooks = path.resolve(git, 'hooks')
let precommit = path.resolve(hooks, 'pre-commit')
let commitmsg = path.resolve(hooks, 'commit-msg')

rm('-rf', precommit)
rm('-rf', commitmsg)
echo(' uninstall eslinthook success!')
