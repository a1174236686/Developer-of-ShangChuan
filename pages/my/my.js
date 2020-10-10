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
    if(wx.getStorageSync('sessionInfo')){
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
    this.init();
  },

  init(){
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
    wx.showLoading({title: '加载中...',})
    this.getToken();
  },

  getToken(){
    var that = this;
    // 查看是否授权
    wx.getSetting({
     success: function(res) {
      console.log('查看是否授权',res.authSetting['scope.userInfo'])
         if (res.authSetting['scope.userInfo']) {
             wx.getUserInfo({
                 success: function(res_Info) {
                   // 登录
                   wx.login({
                     success: res => {
                       // 发送 res.code 到后台换取 openId, sessionKey, unionId
                       //wx.setStorageSync('temporaryCode',res.code);
                       wx.request({
                         url: that.data.serverUrl + '/wx/login',
                         method: 'POST',
                         data: {
                           code: res.code,
                           rawData: res_Info.rawData,
                           signature: res_Info.signature,
                           encryptedData: res_Info.encryptedData,
                           iv: res_Info.iv,
                         },
                         success (data) {
                           if(data.data.code == 0){
                            wx.setStorageSync('tokenInfo',data.data);
                            wx.request({
                              url: that.data.serverUrl + '/wxuser/session',
                              header: {"token": data.data.token},
                              method: 'GET',
                              success (sessionInfo) {
                                console.log(sessionInfo)
                                if(sessionInfo.data.code == 0){
                                  wx.stopPullDownRefresh()
                                  wx.hideLoading()
                                  that.setData({wxUser: sessionInfo.data.wxUser},() => {
                                    that.init();
                                  });
                                  wx.setStorageSync('sessionInfo',sessionInfo.data.wxUser);
                                }else{
                                  console.log('初始化获取session失败',sessionInfo)
                                }
                              }
                            })
                           }else{
                             that.getToken();
                           }
                         }
                       })
                     }
                   })
                 }
             });
         }else{
           wx.removeStorageSync('sessionInfo');
         } 
     }
    });
  }
})