//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
       // 查看是否授权
    //    wx.getSetting({
    //     success: function(res) {
    //         if (res.authSetting['scope.userInfo']) {
    //             wx.getUserInfo({
    //                 success: function(res_Info) {
    //                   // 登录
    //                   wx.login({
    //                     success: res => {
    //                       // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //                       wx.setStorageSync('temporaryCode',res.code);
    //                       wx.request({
    //                         url: that.globalData.serverUrl + '/wx/login',
    //                         method: 'POST',
    //                         data: {
    //                           code: res.code,
    //                           rawData: res_Info.rawData,
    //                           signature: res_Info.signature,
    //                           encryptedData: res_Info.encryptedData,
    //                           iv: res_Info.iv,
    //                         },
    //                         success (data) {
    //                           wx.setStorageSync('tokenInfo',data.data);
    //                           wx.request({
    //                             url: that.globalData.serverUrl + '/wxuser/session',
    //                             header: {"token": data.data.token},
    //                             method: 'GET',
    //                             success (sessionInfo) {
    //                               wx.setStorageSync('sessionInfo',sessionInfo.data.wxUser);
    //                             }
    //                           })
    //                         }
    //                       })
    //                     }
    //                   })
    //                 }
    //             });
    //         } 
    //     }
    // });
  },
  globalData: {
    serverUrl: 'http://106.12.205.91:9000/sheying',
    //serverUrl: 'http://294k6r6236.qicp.vip:25802/sheying',
  }
})