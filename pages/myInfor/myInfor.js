// pages/myInfor/myInfor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList: [
      {icon: '',name: '姓名', value: '张三', type: 'name'},
      {icon: '',name: '性别', value: '李四', type: 'sex'},
      {icon: '',name: '出生日期', value: '王五', type: 'date'},
      {icon: '',name: '电话', value: '六六', type: 'phone'},
      {icon: '',name: '区域', value: '戚戚', type: 'region'}],
      noEdit: true,
  },

  formSubmit: function (e) {
    wx.showNavigationBarLoading();
    let vm = this;
    setTimeout(function(){
      vm.setData({noEdit: !vm.data.noEdit})
      wx.hideNavigationBarLoading() //完成停止加载
    },2000)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  switchBtn: function(){
    this.setData({noEdit: !this.data.noEdit})
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