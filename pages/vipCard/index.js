//index.js
//获取应用实例
const app = getApp()
const serverUrl = app.globalData.serverUrl
import {http} from '../../utils/util';
Page({
  data: {
    number:'000002',
    grade:'1',
    serverUrl: serverUrl,
    vipData: {}
  },
 
  onLoad: function () {
  },

  onShow: async function() {
    let data = await http.get('/wxuser/vip');
    this.setData({vipData: data.data});
  },

  gotoRecharge: function() {
    wx.navigateTo({
      url: '../recharge/index',
    })
  }

})
