// pages/enterTime/enterTime.js
import {switchWeek,http} from '../../utils/util';
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
  onLoad: async function (options) {
    console.log('体验版本',options)
    let data = {
      photographerCode: wx.getStorageSync('yuyueData').userCode
    }
    wx.showLoading({title: '加载中',})
    let resData =  await http.get('/biappointment/page',data);
    let resDataRES = []
    if(resData.code == 0){
      resDataRES = resData.data
    }else{
      wx.showToast({
        title: resData.msg,
        icon: "none"
      })
      wx.hideLoading()
    }
    console.log(resDataRES);
    let dataTime = [];
    let day = options.day.replace(/-/g,'/')
    let currentData = new Date(day).getTime()
    dataTime.push(currentData);
    dataTime.push(currentData + 24*60*60*1000)
    console.log('dataTime',dataTime)
    let arr = [];
    for(let q = 0; q < dataTime.length; q++){
      let date = new Date(dataTime[q]);
      let json = {
        year: date.getFullYear(),
        moth: date.getMonth() + 1,
        dey: date.getDate(),
        week: switchWeek(date.getDay()),
        list: []
      }
      let rowLength = 30 * 6;
      let length = 24 * 60 / rowLength;
      for(let i = 0;i < length;i++){
        json.list.push({child: []})
        for(let j = 0;j < 6;j++){
          let Minute = i * 6 *30 + j * 30;
          //console.log(Minute,Math.floor(Minute / 60 % 30),Minute % 60)
          let h = Math.floor(Minute / 60 % 30) < 10 ? '0' + Math.floor(Minute / 60 % 30) : Math.floor(Minute / 60 % 30);
          let yu = Minute % 60 === 0 ? '0' + Minute % 60 :  Minute % 60;
          let time = h + ':' + yu;
          let dataTimeDui = json.year + '/' + json.moth + '/' + json.dey + ' ' + time;
          let dataTimeDuiNum = new Date(dataTimeDui);
          let isEnter = false
          for(let k = 0; k < resDataRES.length; k++){
            let startTimes = resDataRES[k].appointStartTime.replace(/-/g,'/');
            let endTimes = resDataRES[k].appointEndTime.replace(/-/g,'/');
            let startTimeNum = new Date(startTimes);
            let endTimesNum = new Date(endTimes);
            if(dataTimeDuiNum >= startTimeNum && dataTimeDuiNum <= endTimesNum){
              console.log(dataTimeDui,resDataRES[k].appointStartTime,resDataRES[k].appointEndTime)
              isEnter = true;
            }
          }
          json.list[i].child.push({time: time,isEnter: isEnter});
        }
      }
      arr.push(json);
    }
    wx.hideLoading();
    this.setData({dayList: arr});
    
    //this.setData({timeList: list})
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
    console.log(e.currentTarget.dataset.isenter)
    console.log(dateArr)
    if(e.currentTarget.dataset.isenter){
      wx.showToast({
        title: '此时间段已被人预约！',
        icon: "none"
      })
      return false;
    }
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
        this.setData({errorMsg: true,errorText: '开始时间不能大于结束时间！'});
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
        this.setData({errorMsg: true,errorText: '结束时间不能小于开始时间！'});
        return false;
      }
      console.log(this.Transformation(dateArr),this.Transformation(this.data.startTime))
      if(this.Transformation(dateArr) - this.Transformation(this.data.startTime) <= (1000 * 60 * 60 *6)){
        this.setData({endTime: dateArr});
        return false;
      }else{
        this.setData({errorMsg: true,errorText: '预约时长不能大于6小时！'});
      }
    }
  },

  Transformation: function(dateArr){
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