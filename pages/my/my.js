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
      {label: '邀请有奖',id: 'money',src: serverUrl + '/statics/image/jiangli.png'},
      {label: '加入我们',id: 'join/join',src: serverUrl + '/statics/image/joinWe.png'},
    ],
    sysObject: {label: '加入我们',id: 'joinWe/index',src: serverUrl + '/statics/image/joinWe.png'},
    optionsUserList:[
      {label: '我的评价',id: 'myEvaluate/myEvaluate',src: serverUrl + '/statics/image/evaluate.png'},
      {label: '邀请奖励',id: 'money',src: serverUrl + '/statics/image/reward.png'},
      {label: '作品管理',id: 'personalInfo/personalInfo',src: serverUrl + '/statics/image/works.png'},
      {label: '我的资料',id: 'myInfor/myInfor',src: serverUrl + '/statics/image/data.png'}
    ],
    wxUserInfo: {videoWorkNum: 0,photoWorkNum: 0},
    showVip: false
  },

  gotoView: function(e){
    if(e.currentTarget.dataset.view == 'money'){
      wx.showToast({
        title: '正在开发，敬请期待...',
        icon: 'none'
      })
      return false;
    }
    if(this.isLogin()){
      let type = e.currentTarget.dataset.view
      if(type == 'vipCard/index' && !this.data.wxUser.isVip){
        wx.navigateTo({
          url: '../recharge/index'
        })
        return false;
      }
      wx.navigateTo({
        url: '/pages/' + type
      })
    }
  },

  gotoUserView: function(e){
    if(e.currentTarget.dataset.view == 'money'){
      wx.showToast({
        title: '正在开发，敬请期待...',
        icon: 'none'
      })
      return false;
    }
    let that = this;
    if(this.isLogin()){
      wx.navigateTo({
        url: '/pages/' + e.currentTarget.dataset.view,
        success: function(res) {
          res.eventChannel.emit('photographerCode', {
              photographerCode: that.data.wxUser.userCode
          })
        }
      })
    }
  },

  gotoMyData(){
    if(this.isLogin()){
      wx.navigateTo({
        url: '../myInfo_sy/myInfo_sy'
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
      let showSheyingshi = wx.getStorageSync('sessionInfo').isPhotographer;
      if(wx.getStorageSync('sessionInfo').isVip == 1){
        this.setData({showVip: true});
      }
      if(showSheyingshi == '1'){
        if(!wx.getStorageSync('sessionInfo')){
          this.setData({showSheyingshi: showSheyingshi});
        }
        wx.request({
          url: app.globalData.serverUrl + '/photographer/mine',
          header: {"token": wx.getStorageSync('tokenInfo').token},
          method: 'GET',
          success: function(res) {
            if(res.data.code == 0){
              let obj = res.data.biPhotographer;
              obj.avatarUrl = avatarUrlFn(obj.avatarUrl)
              that.setData({wxUserInfo: obj});
              wx.setStorageSync('syDetails',obj)
            }
          }
        })
      }else{
        //不是摄影师  需要添加加入我们
        // let optionsList = this.data.optionsList;
        // optionsList.qcConcat([this.data.sysObject],'id');
        // this.setData({optionsList});
      }
    }
  },

  onLoad:function(){
  },

  switchMy: function(){
    this.setData({showSheyingshi: this.data.showSheyingshi == '1' ? '0' : '1'})
  },

  zuzhi: function(){
    return false;
  },

  getPhoneNumber: async function(e){
    let that = this
    console.log(e.detail.encryptedData)
    if(e.detail.encryptedData){
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