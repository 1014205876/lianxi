/*routes/index.js  路由文件  写逻辑的位置*/

var express = require('express');
var router = express.Router();
// 加载操作mongodb 数据库模块(封装好的)
var handler = require("./db.js");
//加密的模块
var crypto = require("crypto");
//怎么用？？
// 生成一个加密的算法   crypto.createHash('md5')
// 设置加密后的格式        .update(加密的内容  字符串格式的).digest("base64")

var ObjectID = require("mongodb").ObjectID;
//怎么用？
// new ObjectID(_id字符串)

var formidable=require("formidable");

/*--------------------------封装函数----------------------------------------------------*/
//处理管理员的tokenId 的递归函数
//req,res 请求和响应
//collection  处理的集合
//data 处理的数据  数组   length
//function(){if(条件){结束调研}else{继续调用}}
var resUpdate = function(req, res, collection, data) {
	if(data.length == 0) { //数据处理完成
		res.send({
			success: "删除成功"
		})
	} else { //继续处理   tokenId -1
		//数据  shift()  删除数组中的第一项
		var selector = [{ //条件
			userName: data[0].userName
		}, { //内容
			$set: {
				tokenId: data[0].tokenId - 1
			}
		}];
		handler("update", collection, selector, function(result) {
			if(result.result.n == 1) {
				data.shift(); //删除掉处理的第一条数据
				resUpdate(req, res, collection, data);
			} else {
				res.send({
					err: "修改失败"
				})
			}
		})
	}
};
// 构造函数  用来生成对象的{}
// 构造函数的名称  第一个首字母大写
// 生成个人信息的构造函数    怎么用  new User() ==> 对象
//{id:数据库的_id,userName:"",password:"",veri:""}
function User(user) {
	// _id  _ 在 js用特殊的意义   下划线声明的变量  私有的变量
	// _this 保存this指向
	this.id = user.id; //数据库的_id
	this.userName = user.userName; //用户名
	this.password = user.password; //密码
	this.veri = user.veri;
}

/*-------------------------------------路由-----------------------------------------*/

/*----------- 视频上传 -------------*/
// 上传文件的路由
router.post("/UpLoadVideoHandler",function(req,res){
	// 使用 formidable
	//1.生成一个处理form 表单的对象
	//2.配置参数
	//3.使用form 对象  解析 请求 req
	
	var form=formidable.IncomingForm();
	form.encoding="utf-8";//表单的编码格式
	form.maxFields=100;//表单的最大字段
	form.maxFieldsSize=100*1024*1024;//100兆文件大小
	//文件保存的地址(文件夹)  默认的 bin 同级的文件夹
	form.uploadDir="tmp/";//文件夹要提前创建好
	// 文件是否保存后缀名   .html   .js   .jpg
	form.keepExtensions=true;//保存文件 后缀名
	//解析请求的
	// 第一参数    请求   req
	// 第二参数    回调   参数  ==> err 失败的原因
	//               ==> fields 表单的字段
	//               ==> fiels 表单的文件
	form.parse(req,function(err,fields,fiels){
		if(err){
			res.send({err:err});
		}else{//成功
			console.log("字段");
			console.log(fields);
			console.log("文件");
			console.log(fiels.data.path);
			res.send({success:"成功",cacheName:fiels.data.path});
			
		}
	});
	
})



/*-------------登录-------------*/
router.get("/AdminLoginAndRegHandler", function(req, res) {
	switch(req.query.action) {
		case "verification": //获取验证码
			//1.生成随机验证码()
			//2.把生成的验证码  保存在session上
			//3.给浏览器发送生成的验证码

			var str = "qwertyuiopasdfghjklzxcvbnm1234567890"; //生成字符串的材料
			//str[随机数]   正整数    范围里产生的正整数
			//在一个范围内生成随机正整数的方法
			var randomNum = function(min, max) {
				var num = Math.floor(Math.random() * (max - min) + min);
				//想办法  限定在范围内   变成正整数
				//var num1=num*(max-min)+min;//在范围内
				//向下取整
				//				var num2=Math.floor(num1);
				return num;
			}

			var veri = ""; //4个字符的
			for(var i = 0; i < 4; i++) {
				veri += str[randomNum(0, str.length)]
			}

			req.session.user = new User({ //生成保存个人信息的对象
				id: "", //数据库_id
				userName: "", //用户名
				password: "", //密码
				veri: veri, //验证码
			});

			//在session上保存验证码
			res.send({
				success: "获取验证码成功",
				data: veri
			});
			break;

		case "checkVerification": //校验验证码
			//校验验证码
			//1.获取浏览器发送的验证码
			//	获取session储存的验证码
			//2.判断是否一致
			var bVeri = req.query.veri; //浏览器发送的验证码
			var sVeri = req.session.user.veri; //session中验证码
			if(bVeri == sVeri) { //是否一致
				res.send({
					success: "验证验证码成功"
				});
			} else {
				res.send({
					err: "验证验证码失败"
				})
			}

			break;
		default:
			res.send({
				err: "请求的地址不正确"
			})
	}
})

