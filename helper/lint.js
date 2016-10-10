'use strict'

const sh = require('shelljs')
const CLIEngine = require('eslint').CLIEngine

let cli = new CLIEngine({
  envs: ["browser", "mocha"],
  useEslintrc: true
})

let formatter = cli.getFormatter();

let MODE_MAP = {
  normal: 1,
  strict: 2
}
/**
 { results:
   [ { filePath: 'D:\\linux\\xkeshi\\eslint-githook\\demo\\foo.js',
       messages: [Object],
       errorCount: 3,
       warningCount: 0 },
     { filePath: 'D:\\linux\\xkeshi\\eslint-githook\\demo\\index.js',
       messages: [Object],
       errorCount: 3,
       warningCount: 0 } ],
    errorCount: 6,
    warningCount: 0
  }


 * @param report
 */
class Lint {
  static get MODE_MAP(){
    return MODE_MAP
  }
  /**
   *
   * @param files 需要lint的文件列表
   * @param mode  lint报告的模式 normal strict
   */
  constructor(files, mode) {
    this.files = files
    this.mode = mode
  }


  exec() {
    let report = cli.executeOnFiles(this.files)

    sh.echo(this.getFormatResults(report.results))

    let pass;
    switch (this.mode) {
      case MODE_MAP.normal:
        pass = this._execNormal(report)
        break
      case MODE_MAP.strict:
        pass = this._execStrict(report)
        break
    }

    return pass
  }

  _execNormal(report) {
    return report.errorCount === 0
  }

  _execStrict(report) {
    return report.errorCount + report.warningCount === 0
  }


  getFormatResults (results) {
    /**
     * 正常模式下 过滤掉警告
     * 严格模式下 警告也会输出
     */
    if(this.mode == Lint.MODE_MAP.normal){
      results = CLIEngine.getErrorResults(results)
    }
    return formatter(results)
  }
}


module.exports = Lint