// pages/personalInfo/personalInfo.js
const app = getApp();
const {	switchLevel } = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList:[],
    tarList: [{ name: '视频', type: 2 }, { name: '图片', type: 2 }],
    currentType: 1,
    dataList: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    count : 0,
  },

  switchBar: function (e) {
    this.setData({ currentType: e.currentTarget.dataset.type });
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
    // this.getVideoList();
    // const tokenInfo = wx.getStorageSync('tokenInfo')
    // wx.request({
    //   url: app.globalData.serverUrl + '/photographer/info/7838155c-90ec-44ed-99c3-0bde13cbf523',
    //   header: { 'token': tokenInfo.token },
    //   success: result => {
    //     this.machiningRes(result.data.biPhotographer);
    //     const biPhotographer = result.data.biPhotographer;
    //     console.log('biPhotographer',biPhotographer);
    //     // this.setData({ biPhotographer },()=>this.getVideoList())
    //     this.setData({ biPhotographer })
    //   }
    // })
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
    console.log('11111111')
    wx.showToast({
        title:'加载中....',
        icon:'loading'
    });
    setTimeout(() => {
      // 模拟请求数据，并渲染
      var arr = self.data.dataList, max = Math.max(...arr);
      for (var i = max + 1; i <= max + 3; ++i) {
        arr.unshift(i);
      }
      self.setData({ dataList: arr });
      // 数据成功后，停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('22222222222')
    // this.getVideoList();

    var arr = this.data.dataList, max = Math.max(...arr);
    if (this.data.count < 3) {
      for (var i = max + 1; i <= max + 5; ++i) {
        arr.push(i);
      }
      this.setData({
        dataList: arr,
        count: ++this.data.count
      });
    } else {
      wx.showToast({
        title: '没有更多数据了！',
        image: '../../src/images/noData.png',
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 加工一下后台数据
   */
  machiningRes: function (res) {
    res.level = switchLevel(res.level);
  },

  /**
   * 请求视频
   */
  getVideoList: function(){
    console.log('???????????????')
    const tokenInfo = this.getToken();
    const videoList = this.getVideoList();
    const {page, limit} = videoList;
    console.log('??????',page)
    if(page>5) return;
    wx.request({
      url: app.globalData.serverUrl + '/video/page',
      header: { 'token': tokenInfo.token },
      data:{
        page,
        limit,
        userCode:this.data.biPhotographer.userCode
      },
      success: result => {
        console.log(result)
        // const videoList = result.data.data;
        // videoList.concat(this.data.videoList)
        // this.setData({videoList},()=>videoList.page++)
        // wx.stopPullDownRefresh()
        // console.log('videoList',videoList);
      }
    })
  },

  getToken:function(){
    return wx.getStorageSync('tokenInfo')
  },

  getVideoPageinfo:function(){
    const VideoPageinfo={
      page:1,
      limit:5,
    }
    this.getVideoPageinfo=()=>VideoPageinfo;
    return VideoPageinfo;
  }
  
})