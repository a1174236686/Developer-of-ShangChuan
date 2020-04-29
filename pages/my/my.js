// pages/my/my.js
const app = getApp()
const serverUrl = app.globalData.serverUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    isHaveNum: true,
    phoneNum: '',
    wxUser: null,
    tokenInfo: null,
    optionsList:[
      {label: '我的预约',id: 'myOrder/myOrder',src: serverUrl + '/statics/image/yuyue.png'},
      {label: '我的会员卡',id: 'vipCard/index',src: serverUrl + '/statics/image/vip.png'},
      {label: '邀请有奖',id: 'works',src: serverUrl + '/statics/image/jiangli.png'},
      {label: '加入我们',id: 'joinWe/index',src: serverUrl + '/statics/image/joinWe.png'}
    ]
  },

  gotoView: function(e){
    if(this.isLogin()){
      wx.navigateTo({
        url: '/pages/' + e.currentTarget.dataset.view　// 页面 B
      })
    }
  },

  gotoMyData(){
    if(this.isLogin()){
      wx.navigateTo({
        url: '../myInfor/myInfor'
      })
    }
  },

  isLogin(){
    if(wx.getStorageSync('tokenInfo') && wx.getStorageSync('userInfo')){
      return true
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
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
    // if(wx.getStorageSync('userInfo') && wx.getStorageSync('tokenInfo') && wx.getStorageSync('tokenInfo').bindFlag === 0){
    //   this.setData({isHaveNum: false});
    // }
    // if(wx.getStorageSync('userInfo') && wx.getStorageSync('tokenInfo') && wx.getStorageSync('tokenInfo').bindFlag && wx.getStorageSync('sessionInfo')){
    //   this.setData({isHaveNum: true,phoneNum: wx.getStorageSync('sessionInfo').phone});
    // }
    if(wx.getStorageSync('sessionInfo')){
      console.log(wx.getStorageSync('sessionInfo'))
      this.setData({wxUser: wx.getStorageSync('sessionInfo'),tokenInfo: wx.getStorageSync('tokenInfo').bindFlag})
    }
  },

  getPhoneNumber:function(e){
    if(e.detail){
      wx.login({
        success: (res) => {
          wx.request({
            url: app.globalData.serverUrl + '/wxuser/bindPhone',
            method: 'POST',
            header: {"token": wx.getStorageSync('tokenInfo').token},
            data: {
              code: res.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
            },
            success (data) {
              wx.request({
                url: app.globalData.serverUrl + '/wxuser/session',
                header: {"token": data.data.token},
                method: 'GET',
                success (sessionInfo) {
                  wx.setStorageSync('sessionInfo',sessionInfo.data.wxUser);
                }
              })
            }
          })
        },
      })
    }
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