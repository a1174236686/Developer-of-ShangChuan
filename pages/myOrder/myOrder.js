// pages/myOrder/myOrder.js
const app = getApp()
const serverUrl = app.globalData.serverUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    tabList: [{name: '待接单',type: '1'},{name: '待拍摄',type: '2'},{name: '已拍摄',type: '3'},{name: '已完成',type: '4'}],//tab
    // waitOrderList: [],//待接单
    // waitShotList:[],//待拍摄
    // alreadyCompleteList: [],//已拍摄
    // alreadyShotList: [],//已完成
    orderList: [],
    currentType: '1',
    page: 1
  },

  switchTab:  function(e){
    let type = e.currentTarget.dataset.type;
    this.setData({currentType: type,page: 1},() =>{
      this.getData(type);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({orderList: this.data.waitOrderList})
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
    this.getData();
  },

  getData(type=null){
    let that = this;
    type = type || this.data.currentType
    wx.request({
      url: app.globalData.serverUrl + '/order/photographer/mine',
      header: {"token": wx.getStorageSync('tokenInfo').token},
      method: 'GET',
      data: {
        page: this.data.page,
        limit: 15,
        status: type
      },
      success (res) {
        if(res.data.code == 0){
          if(res.data.data.length){
            let arr = that.data.tabList;
            arr = arr.concat(res.data.data);
            that.setData({orderList: arr});
          }
        }
      }
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
    this.getData();
    wx.showNavigationBarLoading();//在标题栏中显示加载
    setTimeout(function(){
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading();//在标题栏中显示加载
    setTimeout(function(){
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})