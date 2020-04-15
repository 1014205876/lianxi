//routes/db.js  封装好的操作 mongodb 文件(模块)

// 1.加载mongodb模块
// 2.创建 mongodb 的客户端 Client
// 3.客户端连接本地 mongodb 数据库的地址
// function(){
	// 4.客户端的地址   连接  ==> 链接好的客户端
	// 5.获取 db ==> 获取对操作数据库的链接
	// 6.获取collection  ==> 在db上获取   对操作集合的链接
// }

// function(){
	// 7.在集合  collection 上操作数据
	//    cmd                 node
	// 查找 find()             find() 转换成数组
	// 添加 insert()           insert()
	// 删除 remove()           deleteOne 删除一条
	// 修改 update()           updateOne 修改一条 

	// 8.关闭 客户端
// }
// 添加的方法
// 传递参数
// 第一个参数   client  操作的客户端   ==> 关闭客户端
// 第二个参数   collection 操作的集合  ==> 执行具体的操作数据的方法
// 第三个参数    data    操作的数据   ==> 具体的操作数据
// 第四个参数    callback  操作成功后的回调   ==> 操作成功后的回调
var insert=function(client,collection,data,callback){
	collection.insert(data,function(err,result){
		if(err){
			console.log("添加失败");
			console.log(err);
		}else{
			callback(result);//通过回调  传出  操作后的结果
		}
		client.close();//关闭客户端
	})
}

//查询
// 传递参数
// 第一个参数   client  操作的客户端   ==> 关闭客户端
// 第二个参数   collection 操作的集合  ==> 执行具体的操作数据的方法
// 第三个参数    data    操作的数据   ==> 具体的操作数据
// 第四个参数    callback  操作成功后的回调   ==> 操作成功后的回调
var find=function(client,collection,data,callback){
	collection.find(data).toArray(function(err,result){
		if(err){
			console.log("查找数据失败");
			console.log(err);
		}else{
			callback(result);//通过回调  传出  操作后的结果
		}
		client.close();//关闭客户端
	})
}

//修改
// 传递参数
// 第一个参数   client  操作的客户端   ==> 关闭客户端
// 第二个参数   collection 操作的集合  ==> 执行具体的操作数据的方法
// 第三个参数    data    操作的数据   ==> 具体的操作数据
// 第四个参数    callback  操作成功后的回调   ==> 操作成功后的回调
var update=function(client,collection,data,callback){
	collection.updateOne(data[0],data[1],function(err,result){
		if(err){
			console.log("修改数据失败");
			console.log(err);
		}else{
			callback(result);//通过回调  传出  操作后的结果
		}
		client.close();//关闭客户端
	})
}

//删除
// 传递参数
// 第一个参数   client  操作的客户端   ==> 关闭客户端
// 第二个参数   collection 操作的集合  ==> 执行具体的操作数据的方法
// 第三个参数    data    操作的数据   ==> 具体的操作数据
// 第四个参数    callback  操作成功后的回调   ==> 操作成功后的回调
var deletes=function(client,collection,data,callback){
	collection.deleteOne(data,function(err,result){
		if(err){
			console.log("删除数据失败");
			console.log(err);
		}else{
			callback(result);//通过回调  传出  操作后的结果
		}
		client.close();//关闭客户端
	})
}

// 保存具体操作方法的对象
var methodType={
	insert:insert,//添加
	find:find,//查找
	update:update,//修改  三个  前两个  条件  内容 ==> data ==> [{条件},{内容}]
	delete:deletes//删除   delect 关键字 不能使用它来声明变量
}

var mongodb=require('mongodb');
var MongoClient=mongodb.MongoClient;// 创建客户端   返回一个客户端
	//操作数据库   一般 操作 一个数据库
var urls="mongodb://127.0.0.1:27017";// mongodb服务：  //mongodb的id地址：端口号
	//保存操作数据库的名称          
	//大写的命名方式  ==> 常量  一般情况下不会  改变的变量
var DBNAME="fchtdata";

//操作数据库的主要的方法
// 第一个参数  type 操作的方法的类型
// 第二个参数   collection	操作的集合
// 第三个参数   data 操作的数据
// 第四个参数   callback 操作成功后的回调   ==> 传出  操作后的结果传出
module.exports=function(type,collections,data,callback){
	MongoClient.connect(urls,function(err,client){
		if(err){
			console.log("链接失败");
			console.log(err);
		}else{
			console.log("链接成功");
			var db=client.db(DBNAME);//操作的数据库
			var collection=db.collection(collections);//操作的集合
			// 编写具体的操作方法  
			// 调取具体的操作方法
			// 取到了操作的函数  ==> 函数要执行 ()
			// 传递参数
			// 第一个参数   client  操作的客户端
			// 第二个参数   collection 操作的集合
			// 第三个参数    data    操作的数据
			// 第四个参数    callback  操作成功后的回调
			methodType[type](client,collection,data,callback);
			
		}
	});
}

