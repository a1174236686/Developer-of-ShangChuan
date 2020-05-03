// pages/login/login.js
const app = getApp()
const serverUrl = app.globalData.serverUrl
import {loginSystem} from '../../utils/login'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      
  },

  bindGetUserInfo: function(e) {
    //用户按了同意按钮
    if (e.detail.userInfo) {
      //同意获 用户信息
      loginSystem(e.detail,()=>{
        //登录成功
        wx.navigateBack({}); // 关闭当前页面，返回上一页面或多级页面
      },(error)=>{
        //登录失败 执行此处
          console.log(error)
      })
    } else {
        //用户按了拒绝按钮
        wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，请授权之后再进入!!!',
            showCancel: false,
            confirmText: '返回授权',
            success: function(res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                if (res.confirm) {
                    console.log('用户点击了“返回授权”');
                }
            }
        });
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

  }
})