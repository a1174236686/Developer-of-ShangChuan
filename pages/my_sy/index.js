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
    region: [],
    regionCode: [],
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
    wxUser: ''
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
    this.setData({region: e.detail.value,regionCode: e.detail.code})
  },

  closeDate:function(){
    this.setData({showDate: false})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      this.setData({showChengg: true});
      wx.removeStorageSync('yuyuechenggong');
    }
    this.getBannerList();
    this.getData();
    this.setData({showDate: false,wxUser: info})
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
    // wx.request({
    //   url: app.globalData.serverUrl + '/banner/list?showStatus=1',
    //   method: 'GET',
    //   success (res) {
    //   }
    // })
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

  getData(){
    let that = this;
    wx.request({
      url: app.globalData.serverUrl + '/photographer/page',
      // header: {"token": wx.getStorageSync('tokenInfo')},
      method: 'GET',
      data: {
        page: this.data.page,
        limit: 15
      },
      success (res) {
        if(res.data.data.list.length){
          let arr = that.data.sheying;
          arr = arr.qcConcat(res.data.data.list,'userCode');
          //console.log(arr);
          for(let i = 0 ; i < arr.length ; i ++){
            let item = arr[i];
            item.avatarUrl = avatarUrlFn(item.avatarUrl);
          }
          that.setData({sheying: arr});
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({page: this.data.page += 1})
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goToPersonalInfo: function (e){
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