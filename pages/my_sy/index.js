// pages/my_sy/index.js
import {updateCalendar,avatarUrlFn} from '../../utils/util';
const app = getApp()
const serverUrl = app.globalData.serverUrl;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    //轮播图列表
    branList:[
      {url:"../../static/l1.png",id:"1",mode:"scaleToFill"},
      {url:"../../static/l1.png",id:"2",mode:"aspectFill"},
      {url:"../../static/l1.png",id:"3",mode:"scaleToFill"}
    ],
    showChengg: false,
    name: {},
    imgUrls: [
      "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=231620273,2622968107&fm=27&gp=0.jpg",
      "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=281531042,273318123&fm=27&gp=0.jpg",
      "http://img4.imgtn.bdimg.com/it/u=2731345960,2613387946&fm=26&gp=0.jpg"
    ],
    currentIndex:0,
    //摄影师列表
    photographerList:[
      {
        name:"潘洋摄影师", //名称
        label:['美食云集'],//标签
        address:"深圳",//地址
        grade:4,//等级
        score:5.0,//评分
        image:"",
    }],
    currentDate: [],
    weekList:['日', '一', '二', '三', '四', '五', '六'],
    showDate: false,
    sheying: [],
    page: 1
  },

  openDate:function(e){
    if(wx.getStorageSync('sessionInfo')){
      this.setData({showDate: true});
      wx.setStorageSync('yuyueData',e.currentTarget.dataset.item);
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
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
    if(wx.getStorageSync('yuyuechenggong')){
      this.setData({showChengg: true});
      wx.removeStorageSync('yuyuechenggong');
    }
    this.getData();
    this.setData({showDate: false})
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

  }
})