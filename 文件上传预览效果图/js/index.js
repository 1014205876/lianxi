//文件上传
//选择图片
function imgPreview(fileDom) {
	//判断是否支持FileReader
	if(window.FileReader) {
		var reader = new FileReader();
	} else {
		alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
	}

	//获取文件
	var ul1 = document.getElementById('imgbox');
	var file = fileDom.files[0];
	var imageType = /^image\//;
	//获取文件名
	var file1 = $("#fileimg").val();
	var strFileName = file1.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1"); //正则表达式获取文件名，不带后缀
	var FileExt = file1.replace(/.+\./, "");
	//是否是图片
	if(!imageType.test(file.type)) {
		alert("请选择图片类文件！");
		return;
	}
	//读取完成
	reader.onload = function(e) {
		//生成需要插入的元素
		var li1 = document.createElement('li');
		var i1 = document.createElement('i');
		var img1 = document.createElement('img');
		//图片路径设置为读取到的图片
		li1.title = strFileName +'.'+ FileExt;
		img1.src = e.target.result;
		i1.className += 'iconfont icon-shanchu';
		//将生成的元素插入他们的父级中
		ul1.appendChild(li1, ul1.firstElementChild);
		li1.insertBefore(i1, li1.firstElementChild);
		li1.insertBefore(img1, li1.firstElementChild);
		i1.onclick = function() {
			ul1.removeChild(li1);
		}
	};
	reader.readAsDataURL(file);
}
//选择视频
function mp4Preview(fileDom) {
	//判断是否支持FileReader
	if(window.FileReader) {
		var reader = new FileReader();
	} else {
		alert("您的设备不支持视频预览功能，如需该功能请升级您的设备！");
	}

	//获取文件
	var ul1 = document.getElementById('mp4box');
	var file = fileDom.files[0];
	var imageType = /^video\//;
	//获取文件名
	var file1 = $("#filemp4").val();
	var strFileName = file1.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1"); //正则表达式获取文件名，不带后缀
	var FileExt = file1.replace(/.+\./, "");
	//是否是图片
	if(!imageType.test(file.type)) {
		alert("请选择视频类文件！");
		return;
	}
	//读取完成
	reader.onload = function(e) {
		//生成需要插入的元素
		var li1 = document.createElement('li');
		var i1 = document.createElement('i');
		var video1 = document.createElement('video');
		//视频路径设置为读取到的视频
		li1.title = strFileName +'.'+ FileExt;
		video1.src = e.target.result;
		video1.controls = "controls";
		i1.className += 'iconfont icon-shanchu';
		//将生成的元素插入他们的父级中
		ul1.appendChild(li1, ul1.firstElementChild);
		li1.insertBefore(i1, li1.firstElementChild);
		li1.insertBefore(video1, li1.firstElementChild);
		i1.onclick = function() {
			ul1.removeChild(li1);
		}
	};
	reader.readAsDataURL(file);
}
//选择文档
function txtPreview(fileDom) {
	//判断是否支持FileReader
	if(window.FileReader) {
		var reader = new FileReader();
	} else {
		alert("您的设备不支持文件预览功能，如需该功能请升级您的设备！");
	}
	//获取文件
	var ul1 = document.getElementById('txtbox');
	var file = fileDom.files[0];
	var imageType = /^text\//;
	//获取文件名
	var file1 = $("#filetxt").val();
	var strFileName = file1.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1"); //正则表达式获取文件名，不带后缀
	var FileExt = file1.replace(/.+\./, "");
	//	获取文件大小
	var dom = document.getElementById('filetxt');
	var fileSize = dom.files[0].size; //文件的大小，单位为字节B
	//是否是图片
	if(!imageType.test(file.type)) {
		alert("请选择文档类文件！");
		return;
	}
	//读取完成
	reader.onload = function(e) {
		//生成需要插入的元素
		var li1 = document.createElement('li');
		var i1 = document.createElement('i');
		var left1 = document.createElement('div');
		var i2 = document.createElement('i');
		var right1 = document.createElement('div');
		var p1 = document.createElement('p');
		var span1 = document.createElement('span');
		//文件路径设置为读取到的文档
		li1.title = strFileName +'.'+ FileExt;
		i1.className += 'iconfont icon-shanchu';
		left1.className += 'left';
		i2.className += 'iconfont icon-ziyuanbaosongwenjian';
		right1.className += 'right';
		p1.innerHTML = strFileName +'.'+ FileExt;
		span1.innerHTML = fileSize + 'kb';
		//将生成的元素插入他们的父级中
		ul1.appendChild(li1, ul1.firstElementChild);
		li1.insertBefore(i1, li1.firstElementChild);
		li1.insertBefore(right1, li1.firstElementChild);
		right1.insertBefore(span1, right1.firstElementChild);
		right1.insertBefore(p1, right1.firstElementChild);
		li1.insertBefore(left1, li1.firstElementChild);
		left1.insertBefore(i2, left1.firstElementChild);
		i1.onclick = function() {
			ul1.removeChild(li1);
		}
	};
	reader.readAsDataURL(file);
}