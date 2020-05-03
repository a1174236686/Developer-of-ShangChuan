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
      pickNum:'￥8800',
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
              wx.navigateBack();
            }
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let res = await http.get("/packagecard/page");
    if (res.code === 0) {
      let data = this.data.pickNumData;
      data.pickNumArr = res.page;
      let json = this.data.formDataMap;
      json.pickNum = res.page[0];
      this.setData({pickNumData: data,formDataMap: json})
    }
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