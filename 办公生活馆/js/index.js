(function (window, $, undefined) {
    let index = 0;//定义初始下标
    let absoluteLi = document.querySelector('.woffice .banner>.left .absolute').children//获取到有hover事件的10个li
    let rightLi = document.querySelector('.woffice .banner>.right').children//获取到需要操作class名字的10个li
    for (let i = 0; i < absoluteLi.length; i++) {
        absoluteLi[i].onmouseover = function (e) {//给10个li标签赋予鼠标移入事件
            index=i;//获取到当前元素的下标
            for (let j = 0; j < absoluteLi.length; j++) {
                absoluteLi[j].classList.remove("active");//将所有li标签的class名去除(图片定位)
                rightLi[j].classList.remove("active");//将所有li标签的class名去除(右边显示)
            }
            absoluteLi[i].classList.add("active");//给对应下标的li加上class名字(图片定位)
            rightLi[i].classList.add("active");//给对应下标的li加上class名字(右边显示)
        }
    }
})(window, $)