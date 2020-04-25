// pages/test/index.js

const computedBehavior = require('miniprogram-computed')

Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    max:5,
    score:1.6,
  },

  computed:{
    scoreInteger:function(data){
      const {score} = data;
      const int = Math.ceil(score);
      console.log('int',int)
      return int
    },
    scoreDecimal:function(data){
      let {score} = data;
      score+="";
      const index =score.indexOf(".");
      if(index===-1) return 0;
      else {
        console.log('???',score.substring(index+1,index+2))
        return score.substring(index+1,index+2)
      };
    },
  },

  scoreChange:function(e){
    console.log("我是分数改变",e.currentTarget.dataset.param);
    this.setData({score:e.currentTarget.dataset.param})
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