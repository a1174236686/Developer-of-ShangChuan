// pages/myInfor/myInfor.js
const app = getApp()
const serverUrl = app.globalData.serverUrl;
import {switchJSON} from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    infoList: [
      {icon: '../../img/xingming.png',name: '姓名', value: '', type: 'name'},
      {icon: '../../img/nvx.png',name: '性别', value: '', type: 'sex',sex: true},
      {icon: '../../img/riqi.png',name: '出生日期', value: '', type: 'date',date: true},
      {icon: '../../img/shouji.png',name: '电话', value: '', type: 'phone',status: 'number'},
      {icon: '../../img/quyu.png',name: '区域', value: [], type: 'region',quyu: true},
      {icon: '../../img/map.png',name: '拍摄地点', value: '', type: 'address'},
      {icon: '../../img/paishe.png',name: '拍摄对象', value: '', type: 'target'},
      {icon: '../../img/shijian.png',name: '拍摄开始时间', value: '', type: 'start'},
      {icon: '../../img/shijian.png',name: '拍摄结束时间', value: '', type: 'end'}],
      noEdit: false,
      region: [],
      date: '',
      regionCode: [],
      sexArray: ['男','女'],
      startTime: '',
      endTime: '',
      sexIndex: 0
  },

  formSubmit: function (e) {
    wx.showNavigationBarLoading();
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let that = this;
    let postData = {
      photographerCode: wx.getStorageSync('yuyueData').userCode,
      customerName: e.detail.value.name,
      sex: this.data.sexArray[this.data.sexIndex] == '男' ? '1' : '2',
      birthDate: this.data.date,
      customerPhone: e.detail.value.phone,
      province: this.data.regionCode[0],
      city: this.data.regionCode[1],
      area: this.data.regionCode[2],
      address: e.detail.value.address,
      target: e.detail.value.target,
      appointStartTime: this.data.startTime,
      appointEndTime: this.data.endTime,
    };
    if(!switchJSON(postData)){
      console.log('请完善数据！');
      return false;
    }
    wx.request({
      url: app.globalData.serverUrl + '/order/save',
      header: {"token": wx.getStorageSync('tokenInfo').token},
      method: 'POST',
      data: postData,
      success (res) {
        if(res.data.code === 0){
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.switchTab({
            url: '../my_sy/index',
          })
        }
      }
    })
  },

  switchBtn: function(){
    this.setData({noEdit: !this.data.noEdit})
  },

  bindRegionChange: function(e){
    this.setData({region: e.detail.value,regionCode: e.detail.code})
  },

  bindSexChange: function(e){
    this.setData({sexIndex: e.detail.value})
  },

  bindDateChange: function(e){
    this.setData({date: e.detail.value})
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
    let enterDate = wx.getStorageSync('enterTime');
    let startTime = enterDate.start[0] + '-' + enterDate.start[1] + '-' + enterDate.start[2] + ' ' + enterDate.start[3] + ':00';
    let endTime = enterDate.end[0] + '-' + enterDate.end[1] + '-' + enterDate.end[2] + ' ' + enterDate.end[3] + ':00';
    let arr = this.data.infoList;
    arr[arr.length - 1].value = endTime;
    arr[arr.length - 2].value = startTime;
    this.setData({startTime: startTime,endTime:endTime,infoList: arr})
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