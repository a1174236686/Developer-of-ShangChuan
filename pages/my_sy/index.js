// pages/my_sy/index.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图列表
   branList:[
     {url:"../../static/l1.png",id:"1",mode:"scaleToFill"},
     {url:"../../static/l1.png",id:"2",mode:"aspectFill"},
     {url:"../../static/l1.png",id:"3",mode:"scaleToFill"}
   ],
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


    
    }

    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({name: app.globalData.userInfo})
  },

  swiperChange(e){

    this.setData({
      currentIndex:e.detail.current
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