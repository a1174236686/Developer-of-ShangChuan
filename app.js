//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    serverUrl: 'http://106.12.205.91:9000/sheying',
    //serverUrl: 'http://294k6r6236.qicp.vip:25802/sheying',
  }
})