/*-------------管理员权限-------------*/

// 确定请求方式 和 请求地址
router.get("/CourseHandler", function(req, res) {

	switch(req.query.action) {
		case "getpower":
			// 获取管理员权限的逻辑
			// 怎么获取数据库中  管理权限的数据 ==> 录入 管理员权限
			// 操作数据库的主要的方法
			// 第一参数    type  操作的方法的类型    ==> find查找
			// 第二参数    collections  操作的集合  ==》powers 数据结构文档中找
			// 第三参数    data     操作的数据  ==》   {}
			// 第四参数    callback  操作成功后的回调   ==》 传出  操作后结果
			handler("find", "powers", {}, function(result) {
				// 有没有数据    length
				if(result.length > 0) { // 有数据 ==》成功
					res.send({
						success: "成功",
						data: result // 权限数据
					})

				} else { // 没有数据 ==》 发送失败
					res.send({
						err: "没有权限数据，请求联系管理员录入！！"
					})
				}
			})
			break;
		default: // 其他
			res.send({
				err: "请求的路径不正确！！"
			})
	}

})

/*------------- 登录请求 添加管理员 -------------*/
router.post("/AdminLoginAndRegHandler", function(req, res) {

	switch(req.query.action) {
		case "returnuserinfo": //请求个人信息
			//查询的条件： session (验证码，id,用户名，密码)
			//session中保存的用户名
			var id = req.session.user.id;
			//id ==> string
			//数据库_id = new ObjectID() ==> object

			handler("find", "administors", {
				_id: new ObjectID(id)
			}, function(result) {
				if(result.length > 0) { //有数据
					res.send({
						success: "查询成功",
						data: {
							turename: result[0].turename,
							tokenId: result[0].tokenId,

						}
					})
				} else { //没有数据
					res.send({
						err: "查询个人信息失败"
					})
				}
			})
			break;

		case "login":
			//1.获取用户名和密码(加密处理)
			//2.在 数据库 中查询
			//3.发送查询后的结果
			//     1)成功   有数据 ==> 允许TA登录
			//           把信息存在session上  ==> 发送成功
			//     2)失败   没有数据  ==> 不允许TA登录
			//           发送失败的原因 ==> 用户名或密码不正确，请重新输入

			var userName = req.body.userName;
			var password = crypto.createHash("md5").update(req.body.password).digest("base64");

			handler("find", "administors", {
				userName: userName,
				password: password
			}, function(result) {
				if(result.length > 0) { //有数据
					// 存储在session 上
					req.session.user.id = result[0]._id;
					req.session.user.userName = result[0].userName;
					req.session.user.password = result[0].password;
					res.send({
						success: "登录成功"
					})
				} else { //没有数据
					res.send({
						err: "登录失败，用户名或密码不正确"
					})
				}
			})
			break;

		case "add": // 添加管理员
			// 判断下    用户名是否存在   （保证用户名的唯一性）
			// 小明    添加    admin
			// 小华   在 添加  admin
			// 1. 查找  在 小华添加 时   ==》 查找  admin
			//            1) 有     ==》  不让添加    ==》 用户名已存在 
			//            2) 没有  ==》  可以添加 ==》正常添加的逻辑

			handler("find", "administors", {
					userName: req.body.userName
				},
				function(re) { // 形参
					if(re.length > 0) { // 有数据
						res.send({
							err: "用户名已存在，请重新输入！！！"
						})
					} else { // 没有数据
						// 正常的添加逻辑
						// 添加管理员的逻辑
						// 写一个 userInfor 对象  保存 添加信息
						//       key           :         value
						// 数据结构文档中数据库定义的字段  ： 浏览器发送来的（接口文档）
						// 有些必要的验证
						// 在写入数据库
						// 发送响应 结果

						// 查询所有的数据   给添加的tokenId做准备
						handler("find", "administors", {}, function(data) {
							var userInfor = {
								tokenId: data.length + 1, // length +1  
								//  1  2 3 4  5 6 7 8 9 10   ==》数组的 脚标 index  length
								// 0  1 2 3 4 5 6
								//  数据           length        tokenId (下一条)
								//  0 []          0 
								//  ["x"]         1           1
								//  ['x','x']     2           2
								//  [x,x,x]       3           3
								createAt: new Date(), // 创建的日期
								// false  不允许删除      true允许删除
								isdelete: /^fcgl/.test(req.body.turename) ? false : true,
								// 123456 加密 乱码
								password: crypto.createHash("md5").update(req.body.password).digest("base64"),
								phone: /^1\d{10}/.test(req.body.phone) ? req.body.phone : false,
								power: req.body.powerCode == 1 ? "系统管理员" : "课程管理员",
								powerCode: req.body.powerCode,
								success: "成功",
								turename: req.body.turename == "" ? false : req.body.turename,
								upDateAt: new Date(), // 修改的日期
								userName: req.body.userName == "" ? false : req.body.userName
							};
							// 判断false     &&   ||
							if(userInfor.phone != false && userInfor.userName != false && userInfor.turename != false) {
								// 格式正确
								// 操作数据库 进行添加
								handler("insert", "administors", userInfor, function(result) {
									// 判断  result.result.n ==1
									if(result.result.n == 1) {
										res.send({
											success: "添加成功"
										})
									} else {
										res.send({
											err: "添加失败"
										})
									}
								})
							} else {
								// 格式错误
								res.send({
									err: "参数格式不正确，请重新填写！！"
								})
							}

						})

					}
				})
			break;

		default: // 其他
			res.send({
				err: "请求的路径不正确！！"
			})
	}

})

