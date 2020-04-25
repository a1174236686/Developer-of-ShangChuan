// pages/recharge/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formDataMap:{
      pickNum:'￥30000',
      payMode:'支付宝',
    },
    pickNumData:{
      pickNumTit:"支付金额",
      /**
       * value映射formDataMap.pickNum
       * 选中意味着的formDataMap值为相应value属性的值
       */
      pickNumArr:[
        {frequency:'6次',Quota:'￥8800',value:'￥8800'},
        {frequency:'12次',Quota:'￥15000',value:'￥15000'},
        {frequency:'24次',Quota:'￥30000',value:'￥30000'},
      ],
    },
    payModeData:{
      payModeTit:"支付方式",
      /**
       * value映射formDataMap.payMode
       * 选中意味着的formDataMap值为相应value属性的值
       */
      payModeArr:[
        {text:"微信支付",value:'微信支付'},
        {text:"支付宝",value:'支付宝'},
        {text:"银联",value:'银联'},
      ],
    },
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

  },

  selectLimit:function(e){
    const param = e.currentTarget.dataset.param;
    const formDataMap = this.data.formDataMap;
    formDataMap.pickNum=param;
    this.setData({formDataMap})
  }
  
})