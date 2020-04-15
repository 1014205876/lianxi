/**
 * [测试脚本]
 * @Author   zhanggongze
 * @DateTime 2017-12-12
 */
window.onload = function () {

    init();

    function init() {
        var oH = document.getElementById('h1');
        oH.onclick = function () {
            alert('我是脚本');
        }
    }
}
