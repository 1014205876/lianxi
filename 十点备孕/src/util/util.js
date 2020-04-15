'use strict'

// 是否为空对象
function isEmptyObject(e) {
  let t
  for (t in e) {
    return !1
  }    
  return !0
}
function isEmpty(obj) {
    // 检验 undefined 和 null
    if(!obj && obj !== 0 && obj !== '') {　　　　　　　　　　
      return true
    }
    if(Array.prototype.isPrototypeOf(obj) && obj.length === 0) { 
  　　　　return true　　
    }
    if(Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {　　　　
      return true　　
    } 
    return false
}
function getCurrentTime() {
  var keep = '';
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var f = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  var rand = Math.round(Math.random() * 899 + 100);
  keep = y + '' + m + '' + d + '' + h + '' + f + '' + s;
  return keep; //20160614134947
}
// 时间戳
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 检测授权状态
function checkSettingStatu() {
  let that = this
  // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
  wx.getSetting({
    success: function success(res) {
      console.log(res.authSetting)
      var authSetting = res.authSetting
      if (isEmptyObject(authSetting)) {
        console.log('首次授权')
      } else {
        // console.log('不是第一次授权', authSetting)
        // 没有授权的提醒
        if (authSetting['scope.userInfo'] === false) {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常使用该功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: function success(res) {
                    var userInfo = res.userInfo
                    wepy.setStorageSync('userInfo', userInfo)
                  }
                })
              }
            }
          })
        }
      }
    }
  })
}

//  左滑
function isLeftSlide(e) {
  const { startX, startY } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[ 0 ];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;
    if (deltaX < -60 && deltaY < 20 && deltaY > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}

// 右滑
function isRightSlide(e) {
  const { startX, startY } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[ 0 ];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;

    if (deltaX > 60 && deltaY < 20 && deltaY > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}

function groupArray(data, cols) {
  const list = [];
  let current = [];

  // for (t of data) {
  data.forEach(t => {
      current.push(t);
      if (current.length === cols) {
          list.push(current);
          current = [];
      }
  });
  // }    // for (t of data)

  if (current.length) {
      list.push(current);
  }
  return list;
}

// 验证手机号码
function isPhone(str) {
  var reg = /^1[34578]{1}\d{9}$/
  return reg.test(str)
}

function formatNum(num) {
  var reg = /^\d*\.\d+$/
  if (typeof num !== 'number') {
    return false
  }
  if (reg.test(num.toString())) {
    return num.toFixed(2)
  } else {
    return num
  }
}
module.exports = {
  checkSettingStatu : checkSettingStatu,
  getCurrentTime : getCurrentTime,
  formatTime : formatTime,
  isLeftSlide : isLeftSlide,
  isRightSlide : isRightSlide,
  groupArray : groupArray,
  isPhone: isPhone,
  formatNum: formatNum,
  isEmpty: isEmpty
}
