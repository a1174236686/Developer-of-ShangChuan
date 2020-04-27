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
        wx.getUserInfo({
          complete: (info_res) => {
            wx.request({
              url: this.globalData.serverUrl + '/wx/login',
              method: 'POST',
              data: {
                code: res.code,
                rawData: info_res.rawData,
                signature: info_res.signature,
                encryptedData: info_res.encryptedData,
                iv: info_res.iv,
              },
              success (data) {
                console.log(data.data)
              }
            })
          },
        })
      }
    })
    //获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    serverUrl: 'http://106.12.205.91:9000/sheying',
    //serverUrl: 'http://294k6r6236.qicp.vip:25802/sheying',
    userInfo: null
  }
})