/*--------查询、删除管理员数据---------*/
router.get("/AdminHandler", function(req, res) {
	switch(req.query.action) {
		// 退出
		case "quit":
		// 登录  在session 具体的赋值
		// 退出  清空session上的值
		if(req.session.user){
			req.session.user={};
		}
		res.send({success:"退出成功"});
		
		break;
		
		// 冻结 解冻
		case "lockuser": 
			//		1. 要改变现在的状态，得知道现在的状态    ==》 查询  
			//		2. 知道了现在的状态后，设置修改的条件和修改内容==》去修改   
			//   		修改的内容==》 查询到的状态取反 
			//   		修改的内容==》 查询到的状态取反 
			handler('find', 'studentList', {
				tokenId: parseInt(req.query.tokenId)
			}, function(result) {
				if(result.length > 0) { // 有数据

					var selector = [{ //   false    !false==>true
							//   true     !true==false
							tokenId: parseInt(req.query.tokenId)
						},
						{
							$set: {
								isstate: !result[0].isstate
							}
						} // 状态取反
					]
					// 修改
					handler('update', 'studentList', selector, function(re) {
						if(re.result.n == 1) {
							res.send({
								success: '操作成功'
							})
						} else {
							res.send({
								err: '操作失败'
							})
						}
					})
				} else { // 没有数据
					res.send({
						err: '操作失败'
					})
				}
			})

			break;
		case "show": // 显示管理员数据的请求
			// 编写请求的处理逻辑
			// 1. 查询所有的 数据  ==》 返回数据中 count 做数据的准备
			// 2. 设置 查询 条件 查询数据   ==》 姓名     页数
			// 3. 给浏览器 返回响应
			handler("find", "administors", {}, function(data) { //形参
				// 模糊姓名的      {key:{符号：值}}
				// 正则表达式符号    $regex==> 正则表达式
				//                $options :"i"   不区分大小写  
				//			var selector={turename:{
				//				$regex:".*"+req.query.searchText+".*",
				//				$options:"i"// 不区分大小写
				//			}}
				// 按页码的查询     不重  不漏 
				//   1 2 3 4 5 6 7 8 9  ==》 tokenId  9 -         (1   *  3-3)
				// 页数       每页条数3       取到的数据    与总共条数 和 页数   每一页条数
				//  1       3         9 8 7    9-(1*3-3)=9  >=  [9 8 7]    >  9-(1*3-3)-3=6 
				//  2       3         6 5 4    9-(2*3-3)=6  >=             > 9-(2*3-3)-3    
				//  3       3         3 2 1    9-(3*3-3)=3                 9-(3*3-3)-3=0

				//    总共的条数-(页码*每页的条数-每页的条数) >=   $lte
				//    $gt >总共的条数-(页码*每页的条数-每页的条数)-每页的条数

				//{
				//tokenId:{
				//		$lte:总共的条数-(页码*每页的条数-每页的条数),
				//		$gt: 总共的条数 - (页码*每页的条数-每页的条数)-每页的条数
				//		}
				//}
				//			var selector = {
				//				tokenId: {
				//					$lte: data.length - (req.query.pageStart * 3 - 3),
				//					$gt: data.length - (req.query.pageStart * 3 - 3) - 3
				//				}
				//			}

				//  综合的条件     已姓名为主    页码为辅
				if(req.query.searchText == "") { // 页码
					var selector = {
						tokenId: {
							$lte: data.length - (req.query.pageStart * 3 - 3),
							$gt: data.length - (req.query.pageStart * 3 - 3) - 3
						}
					}
				} else { // 姓名
					var selector = {
						turename: {
							$regex: ".*" + req.query.searchText + ".*",
							$options: "i" // 不区分大小写
						}
					}
				}

				// 查询数据库
				handler("find", "administors", selector, function(result) {
					if(result.length > 0) { // 有数据
						res.send({
							success: "查询成功",
							data: {
								pageStart: req.query.pageStart, // 请求的页数
								pageSize: "3", // 每一页的条数
								count: data.length, // 一共有多少条
								list: result // 查询到的数据
							}
						})
					} else { // 没有数据
						res.send({
							err: "没有查询到数据"
						})
					}
				})
			})
			break;
		case "delete": // 删除管理员的请求
			// 1. 正常的删除
			// 2. 找到大于删除tokenid的数据  ==》[]
			// 3. 使用递归函数去处理
			// 浏览器发送到后台的  都是字符串类型  string
			// 数据库中  tokenId 数字类型   number 
			//		console.log(typeof req.query.tokenId) // 字符串类型 string 
			// parseInt()                                             
			handler("delete", "administors", {
				tokenId: parseInt(req.query.tokenId),
				isdelete: true // 不是已 fcgl开头姓名的 允许删除  true
			}, function(result) {
				if(result.result.n == 1) { // 删除了
					// 查找大于删除的tokenId的数据
					handler("find", "administors", {
						tokenId: {
							$gt: parseInt(req.query.tokenId)
						}
					}, function(data) {
						// 使用递归函数去处理 
						// req， res  ==》处理之后  发送响应
						// 处理的集合   administors
						// 处理的数据 data
						resUpdate(req, res, "administors", data);
					})
				} else { // 没操作数据   删除失败了
					res.send({
						err: "删除失败"
					})
				}
			})
			break;
		default: // 其他
			res.send({
				err: "请求的路径不正确！！"
			})
	}

})

