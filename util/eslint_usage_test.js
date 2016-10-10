'use strict'
const CLIEngine = require('eslint').CLIEngine

let cli = new CLIEngine({
  envs: ["browser", "mocha"],
  useEslintrc: true
})

var report = cli.executeOnFiles(
  ["../demo/foo.js", "../demo/index.js","./iconv.js"]);

console.log(report)

console.log(report.results[0].messages)