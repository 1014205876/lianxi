var config = require('./config');
var COS = require('cos-nodejs-sdk-v5');
let OSS = require('ali-oss');
var fs = require('fs');
var UUID = require('uuid');

// 创建实例
var cos = new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey,
});

var fileUtils = {
    putObject:function (filePath,filenName,fileSize,callback) {

        // 调用方法
        cos.putObject({
            Bucket: config.Bucket, /* 必须 */ // Bucket 格式：test-1250000000
            Region: config.Region,
            Key: UUID.v1() +'_'+filenName, /* 必须 */
            TaskReady: function (tid) {
                TaskId = tid;
            },
            onProgress: function (progressData) {
                console.log(JSON.stringify(progressData));
            },

            // 格式1. 传入文件内容
            // Body: fs.readFileSync(filepath),
            // 格式2. 传入文件流，必须需要传文件大小
            Body: fs.createReadStream(filePath),
            ContentLength: fileSize
        }, callback);
    }
};

var client = new OSS({
    region: config.region,
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket
});
// 阿里云
// async function fileUtils(name, path, callback) {
//     try {
//         const result = await client.put(name, path, {
//             headers: { 'Content-Disposition': 'attachment' }
//         });
//         // const result = await client.put(name, path);
//         callback(200, result)
//     } catch (err) {
//         callback(500, err)
//     }
// }

module.exports = fileUtils;