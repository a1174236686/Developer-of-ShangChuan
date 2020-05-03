// pages/position/index.js
import {updateCalendar} from '../../utils/util';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Component({

  properties: {
    list: Array,
    currentDate: Array
  },

  /**
   * 页面的初始数据
   */
  data: {
      cityList:[],
      currentY: '',
      currentM: '',
      currentD: '',
      currentDate: [],
      list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: '2B2BZ-PBVRW-K6RR3-OB4HW-W6CJS-HWFBO'
  });

  },

  methods:{
    enterDate:function(e){
      let dateArr = e.currentTarget.dataset.date;
      if(!dateArr[2].current || (dateArr[0] === this.data.currentDate[0] && dateArr[1] === this.data.currentDate[1] &&  dateArr[2].value < this.data.currentDate[2] && dateArr[2].current )){
        return false;
      }
      this.setData({currentY: dateArr[0],currentM: dateArr[1],currentD: dateArr[2].value})
      console.log(dateArr[0] + '-' + dateArr[1] + '-' + dateArr[2].value)
      wx.navigateTo({
        url: '../enterTime/enterTime?day=' + dateArr[0] + '-' + dateArr[1] + '-' + dateArr[2].value,
      })
    },
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
      this.getCityList();
  },

  open(e){
    let {id,index} = e.currentTarget.dataset;
    this.getDistrictByCityId(id,index)
   
  },
  getDistrictByCityId:function(id,index){
    let cityList = this.data.cityList;
    let self = this;
  
  qqmapsdk.getDistrictByCityId({
      // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
      id: id,//city[0].id, //对应接口getCityList返回数据的Id，如：北京是'110000'
      success: function(res) {//成功后的回调
          let list = res.result[0];
          cityList[index].childList = list;
          self.setData({cityList:cityList})
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },

  getCityList:function(){
    var _this = this;
    //调用获取城市列表接口
    qqmapsdk.getCityList({
      success: function(res) {//成功后的回调
      //  console.log(res);
      _this.setData({
        cityList: res.result[0]
      }) 
        // console.log('省份数据：', res.result[0]); //打印省份数据
        // console.log('城市数据：', res.result[1]); //打印城市数据
        // console.log('区县数据：', res.result[2]); //打印区县数据
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
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