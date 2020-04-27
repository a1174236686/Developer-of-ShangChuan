//index.js
//获取应用实例
const app = getApp()
const serverUrl = app.globalData.serverUrl
Page({
  data: {
    userInfo: {},
    serverUrl: serverUrl,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tabList: [{label: '精选'},{label: '美食'},{label: '人物'},{label: '风景'}],
    showTabActive: 0,
  },
  switchTab: function(e){
    this.setData({showTabActive: e.currentTarget.dataset['index']})
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

  },
})
