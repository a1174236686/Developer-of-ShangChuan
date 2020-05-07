//index.js
//获取应用实例
const app = getApp()
const serverUrl = app.globalData.serverUrl
Page({
  data: {
    userInfo: {},
    serverUrl: serverUrl,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tabList: [{label: '精选'},{label: '美食'},{label: '人物'},{label: '风景'}],
    indexList: [{name: '潘阳',src: serverUrl + '/statics/image/shouye1.png',time: '2020-04-30',icon: '../../img/toux.jpg'},
    {name: '张广林',src: serverUrl + '/statics/image/shouye2.png',time: '2020-04-30',icon: '../../img/toux.jpg'}],
    showTabActive: 0,
  },
  switchTab: function(e){
    this.setData({showTabActive: e.currentTarget.dataset['index']})
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //this.getToken();
  },
  onShow: function(){
    this.getToken();
  },
  getToken(){
    var that = this;
    // 查看是否授权
    wx.getSetting({
     success: function(res) {
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
                                if(sessionInfo.code==0){
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
         } 
     }
    });
  }
})
