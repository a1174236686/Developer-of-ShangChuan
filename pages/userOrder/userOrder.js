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
    if(type == this.data.currentType){
      return false
    }
    this.setData({currentType: type,page: 1,orderList: []},() =>{
      this.getData(type);
    })
  },

  cancelOrider:function(e) {
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否取消预约？',
      showCancel: true,
      confirmText: '确定取消',
      cancelText: '点错了',
      success: function(res) {
        wx.showNavigationBarLoading();//在标题栏中显示加载
        wx.request({
          url: app.globalData.serverUrl + '/order/cancel',
          header: {"token": wx.getStorageSync('tokenInfo').token},
          method: 'POST',
          data: {
            orderId: item.orderId,
            cancelReason: '取消'
          },
          success (res) {
            wx.hideNavigationBarLoading() //完成停止加载
            if(res.data.code == 0){
              console.log('取消成功！')
              let arr = that.data.orderList;
              arr = arr.splice(1,index);
              that.setData({orderList: arr});
            }
          }
        })
      }
    });
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
    this.getData();
  },

  getData(type=null){
    let that = this;
    type = type || this.data.currentType
    wx.showNavigationBarLoading();//在标题栏中显示加载
    wx.request({
      url: app.globalData.serverUrl + '/order/customer/mine',
      header: {"token": wx.getStorageSync('tokenInfo').token},
      method: 'GET',
      data: {
        page: this.data.page,
        limit: 15,
        status: type
      },
      success (res) {
        wx.hideNavigationBarLoading() //完成停止加载
        if(res.data.code == 0){
          if(res.data.data.length){
            let arr = that.data.orderList;
            arr = arr.concat(res.data.data)
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
    this.setData({page: 1,orderList: []},() =>{
      this.getData();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({page: this.data.page + 1},() =>{
      this.getData();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})