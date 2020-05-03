// pages/my/my.js
import {avatarUrlFn,http} from '../../utils/util';
import {getSession,login} from '../../utils/login'
const app = getApp()
const serverUrl = app.globalData.serverUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    phoneNum: '',
    wxUser: '',
    portraitUrl: '',
    tokenInfo: null,
    showSheyingshi: '0',
    optionsList:[
      {label: '我的预约',id: 'userOrder/userOrder',src: serverUrl + '/statics/image/yuyue.png'},
      {label: '我的会员卡',id: 'vipCard/index',src: serverUrl + '/statics/image/vip.png'},
      {label: '邀请有奖',id: 'works',src: serverUrl + '/statics/image/jiangli.png'},
    ],
    sysObject: {label: '加入我们',id: 'joinWe/index',src: serverUrl + '/statics/image/joinWe.png'},
    optionsUserList:[
      {label: '我的评价',id: 'myEvaluate/myEvaluate',src: serverUrl + '/statics/image/evaluate.png'},
      {label: '邀请奖励',id: 'myWallet/myWallet',src: serverUrl + '/statics/image/reward.png'},
      {label: '作品管理',id: 'personalInfo/aaa',src: serverUrl + '/statics/image/works.png'},
      {label: '我的资料',id: 'myInfor/myInfor',src: serverUrl + '/statics/image/data.png'}
    ],
    wxUserInfo: {videoWorkNum: 0,photoWorkNum: 0}
  },

  gotoView: function(e){
    if(this.isLogin()){
      let type = e.currentTarget.dataset.view
      if(type == 'vipCard/index' && !this.data.wxUser.isVip){
        wx.navigateTo({
          url: '../recharge/index'
        })
        return false;
      }
      wx.navigateTo({
        url: '/pages/' + type　// 页面 B
      })
    }
  },

  gotoUserView: function(e){
    if(this.isLogin()){
      wx.navigateTo({
        url: '/pages/' + e.currentTarget.dataset.view　// 页面 B
      })
    }
  },

  gotoMyData(){
    if(this.isLogin()){
      wx.navigateTo({
        url: '../myInfor/myInfor'
      })
    }
  },

  isLogin(){
    if(wx.getStorageSync('tokenInfo') && wx.getStorageSync('userInfo')){
      return true
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
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
    // if(wx.getStorageSync('userInfo') && wx.getStorageSync('tokenInfo') && wx.getStorageSync('tokenInfo').bindFlag === 0){
    //   this.setData({isHaveNum: false});
    // }
    // if(wx.getStorageSync('userInfo') && wx.getStorageSync('tokenInfo') && wx.getStorageSync('tokenInfo').bindFlag && wx.getStorageSync('sessionInfo')){
    //   this.setData({isHaveNum: true,phoneNum: wx.getStorageSync('sessionInfo').phone});
    // }
    if(wx.getStorageSync('sessionInfo')){
      let that = this;
      let url = '';
      let avatarUrl = wx.getStorageSync('sessionInfo').avatarUrl
      this.setData({wxUser: wx.getStorageSync('sessionInfo'),tokenInfo: wx.getStorageSync('tokenInfo').bindFlag,portraitUrl: avatarUrlFn(avatarUrl)})
      let showSheyingshi = wx.getStorageSync('sessionInfo').isPhotographer
      if(showSheyingshi == '1'){
        if(!wx.getStorageSync('sessionInfo')){
          this.setData({showSheyingshi: showSheyingshi});
        }
        wx.request({
          url: app.globalData.serverUrl + '/photographer/info/' + wx.getStorageSync('sessionInfo').userCode,
          header: {"token": wx.getStorageSync('tokenInfo').token},
          method: 'GET',
          success (res) {
            that.setData({wxUserInfo: res.data.biPhotographer});
          }
        })
      }else{
        //不是摄影师  需要添加加入我们
        let optionsList = this.data.optionsList;
        optionsList.qcConcat([this.data.sysObject],'id');
        this.setData({optionsList});
      }
    }
  },

  onLoad:function(){
  },

  switchMy: function(){
    this.setData({showSheyingshi: this.data.showSheyingshi == '1' ? '0' : '1'})
  },

  getPhoneNumber: async function(e){
    let that = this
    if(e.detail){
     //登录
      let code = await login();
      let send = {
          code: code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
       }
       //绑定电话
      let resData =  await http.post('/wxuser/bindPhone',{data:send});
      if(resData.code===0){
         //获取电话成功
        let wxUser =  await getSession();//获取session
        that.setData({wxUser:wxUser})
        wx.setStorageSync('sessionInfo',wxUser);
      }


    }else{
      //不允许获取电话号码
    }
  },

  gotoOrder: function() {
    wx.navigateTo({
      url: '../myOrder/myOrder'
    })
  },

  gotoWallet: function() {
    wx.navigateTo({
      url: '../myWallet/myWallet'
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})