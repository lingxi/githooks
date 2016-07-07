# pre-commit 0.1.5

特性：为公司定制

    #!/bin/sh

    files=$(git diff --cached --name-only --diff-filter=ACM | grep "\.js$\|\.vue$")

    echo "$files"


    # 若没有相关文件 直接退出
    if [ "$files" = "" ]; then 
        exit 0 
    fi

    pass=true

    echo "Validating JavaScript:"

    ESLINT="$(git rev-parse --show-toplevel)/node_modules/.bin/eslint"

    for file in ${files}; do
        echo "------------------------------------------------------"
        result=$(${ESLINT} ${file} | grep "error")
        echo "$result"
        if [ "$result" == "" ]; then
            echo "eSLint Passed: ${file}"
        else
            echo "eSLint Failed: ${file}"
            pass=false
        fi
        echo "------------------------------------------------------"
    done

    echo "JavaScript validation complete:"

    if ! $pass; then
        echo "commit [filed]"
        exit 1
    else
        echo "commit [success]"
    fi

以上脚本获取所有需要提交的文件名中js,vue后缀的文件，并依次eslint
依赖于local eslint已经安装