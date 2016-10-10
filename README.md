# githooks

## 特性
安装此包，将会在项目目录的.git文件夹内植入钩子
目前的钩子种类: pre-commit,commit-msg

1. 关于pre-commit
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

2. 关于commit-msg
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
      "types": ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "revert"], // default
      "warnOnFail": false, // default
      "maxSubjectLength": 100, // default
      "subjectPattern": ".+", // default
      "subjectPatternErrorMsg": 'subject does not match subject pattern!', // default
      "helpMessage": "" //default
    }
  }
```

配置参照 [validate-commit-msg](https://github.com/kentcdodds/validate-commit-msg)

## fix bug
grep正则问题，导致抓取了ejs文件

'\.js$|\.vue$' ->  /\.js|vue$/

## 未解决的问题
mac与sourceTree混合使用,并且nodejs是采用pkg方式安装在 /usr/local/bin/node 目录下
有已知bug
需要 ln -s /usr/local/bin/node /use/bin/node
才能使用

