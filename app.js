//app.js

App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  globalData: {
    //serverUrl: 'http://106.12.205.91:9000/sheying',
    serverUrl: 'https://sheying.youlintec.xin/sheying-test',
  }
})