// pages/my_sy/index.js
import {updateCalendar,avatarUrlFn,http} from '../../utils/util';
const app = getApp()
const serverUrl = app.globalData.serverUrl;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    regionCode: {code: [],value: []},
    showChengg: false,
    name: {},
    //轮播图列表
    imgUrls: [],
    currentIndex:0,
    //摄影师列表
    photographerList:[],
    currentDate: [],
    weekList:['日', '一', '二', '三', '四', '五', '六'],
    showDate: false,
    sheying: [],
    page: 1,
    wxUser: '',
    currentLocation: '',
    locationName: {province: '',city: '',area: ''},
    listInfo: {},
    queryName: ''
  },

  openDate:function(e){
    let wxUser = wx.getStorageSync('sessionInfo');
    if(wxUser){
      if(e.currentTarget.dataset.item.userCode == wxUser.userCode){
        wx.showToast({ title: '不可预约自己！', icon: 'none' });
        return false;
      }
      this.setData({showDate: true});
      wx.setStorageSync('yuyueData',e.currentTarget.dataset.item);
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  bindRegionChange: function(e){
    console.log(e.detail)
    let data = e.detail;
    let json = {
      province: data.code[0],
      city: data.code[1],
      area: data.code[2],
    }
    this.setData({regionCode: data,locationName: json},() =>{
      this.getData();
    })
  },

  getLocation:function(){
    let that = this;
    wx.getLocation({success: async (loca) =>{
      console.log(loca)
      that.setData({currentLocation: loca})
      let res = await http.get("/wxuser/location",{lng: loca.longitude,lat: loca.latitude});
      if(res.code == 0){
        let json = {
          code: [res.data.province+'',res.data.city + '',res.data.area+''],
          value: [res.data.provinceName,res.data.cityName,res.data.areaName]
        }
        let locaName = {
          province: res.data.province,
          city: res.data.city,
          area: res.data.area
        }
        that.setData({locationName: locaName,regionCode: json})
        that.getData();
      }
    },
    fail: function(mag){
      that.getData();
      wx.showModal({
        title: '温馨提示',
        content: '未授权定位请打开右上角→设置→定位服务开启',
        showCancel: false,
        success (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          } 
        }
      })
    }})
  },

  closeDate:function(){
    this.setData({showDate: false})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation();
    this.setData({name: app.globalData.userInfo});
    let list = [];
    let nowDate = new Date();
   
    this.setData({currentY: nowDate.getFullYear(),currentM: nowDate.getMonth() + 1,currentD: nowDate.getDate()});
    this.setData({currentDate: [nowDate.getFullYear(),nowDate.getMonth() + 1,nowDate.getDate()]})
    
    let m = nowDate.getMonth();
    let y = nowDate.getFullYear();
    for(let i = 0; i < 6;i++){
      let m = nowDate.getMonth() + i;
      if(m > 11){
        y += 1;
        m = m % 11;
      }
      list.push(updateCalendar(y,m,null))
    }
    this.setData({list:list});
  },

  swiperChange(e){
    this.setData({
      currentIndex:e.detail.current
    })
  },

  closeChengg(){
    this.setData({showChengg: false})
  },

  queryData: function(event){
    console.log(event.detail.value);
    this.setData({queryName: event.detail.value},() => {
      this.getData();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    let info = wx.getStorageSync('sessionInfo');
    if(wx.getStorageSync('yuyuechenggong')){
      this.setData({showDate: false,showChengg: true});
      wx.removeStorageSync('yuyuechenggong');
    }
    this.getBannerList();
    this.setData({wxUser: info})
  },

  getBannerList: async function(){
    let res = await http.get("/banner/list?showStatus=1");
    if(res.code == 0){
      let arr = res.data
      for(let i = 0 ; i < arr.length ; i ++){
        let item = arr[i];
        item.picture = avatarUrlFn(item.picture);
      }
      this.setData({imgUrls: arr})
    }
  },

  becomeVip(){
    if(wx.getStorageSync('sessionInfo')){
      wx.navigateTo({
        url: '../recharge/index',
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  getData: async function(type){
    type = type || '';
    let that = this;
    let data = {
      page: that.data.page,
      limit: 15,
      name: this.data.queryName,
      // target: this.data.queryName,
      ...that.data.locationName
    }
    let res = await http.get("/photographer/page",data);
    if(res.code == 0){
      if(this.data.page == 1 && !res.data.list.length){
        wx.showToast({title: '该地区暂未开放业务!',icon: 'none'})
      }
      let arr = []
      if(type){
        arr = that.data.sheying;
        arr = arr.qcConcat(res.data.list,'userCode');
      }else{
        arr = res.data.list;
      }
      for(let i = 0 ; i < arr.length ; i ++){
        let item = arr[i];
        item.avatarUrl = avatarUrlFn(item.avatarUrl);
      }
      that.setData({sheying: arr,listInfo: res});
    }
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
    this.setData({page: 1})
    this.getData();
    setTimeout(() =>{
      wx.stopPullDownRefresh();
    },500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.listInfo.totalPage && this.data.page < this.data.listInfo.totalPage){
      this.setData({page: this.data.page += 1})
      this.getData('up');
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goToPersonalInfo: function (e){
    console.log(e.currentTarget.dataset.item)
    wx.setStorageSync('yuyueData',e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/personalInfo/personalInfo',
      success: function(res) {
        res.eventChannel.emit('photographerCode', {
            photographerCode: e.target.dataset.param
        })
      }
    })
  }
})