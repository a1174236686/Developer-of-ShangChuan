// pages/withdrawal/withdrawal.js
const app = getApp()
import {http,switchJSON} from '../../utils/util'
const serverUrl = app.globalData.serverUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl:serverUrl,
    send:{
      name:"",//	是	string	支付宝姓名
      account:"",//	是	string	支付宝账号
      phone:"",//	是	string	手机号
      cashAmount:"",//	是	double	提现金额
      type:""//	是	int	提现方式(1:支付宝 2:微信)
    },
    totalCashAmount:2000
  },

  formSubmit: async function (e) {
    let send = {...e.detail.value,type:"1"};

    if(!switchJSON(send)){

      wx.showToast({
        title: '请完善数据',
        icon:"none"
      })
      return false;
    }
    

    let res= await http.post("/cashout/save",{data:send})
    if(res && res.code==0){
       wx.showToast({
         title: '提现成功',
         icon:"success"
       })
       //体现成功 返回上一页
       wx.navigateBack()
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //解析 number 为金钱格式
    let totalCashAmount = this.data.totalCashAmount;
    this.setData({totalCashAmount:totalCashAmount.formatMoney()})

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