// pages/myOrder/myOrder.js
const app = getApp()
import {http} from '../../utils/util';
import QRCode from '../../libs/weapp-qrcode'
const serverUrl = app.globalData.serverUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    tabList: [{name: '待接单',type: '1'},{name: '待拍摄',type: '2'},{name: '已拍摄',type: '3'},{name: '已完成',type: '4'}],//tab
    // waitOrderList: [],//待接单
    // waitShotList:[],//待拍摄
    // alreadyCompleteList: [],//已拍摄
    // alreadyShotList: [],//已完成
    orderList: [],
    currentType: '1',
    page: 1,
    cardNoVisible:true,//是否显示二维码
  },

  switchTab:  function(e){
    let type = e.currentTarget.dataset.type;
    if(type == this.data.currentType){
      return false
    }
    this.setData({currentType: type,page: 1,orderList: []},() =>{
      this.getData(type);
    })
  },

  //取消预约
  cancelOrider:function(e) {
    let item = e.currentTarget.dataset.item;
    let that = this;
    let arr = that.data.orderList;
    wx.showModal({
      title: '提示',
      content: '是否取消预约',
      showCancel: true,
      success: async function(res) {
        if(res.confirm){
          wx.showNavigationBarLoading();//在标题栏中显示加载
          let myRes = await http.post('/order/cancel',{data:{ orderId: item.orderId,  cancelReason: '取消'  }});
          if(myRes.code===0){
            that.setData({orderList: arr.filter(it=>it.orderId!==item.orderId)});

          }
          wx.hideNavigationBarLoading() //完成停止加载
        }
      }
    });
  },

//跳转到立即评价页面
goToEvaluation(evt){
  let item = evt.currentTarget.dataset.item;
  let send = {
    orderId:item.orderId,
    photographerCode:item.photographerCode

  }
    wx.navigateTo({
      url: "../evaluate/index?info="+JSON.stringify(send),
    })
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //this.createQrCode('ddddd');

  },
  //生成二维码 text 需要生成二维码的值 
  // text 有值:显示 无值:影藏
  createQrCode(text=null){
  let bool = text!=null;
    this.setData({cardNoVisible:!bool})
   //单位为px
  new QRCode('canvas', {
  // usingIn: this,
  text: text,
  width: 150,
  height: 150,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.L,//辨识度
  callback: (res) => {
      // 生成二维码的临时文件
     // console.log(res.path)
  }

 })
},

 //显示影藏二维码
 showHidden(evt){
   let dataset = evt.currentTarget.dataset;
   if(dataset.item){
     //显示二维码
     this.createQrCode(dataset.item.orderId)
   }else{
     //关闭二维码
     this.createQrCode(null);
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
    this.getData();
  },

  getData(type=null){
    let that = this;
    type = type || this.data.currentType
    wx.showNavigationBarLoading();//在标题栏中显示加载
    wx.request({
      url: app.globalData.serverUrl + '/order/customer/mine',
      header: {"token": wx.getStorageSync('tokenInfo').token},
      method: 'GET',
      data: {
        page: this.data.page,
        limit: 15,
        status: type
      },
      success (res) {
        wx.hideNavigationBarLoading() //完成停止加载
        if(res.data.code == 0){
          if(res.data.data.length){
              //之前的老数据
              let arr = that.data.orderList;
              //获取到的新数据
              let newArray = res.data.data;
              //根据id去重 qcConcat 见 util js
              arr = arr.qcConcat(newArray,'orderId');
              that.setData({orderList: arr});
          }
        }
      }
    })
  },
    //打电话给摄影师
    makePhoneCall(evt){
      let item = evt.currentTarget.dataset.item;
      wx.makePhoneCall({
        phoneNumber: item.photographerPhone,
        success(re){
          //调用拨打电话成功
        },
        fail(error){
          //调用拨打货失败
        }
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
    this.getData();
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})