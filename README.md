# githooks

## 特性
安装此包，将会在项目目录的.git文件夹内植入钩子，用来规范团队成员的代码提交
目前的钩子种类: pre-commit,commit-msg


## 关于pre-commit
git提交时的钩子，该钩子将会在git提交时自动触发
触发钩子会自动调用eslint，检测提交文件当中的.js和.vue文件
如果eslint未通过，则不允许提交

检测分为:normal和strict模式
normal模式：将忽略warning，只有error禁止提交
strict模式：warning和error都将禁止提交

钩子默认使用strict模式
如需改成normal模式，需要在package.json内配置
```
"config":{
    "lint":{
      "mode":"norsmal"
    }
 }
```

注意： eslint和git需要自行安装


## 关于commit-msg
该钩子会在pre-commit检测结束之后触发
将会检测commit message是否符合格式
<type>(<scope>): <subject>
具体解释参照：[commit-msg](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
检测失败会log出详细文档

可在项目package.json添加上如下配置项来覆盖默认配置

```
// 这里展示的是默认配置
 "config": {
    "validate-commit-msg": {
      "types": ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "revert","br"], // default
      "warnOnFail": false, // default
      "maxSubjectLength": 100, // default
      "subjectPattern": ".+", // default
      "subjectPatternErrorMsg": 'subject does not match subject pattern!', // default
      "helpMessage": "" //default
    }
  }
```
配置项的含义参照 [validate-commit-msg](https://github.com/kentcdodds/validate-commit-msg)

提交信息的说明文档
```
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
      type用于说明 commit 的类别，只允许使用下面8个标识。
        br: 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
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
```


## fix bug
grep正则问题，导致抓取了ejs文件

'\.js$|\.vue$' ->  /\.js|vue$/

## 未解决的问题
mac与sourceTree混合使用,并且nodejs是采用pkg方式安装在 /usr/local/bin/node 目录下
有已知bug
需要 ln -s /usr/local/bin/node /use/bin/node
才能使用

