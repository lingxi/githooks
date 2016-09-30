# githook

mac与sourceTree混合使用,并且nodejs是采用pkg方式安装在 /usr/local/bin/node 目录下
有已知bug
需要 ln -s /usr/local/bin/node /use/bin/node
才能使用



项目采用eslint
需要在提交时进行 提交文件lint

# 关于commit-msg
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

具体查阅 [validate-commit-msg](https://github.com/kentcdodds/validate-commit-msg)

# fix bug
grep正则问题，导致抓取了ejs文件

'\.js$|\.vue$' ->  /\.js|vue$/


[commit-msg](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)