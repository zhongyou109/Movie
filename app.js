//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    topFilms:[]
  },
  //截图两个字符串之间的字符串
  //res需要截取的字符串 str1 str2截取开始和结束 
  //arr结果数组 recursion 是否递归(是否多次截取)
  cutStr: function(res,str1,str2,arr,recursion){
    if(res.indexOf(str1)<0 || res.indexOf(str2)<0) return;
    var str1Length = str1.length;
    var i1 =res.indexOf(str1);
    var l1 = str1.length;
    var str = res.substr(i1+l1);
    var i2 = str.indexOf(str2);
    var resNext = str.substr(i2+1);
    str = str.substr(0,i2);
    arr.push(str);
    if(!recursion) return arr;
    else this.cutStr(resNext,str1,str2,arr,1);
  }
})