/*-------------修改管理员  添加、查询学员-------------*/
router.post("/AdminHandler", function(req, res) {
	switch(req.query.action) {
		//修改密码
		case "updatepass":
			// 1.获取 旧密码  新密码  session中的密码
			// 2.判断 旧密码和session中的密码是否一致
			//      不一致: 旧密码不正确，请重新输入
			//       一致 : 修改   ==> session中的密码 换位修改后的新密码
			// 3.
			var oldPw = crypto.createHash("md5").update(req.body.userPwd).digest("base64");
			var newPw = crypto.createHash("md5").update(req.body.newPwd).digest("base64");
			var ssPw = req.session.user.password; //加密的
			//判断 浏览器发送的旧密码  和  session 中的密码是否一致
			if(oldPw == ssPw) {
				var selector = [{ //修改条件
					_id: new ObjectID(req.session.user.id)
				}, {
					$set: { //内容
						password: newPw
					}
				}];
				handler("update", "administors", selector, function(result) {
					if(result.result.n == 1) {
						//把session中的密码  换成修改后的新密码
						req.session.user.password = newPw;
						res.send({
							success: "修改密码成功"
						})
					} else {
						res.send({
							err: "修改失败"
						})
					}
				})
			} else {
				res.send({
					err: "旧密码不正确"
				})
			}

			break;

			//修改管理员的请求
		case "update":
			// 修改  ==> [{条件},{内容}]
			var selector = [{
				tokenId: parseInt(req.body.tokenId)
			}, {
				$set: {
					turename: req.body.turename, //姓名
					phone: req.body.phone, //手机号
					powerCode: req.body.powerCode, //权限编码
					power: req.body.powerCode == 1 ? "系统管理员" : "课程管理员",
					upDateAt: new Date(), // 修改的日期
					isdelete: /^fcgl/.test(req.body.turename) ? false : true,
				}
			}];
			// 通过 handler 操作数据库的函数  ==> 操作数据库
			handler("update", "administors", selector, function(result) {
				if(result.result.n == 1) {
					res.send({
						seccess: "修改成功"
					})
				} else {
					res.send({
						err: "修改失败"
					})
				}
			});
			break;

			//添加学员
		case "adduser":
			//获取学员列表的数据总数
			handler('find', "studentList", null, function(data) {
				//组织学员信息并作一些校验
				var userInfos = {};
				//  数据库中的值             浏览器中的值
				userInfos.tokenId = data.length + 1;
				userInfos.createAt = new Date();
				userInfos.email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(req.body.addemail) ? req.body.addemail : false;
				userInfos.isstate = false; // 正常
				userInfos.phone = /^1\d{10}$/.test(parseInt(req.body.addphone)) ? req.body.addphone : false;
				userInfos.success = "成功";
				userInfos.upDateAt = new Date();
				userInfos.userName = req.body.adduserName == "" ? false : req.body.adduserName;
				// 判断
				if(userInfos.phone != false && userInfos.userName != false && userInfos.email != false) {
					//增加操作
					handler("insert", "studentList", userInfos, function(result) {
						if(result.result.n == 0) {
							res.send({
								"err": "抱歉，添加失败"
							});
						} else {
							res.send({
								"success": "添加成功"
							});
						}
					});
				} else {
					res.send({
						"err": "抱歉，数据格式有误，添加失败"
					});
				}
			});

			break; // 跳出

			// 请求学员数据
		case "usershow": // 请求学员数据
			// 1. 查询所有 学员数据   count 分页
			// 2. 设置条件
			// 3. 查询数据库
			// 4. 发送结果
			handler('find', "studentList", null, function(data) {
				var seletor = {}; // 储存查询条件

				if(req.body.userName != "" || req.body.email != "" || req.body.phone != "") {
					//设置模糊查询的条件
					if(req.body.userName) { // userName 不等空
						seletor.userName = {
							$regex: ".*" + req.body.userName + ".*",
							$options: "i"
						}
					}
					if(req.body.email) { // email 不等空
						seletor.email = {
							$regex: ".*" + req.body.email + ".*",
							$options: "i"
						}
					}
					if(req.body.phone) { // phone 不等空
						seletor.phone = {
							$regex: ".*" + req.body.phone + ".*",
							$options: "i"
						}
					}
				} else {
					// 设置页数查询的条件
					seletor = {
						tokenId: {
							$lte: data.length - (parseInt(req.body.pageStart) * 3 - 3),
							$gt: data.length - (parseInt(req.body.pageStart) * 3 - 3) - 3
						}
					}
				};
				// 按条件查询数据
				handler('find', "studentList", seletor, function(result) {
					// 发送结果
					if(result.length > 0) { // 有数据
						res.send({
							success: "成功",
							data: {
								pageStart: req.body.pageStart,
								pageSize: 3,
								count: data.length,
								list: result
							}
						})
					} else { // 没有数据
						res.send({
							err: "没有查询到数据"
						})
					}
				})

			})
			break;
		default: // 其他
			res.send({
				err: "请求的路径不正确"
			})
	}
})

module.exports = router;

/* GET home page. */
// 请求方式		请求地址		发送的数据
//   get		 /get		 字段userName
// 地址上			/get?userName=小明
// 1.启动服务器
// 2.访问 localhost:3000/get?userNmae=小明

/*router.get('/get', function(req, res, next) {
//res.render('index', { title: 'Express' });
	res.send(req.query);
	
});*/

//  请求方式		 请求地址		发送的数据
//   post		 /post		 字段userName
/*router.post("/post",function(req,res){
	res.send(req.body)//post方式数据的获取
})*/