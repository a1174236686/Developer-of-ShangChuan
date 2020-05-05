// pages/myWallet/myWallet.js
const app = getApp()
import {http,avatarUrlFn} from '../../utils/util'
const serverUrl = app.globalData.serverUrl;


const typeName = (type)=>{
     ///1:入账 2:提现 3:充值 4 手续费
     let array = ["摄影入账","钱包提现" ,"在线充值","手续费"];
      return array[type-1]||'';
    
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl:serverUrl,
    info:{
      yesterday:0, //昨日首页
      cumulative:0,//累计收益
      total:0 //总计收益
    },
    list:[],//明细
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStat();
  },
  //获取钱包信息
  async getStat(){
      let res = await http.get("/accountdetail/accountStat");
      if(res.code==0){

      //总信息
      if(res.totalAccount.length==3){
        //总收入 昨日收入  累计收益
        let {accountDetails,totalAccount} =res;
        let [zsr,dtsr,zzs] = totalAccount;
        this.setData({
          
          info:{
            total:(zsr.total||0).formatMoney(), //总计收益
            yesterday:(dtsr.total||0).formatMoney(), //昨日首页
            cumulative:(zzs.total ||0).formatMoney(),//累计收益
          },
          //1:入账 2:提现 3:充值 4 手续费
          //解析值
          list:accountDetails.map(it=>({...it,typeName:typeName(it.type)}))
      })

      // amount: 500
      // cashOutId: null
      // createTime: "2020-05-05 16:25:35"
      // openId: "oyyDk5G8MSGEURO4rlRQSCzJxFPk"
      // orderId: "20200505162436847ltek"
      // type: 1
      // updateTime: null
      // userCode: "af0805ba-91e8-4444-9ef2-2e0e06c59bd4"

      }

      }
     // console.log(res);

  },
  //跳转到提现
  goWith(){
    wx.navigateTo({
      url: '../withdrawal/withdrawal',
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

  }
})