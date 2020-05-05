// pages/myInfor/myInfor.js
const app = getApp()
import {avatarUrlFn,http} from '../../utils/util';
const serverUrl = app.globalData.serverUrl;
import {switchJSON} from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    infoList: [
      {icon: serverUrl + '/statics/image/xingming.png',name: '姓名', value: '', type: 'name',key: 'nickName'},
      {icon: serverUrl + '/statics/image/nvx.png',name: '性别', value: '', type: 'sex',sex: true,key: 'gender'},
      {icon: serverUrl + '/statics/image/riqi.png',name: '出生日期', value: '', type: 'date',date: true},
      {icon: serverUrl + '/statics/image/shouji.png',name: '电话', value: '', type: 'phone',status: 'number',key: 'phone'},
      {icon: serverUrl + '/statics/image/quyu.png',name: '区域', value: [], type: 'region',quyu: true},
      {icon: serverUrl + '/statics/image/map.png',name: '拍摄地点', value: '', type: 'address',key: 'address'},
      {icon: serverUrl + '/statics/image/paishe.png',name: '拍摄对象', value: '', type: 'target',key: 'target'},
      {icon: serverUrl + '/statics/image/shijian.png',name: '拍摄开始时间', value: '', type: 'start'},
      {icon: serverUrl + '/statics/image/shijian.png',name: '拍摄结束时间', value: '', type: 'end'}],
      noEdit: false,
      date: '',
      regionData: {code: [],value: []},
      sexArray: ['男','女'],
      startTime: '',
      endTime: '',
      sexIndex: 0
  },

  formSubmit: function (e) {
    let that = this;
    let postData = {
      photographerCode: wx.getStorageSync('yuyueData').userCode,
      customerName: e.detail.value.name,
      sex: this.data.sexArray[this.data.sexIndex] == '男' ? '1' : '2',
      birthDate: this.data.date,
      customerPhone: e.detail.value.phone,
      province:  this.data.regionData.code[0] || '', //省编码
      city:  this.data.regionData.code[1] || '', //省编码
      area:  this.data.regionData.code[2] || '', //省编码
      address: e.detail.value.address,
      target: e.detail.value.target,
      appointStartTime: this.data.startTime,
      appointEndTime: this.data.endTime,
    };
    if(!switchJSON(postData)){
      wx.showToast({ title: '请完善数据!', icon: 'none' });
      return false;
    }
    wx.showLoading({ title: '加载中',})
    wx.request({
      url: app.globalData.serverUrl + '/order/save',
      header: {"token": wx.getStorageSync('tokenInfo').token},
      method: 'POST',
      data: postData,
      success (res) {
        if(res.data.code === 0){
          wx.hideLoading(); //完成停止加载
          wx.setStorageSync('yuyuechenggong','1')
          wx.switchTab({
            url: '../my_sy/index',
          })
        }else{
          wx.hideLoading(); //完成停止加载
          wx.showToast({ title: res.data.msg, icon: 'none' });
        }
      }
    })
  },

  switchBtn: function(){
    this.setData({noEdit: !this.data.noEdit})
  },

  bindRegionChange: function(e){
    this.setData({regionData: e.detail})
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
    let obj =  wx.getStorageSync('sessionInfo')
    let regionData = {
      code: obj.area ? [obj.province || '',obj.city || '',obj.area || ''] : [],
      value: obj.areaName ? [obj.provinceName + '省' || '',obj.cityName + '市' || '',obj.areaName || ''] : []
    }
    for(let i = 0;i < arr.length;i++){
      let item = arr[i];
      item.value =  obj[item.key] || ''
    }
    obj.avatarUrl = avatarUrlFn(obj.avatarUrl);
    arr[arr.length - 1].value = endTime;
    arr[arr.length - 2].value = startTime;
    this.setData({startTime: startTime,endTime:endTime,infoList: arr,date: obj.birthDate,sexIndex: obj.gender == 1 ? 0 : 1,regionData});
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