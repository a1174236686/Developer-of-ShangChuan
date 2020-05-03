// pages/login/login.js
const app = getApp()
const serverUrl = app.globalData.serverUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      
  },

  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的信息如下：");
        console.log(e.detail);
        wx.setStorageSync('userInfo',e.detail.userInfo)
        // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
             //wx.setStorageSync('tokenInfo',{}); //预览打开
            //wx.navigateBack({}); //预览打开
            wx.setStorageSync('temporaryCode',res.code);
            wx.request({
              url: app.globalData.serverUrl + '/wx/login',
              method: 'POST',
              data: {
                code: res.code,
                rawData: e.detail.rawData,
                signature: e.detail.signature,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
              },
              success (data) {
                wx.setStorageSync('tokenInfo',data.data);
                wx.request({
                  url: app.globalData.serverUrl + '/wxuser/session',
                  header: {"token": data.data.token},
                  method: 'GET',
                  success (sessionInfo) {
                    if(sessionInfo.data.code == 0){
                      wx.setStorageSync('sessionInfo',sessionInfo.data.wxUser);
                      //wx.reLaunch({url:"/pages/my/my"}) //关闭所有页面 打开行页面
                      wx.navigateBack({}); // 关闭当前页面，返回上一页面或多级页面
                    }
                  }
                })
              }
            })
          }
        })
        //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
    } else {
        //用户按了拒绝按钮
        wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
            showCancel: false,
            confirmText: '返回授权',
            success: function(res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                if (res.confirm) {
                    console.log('用户点击了“返回授权”');
                }
            }
        });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})