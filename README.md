# pre-commit-xkeshi

    #!/bin/sh

    jsfiles=$(git diff --cached --name-only --diff-filter=ACM  | grep "\.js$")
    vuefiles=$(git diff --cached --name-only --diff-filter=ACM  | grep "\.vue$")

    echo "$jsfiles"
    echo "$vuefiles"


    # 若没有相关文件 直接退出
    if [ "$jsfiles" = "" &&  "$vuefiles" = ""]; then
    exit 0
    fi


    pass=true

    echo "Validating JavaScript:"

    ESLINT="$(git rev-parse --show-toplevel)/node_modules/.bin/eslint"

    for file in ${jsfiles}; do
        echo "------------------------------------------------------"
        result=$(${ESLINT} ${file} | grep "error")
        echo "$result"
        if [ "$result" == "" ]; then
            echo "ESLint Passed: ${file}"
        else
            echo "ESLint Failed: ${file}"
            pass=false
        fi
        echo "------------------------------------------------------"
    done;

    for file in ${vuefiles}; do
        echo "------------------------------------------------------"
        result=$(${ESLINT} ${file} | grep "error")
        echo "$result"
        if [ "$result" == "" ]; then
            echo "ESLint Passed: ${file}"
        else
            echo "ESLint Failed: ${file}"
            pass=false
        fi
        echo "------------------------------------------------------"
    done;


    echo "JavaScript validation complete:"

    if ! $pass; then
        echo "commit [filed]"
        exit 1
    else
        echo "commit [success]"
    fi

project文件夹内的eslinthook文件内容
包通过npm安装
或者手动执行 `node install.js`
可以将eslinthook插入到client的.git/hooks/pre-commit

eslinthook会找到所有将要提交的文件
并lint
如果lint不通过，提交将不成功
 