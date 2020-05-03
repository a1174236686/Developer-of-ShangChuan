// pages/recharge/index.js
const app = getApp()
const serverUrl = app.globalData.serverUrl;
import {
  http
} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    formDataMap:{
      pickNum: {},
      payMode:'微信支付',
    },
    pickNumData:{
      pickNumTit:"支付金额",
      /**
       * value映射formDataMap.pickNum
       * 选中意味着的formDataMap值为相应value属性的值
       */
      pickNumArr:[],
    },
    payModeData:{
      payModeTit:"支付方式",
      /**
       * value映射formDataMap.payMode
       * 选中意味着的formDataMap值为相应value属性的值
       */
      payModeArr:[
        {text:"微信支付",value:'微信支付'},
      ],
    },
  },

  enterPlay: function() {
    let that = this
    const json = this.data.formDataMap.pickNum
      wx.request({
        url: that.data.serverUrl + "/wxuser/createOrder",
        data: {
          amount: json.price,
          packageCardId: json.id
        },
        method: "POST",
        header: {
          'Content-Type': "application/json",
          'token': wx.getStorageSync('tokenInfo').token
        },
        success: function (res) {
          const payargs = res.data.order
          wx.requestPayment({
            timeStamp: payargs.timeStamp,
            nonceStr: payargs.nonceStr,
            package: payargs.packageValue,
            signType: payargs.signType,
            paySign: payargs.paySign,
            success (res) {
              wx.showToast({ title: '充值成功', icon: 'success' });
            }
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  getData: function() {
    let that = this;
    wx.request({
      url: app.globalData.serverUrl + '/packagecard/page',
      // header: {"token": wx.getStorageSync('tokenInfo')},
      method: 'GET',
      success (res) {
        if (res.data.code === 0) {
          let data = that.data.pickNumData;
          data.pickNumArr = res.data.page;
          let json = that.data.formDataMap;
          json.pickNum = res.data.page[0];
          that.setData({pickNumData: data,formDataMap: json})
        }
      }
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

  },

  selectLimit:function(e){
    const param = e.currentTarget.dataset.param;
    const formDataMap = this.data.formDataMap;
    formDataMap.pickNum=param;
    this.setData({formDataMap})
  }
})