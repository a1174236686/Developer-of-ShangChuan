// pages/myInfor/myInfor.js
const app = getApp()
const serverUrl = app.globalData.serverUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    infoList: [
      {icon: '',name: '姓名', value: '', type: 'name'},
      {icon: '',name: '性别', value: '', type: 'sex'},
      {icon: '',name: '出生日期', value: '', type: 'date'},
      {icon: '',name: '电话', value: '', type: 'phone'},
      {icon: '',name: '区域', value: [], type: 'region',quyu: true},
      {icon: '',name: '拍摄地点', value: '', type: 'address'},
      {icon: '',name: '拍摄对象', value: '', type: 'target'},
      {icon: '',name: '拍摄时间', value: '', type: 'time'}],
      noEdit: false,
      region: [],
      regionCode: []
  },

  formSubmit: function (e) {
    wx.showNavigationBarLoading();
    let vm = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let enterDate = wx.getStorageSync('enterTime');
    let that = this;
    let startTime = enterDate.start[0] + '-' + enterDate.start[1] + '-' + enterDate.start[2] + ' ' + enterDate.start[3] + ':00';
    let endTime = enterDate.end[0] + '-' + enterDate.end[1] + '-' + enterDate.end[2] + ' ' + enterDate.end[3] + ':00';
    let postData = {
      photographerCode: wx.getStorageSync('yuyueData').userCode,
      customerName: e.detail.value.name,
      sex: e.detail.value.sex,
      birthDate: e.detail.value.date,
      customerPhone: e.detail.value.phone,
      province: e.detail.value.name,
      city: this.data.regionCode[0],
      area: this.data.regionCode[1],
      address: this.data.regionCode[2],
      target: e.detail.value.target,
      appointStartTime: startTime,
      appointEndTime: endTime,
    };
    wx.request({
      url: app.globalData.serverUrl + '/order/save',
      header: {"token": wx.getStorageSync('tokenInfo').token},
      method: 'POST',
      data: postData,
      success (res) {
        if(res.data.code === 0){
          console.log(res.data)
          wx.hideNavigationBarLoading(); //完成停止加载
        }
      }
    })
  },

  switchBtn: function(){
    this.setData({noEdit: !this.data.noEdit})
  },

  bindRegionChange: function(e){
    console.log(e.detail)
    this.setData({region: e.detail.value,regionCode: e.detail.code})
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
    console.log()
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