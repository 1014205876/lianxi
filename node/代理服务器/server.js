var http = require('http');
var url = require('url');

http.createServer(function(req,res){

    var url=req.url.substring(1,req.url.length);//去掉最前面的

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
    console.log(url,1)
    console.log(http.request(url,function(pres){
        console.log(pres)
    }))

    // var proxyRequert=http.request(url,function(pres){
    //     // res.writeHead(pres.statusCode,pres.headers);
    //     // pres.on('data',function(data){
    //     //     res.write(data);
    //     // });
    //     // pres.on('end',function(){
    //     //     res.end();
    //     // });
    // });
    // console.log(proxyRequert)
    
    // req.on('data',function(data){
    //     proxyRequrst.write(data);
    // })
    // req.on('end',function(data){
    //     proxyRequrst.end(data);
    // })

}).listen(3010)