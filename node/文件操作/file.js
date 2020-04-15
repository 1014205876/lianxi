(function () {
    var fs = require('fs');
    addFile({
        name: '新建文件',
        main: '文件内容',
        callback:()=> {
            console.log(123)
        }
    })

    // readFile(
    //     '新建文件',
    //     (data) => {
    //         console.log(data)
    //     }
    // )

    //创建文件
    function addFile(obj) {//没有文件时新建，有时添加main
        fs.appendFile(obj.name, obj.main, 'utf-8', function (err) {
            if (err) {
                console.log('创建失败');
                console.log(err);
            } else {
                obj.callback();
            }
        });
    }

    //读取文件
    function readFile(name, callback) {
        fs.readFile(name, 'utf-8', function (err, data) {
            if (err) {
                console.log('读取失败');
                console.log(err);
            } else {
                callback(data);
            }
        })
    }

    //删除文件
    function remaveFile(name, callback) {
        fs.unlink(name, function (err) {
            if (err) {
                console.log('删除失败');
                console.log(err);
            } else {
                callback();
            }
        })
    }
})()