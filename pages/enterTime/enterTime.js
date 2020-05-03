// pages/enterTime/enterTime.js
import {switchWeek} from '../../utils/util';
const app = getApp()
const serverUrl = app.globalData.serverUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    timeList: [],
    dayList: [],
    startTime: [],
    endTime: [],
    datas: [],
    errorMsg: false,
    errorText: '开始时间不能大于结束时间',
    yuyueData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('体验版本',options)
    let dataTime = [];
    let day = options.day.replace(/-/g,'/')
    dataTime.push(new Date(day).getTime());
    dataTime.push(new Date(day).getTime() + 24*60*60*1000)
    console.log('dataTime',dataTime)
    let arr = [];
    for(let i = 0; i < dataTime.length; i++){
      let date = new Date(dataTime[i]);
      let json = {
        year: date.getFullYear(),
        moth: date.getMonth() + 1,
        dey: date.getDate(),
        week: switchWeek(date.getDay())
      }
      arr.push(json);
      console.log('时间JSON',json)
    }
    this.setData({dayList: arr});
    let rowLength = 30 * 6;
    let length = 24 * 60 / rowLength;
    let list = [];
    for(let i = 0;i < length;i++){
      list.push({child: []})
      for(let j = 0;j < 6;j++){
        let Minute = i * 6 *30 + j * 30;
        //console.log(Minute,Math.floor(Minute / 60 % 30),Minute % 60)
        let h = Math.floor(Minute / 60 % 30) < 10 ? '0' + Math.floor(Minute / 60 % 30) : Math.floor(Minute / 60 % 30);
        let yu = Minute % 60 === 0 ? '0' + Minute % 60 :  Minute % 60;
        list[i].child.push(h + ':' + yu);
      }
    }
    this.setData({timeList: list})
  },

  next(){
    if(this.data.startTime.length && this.data.endTime.length){
      let json = {start: this.data.startTime,end: this.data.endTime}
      wx.setStorageSync('enterTime', json);
      wx.navigateTo({
        url: '../yuyueInfo/yuyueInfo',
      })
    }else{
      wx.showToast({title: '开始时间或结束时间为空！',icon: 'none'});
      return;
    }
  },

  selectTime:function(e){
    let dateArr = e.currentTarget.dataset.date;
    console.log(dateArr)
    this.setData({datas: dateArr});
    console.log(dateArr)
    if(this.data.startTime[3] == dateArr[3]){
      this.setData({startTime: []});
      return false;
    }
    if(this.data.endTime[3] == dateArr[3]){
      this.setData({endTime: []});
      return false;
    }
    if(!this.data.startTime.length && this.data.endTime.length){
      if(this.Transformation(dateArr) > this.Transformation(this.data.endTime)){
        this.setData({errorMsg: true});
        return false;
      }
      this.setData({startTime: dateArr});
      return false;
    }
    if(!this.data.startTime.length){
        this.setData({startTime: dateArr});
        return false;
    }
    if(this.data.startTime.length && !this.data.endTime.length){
      if(this.Transformation(dateArr) < this.Transformation(this.data.startTime)){
        this.setData({errorMsg: true});
        return false;
      }
      console.log(this.Transformation(dateArr),this.Transformation(this.data.startTime))
      if(this.Transformation(dateArr) - this.Transformation(this.data.startTime) < (1000 * 60 * 60 *6)){
        this.setData({endTime: dateArr});
        return false;
      }else{
        this.setData({errorMsg: true,errorText: '预约时长不能大于6小时！'});
      }
    }
  },

  Transformation: function(dateArr){
    console.log('222222',dateArr)
    console.log(new Date(dateArr[0]+ '/' +dateArr[1]+ '/' +dateArr[2]+ ' ' +dateArr[3]).getTime())
    let data = dateArr[0]+ '/' +dateArr[1]+ '/' +dateArr[2]+ ' ' +dateArr[3];
    return new Date(data).getTime();
  },

  rentuTrue:function(e){
    // let dateArr = e.currentTarget.dataset.date;
    // new Date(dateArr[0]+ '-' +dateArr[1]+ '-' +dateArr[2]+ '-' +dateArr[3]).getTime();
    return true;
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
    this.setData({yuyueData: wx.getStorageSync('yuyueData')})
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