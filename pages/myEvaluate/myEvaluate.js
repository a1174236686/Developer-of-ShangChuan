// pages/myEvaluate/myEvaluate.js
const app = getApp()
import {http,avatarUrlFn} from '../../utils/util'
const serverUrl = app.globalData.serverUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    suggestionList:[],
    photographerCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:  function (options) {
  },
  //获取评价数据
  async getSuggestion(){
    let res = await http.get("/evaluate/page?photographerCode=" + this.data.photographerCode);
    if(res.code==0){
      let arr = res.data
      for(let i = 0 ; i < arr.length ; i ++){
        let item = arr[i];
        item.customerPhoto = avatarUrlFn(item.customerPhoto);
        item.photographerPhoto = avatarUrlFn(item.photographerPhoto);
      }
      this.setData({suggestionList: arr})
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
    const sessionInfo = wx.getStorageSync('sessionInfo');
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('photographerCode', data => {
      const { photographerCode } = data;
      this.setData({ photographerCode })
      this.getSuggestion();
    })
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