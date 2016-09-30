#!/usr/bin/env node

/**
 * Git COMMIT-MSG hook for validating commit message
 * See https://docs.google.com/document/d/1rk04jEuGfk9kYzfqCuOlPTSJw3hEDZJTBN5E5f1SALo/edit
 *
 * Installation:
 * >> cd <angular-repo>
 * >> ln -s ../../validate-commit-msg.js .git/hooks/commit-msg
 */

'use strict';

var fs = require('fs');
var conventionalCommitTypes = require('conventional-commit-types');
var util = require('util');
var resolve = require('path').resolve;
require('shelljs/global');
var semverRegex = require('semver-regex')

var config = getConfig();
var MAX_LENGTH = config.maxSubjectLength || 100;
var IGNORED = new RegExp(util.format('(^WIP)|(^%s$)', semverRegex().source));

// fixup! and squash! are part of Git, commits tagged with them are not intended to be merged, cf. https://git-scm.com/docs/git-commit
var PATTERN = /^((fixup! |squash! )?(\w+)(?:\(([^\)\s]+)\))?: (.+))(?:\n|$)/;
var MERGE_COMMIT_PATTERN = /^Merge /;
var error = function () {
  // gitx does not display it
  // http://gitx.lighthouseapp.com/projects/17830/tickets/294-feature-display-hook-error-message-when-hook-fails
  // https://groups.google.com/group/gitx/browse_thread/thread/a03bcab60844b812
  console[config.warnOnFail ? 'warn' : 'error']('COMMIT-MSG格式错误: ' + util.format.apply(null, arguments));
  console[config.warnOnFail ? 'warn' : 'error'](`
提交格式：
<type>(<scope>): <subject>
// 空一行
<body>

范例:
  fix: feat(0429留言下单): add 'graphiteWidth' option

  巴拉巴拉说明具体情况

-------------------------------------------------------------------

说明：
type（必需）、scope（可选）和subject（必需）。
<body>(可选)
(1) type
      type用于说明 commit 的类别，只允许使用下面7个标识。
        feat：新功能（feature）
        fix：修补bug
        docs：文档（documentation）
        style： 格式（不影响代码运行的变动）
        refactor：重构（即不是新增功能，也不是修改bug的代码变动）
        test：增加测试
        chore：构建过程或辅助工具的变动
        revert: feat(pencil): add 'graphiteWidth' option (撤销之前的commit)
(2)scope
    scope用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。
(3)subject
    subject是 commit 目的的简短描述，不超过50个字符。
    以动词开头，使用第一人称现在时，比如change，而不是changed或changes
    第一个字母小写
    结尾不加句号（.）

(4)Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。

More detailed explanatory text, if necessary.  Wrap it to 
about 72 characters or so. 

Further paragraphs come after blank lines.

- Bullet points are okay, too
- Use a hanging indent
  `)
};


var validateMessage = function (raw) {
  var types = config.types = config.types || conventionalCommitTypes;

  // resolve types from a module
  if (typeof types === 'string' && types !== '*') {
    types = Object.keys(require(types).types);
  }

  var messageWithBody = (raw || '').split('\n').filter(function (str) {
    return str.indexOf('#') !== 0;
  }).join('\n');

  var message = messageWithBody.split('\n').shift();

  if (message === '') {
    console.log('Aborting commit due to empty commit message.');
    return false;
  }

  var isValid = true;

  if (MERGE_COMMIT_PATTERN.test(message)) {
    console.log('Merge commit detected.');
    return true
  }

  if (IGNORED.test(message)) {
    console.log('Commit message validation ignored.');
    return true;
  }

  var match = PATTERN.exec(message);

  if (!match) {
    error('does not match "<type>(<scope>): <subject>" !');
    isValid = false;
  } else {
    var firstLine = match[1];
    var squashing = !!match[2];
    var type = match[3];
    var scope = match[4];
    var subject = match[5];

    var SUBJECT_PATTERN = new RegExp(config.subjectPattern || '.+');
    var SUBJECT_PATTERN_ERROR_MSG = config.subjectPatternErrorMsg || 'subject does not match subject pattern!';

    if (firstLine.length > MAX_LENGTH && !squashing) {
      error('is longer than %d characters !', MAX_LENGTH);
      isValid = false;
    }

    if (types !== '*' && types.indexOf(type) === -1) {
      error('"%s" is not allowed type ! Valid types are: %s', type, types.join(', '));
      isValid = false;
    }

    if (!SUBJECT_PATTERN.exec(subject)) {
      error(SUBJECT_PATTERN_ERROR_MSG);
      isValid = false;
    }
  }

  // Some more ideas, do want anything like this ?
  // - Validate the rest of the message (body, footer, BREAKING CHANGE annotations)
  // - allow only specific scopes (eg. fix(docs) should not be allowed ?
  // - auto correct the type to lower case ?
  // - auto correct first letter of the subject to lower case ?
  // - auto add empty line after subject ?
  // - auto remove empty () ?
  // - auto correct typos in type ?
  // - store incorrect messages, so that we can learn

  isValid = isValid || config.warnOnFail;

  if (isValid) { // exit early and skip messaging logics
    return true;
  }

  var argInHelp = config.helpMessage && config.helpMessage.indexOf('%s') !== -1;

  if (argInHelp) {
    console.log(config.helpMessage, messageWithBody);
  } else if (message) {
    console.log(message);
  }

  if (!argInHelp && config.helpMessage) {
    console.log(config.helpMessage);
  }

  return false;
};


// publish for testing
exports.validateMessage = validateMessage;
exports.getGitFolder = getGitFolder;
exports.config = config;

// hacky start if not run by mocha :-D
// istanbul ignore next
if (process.argv.join('').indexOf('mocha') === -1) {

  var commitMsgFile = process.argv[2] || getGitFolder() + '/COMMIT_EDITMSG';
  var incorrectLogFile = commitMsgFile.replace('COMMIT_EDITMSG', 'logs/incorrect-commit-msgs');

  var hasToString = function hasToString(x) {
    return x && typeof x.toString === 'function';
  };

  fs.readFile(commitMsgFile, function (err, buffer) {
    var msg = getCommitMessage(buffer);

    if (!validateMessage(msg)) {
      fs.appendFile(incorrectLogFile, msg + '\n', function () {
        process.exit(1);
      });
    } else {
      process.exit(0);
    }

    function getCommitMessage(buffer) {
      return hasToString(buffer) && buffer.toString();
    }
  });
}




function getConfig() {
  var defaultConfig = {
    "types": ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "revert"], // default
    "warnOnFail": false, // default
    "maxSubjectLength": 100, // default
    "subjectPattern": ".+", // default
    "subjectPatternErrorMsg": 'subject does not match subject pattern!', // default
    "helpMessage": "" //default
  }
  let root = exec('git rev-parse --show-toplevel').stdout.replace('\n', '')
  let pkg = require(resolve(root, 'package.json'))
  var config = pkg && pkg.config && pkg.config['validate-commit-msg']
  return Object.assign(defaultConfig, config || {});
}

function getGitFolder() {
  var gitDirLocation = './.git';
  if (!fs.existsSync(gitDirLocation)) {
    throw new Error('Cannot find file ' + gitDirLocation);
  }

  if (!fs.lstatSync(gitDirLocation).isDirectory()) {
    var unparsedText = '' + fs.readFileSync(gitDirLocation);
    gitDirLocation = unparsedText.substring('gitdir: '.length).trim();
  }

  if (!fs.existsSync(gitDirLocation)) {
    throw new Error('Cannot find file ' + gitDirLocation);
  }

  return gitDirLocation;
}