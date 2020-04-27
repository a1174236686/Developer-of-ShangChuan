// pages/my/my.js
const app = getApp()
const serverUrl = app.globalData.serverUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    optionsList:[
      {label: '我的预约',id: 'myOrder/myOrder',src: serverUrl + '/statics/image/yuyue.png'},
      {label: '我的会员卡',id: 'vipCard/index',src: serverUrl + '/statics/image/vip.png'},
      {label: '邀请有奖',id: 'works',src: serverUrl + '/statics/image/jiangli.png'},
      {label: '加入我们',id: 'joinWe/index',src: serverUrl + '/statics/image/joinWe.png'}
    ]
  },

  gotoView: function(e){
    console.log('aaaa',wx.getStorageSync('tokenInfo'),wx.getStorageSync('userInfo'))
    if(wx.getStorageSync('tokenInfo') && wx.getStorageSync('userInfo')){
      wx.navigateTo({
        url: '/pages/' + e.currentTarget.dataset.view　// 页面 B
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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