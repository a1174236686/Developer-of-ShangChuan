// pages/myOrder/myOrder.js
const app = getApp();
import {http} from '../../utils/util'
const serverUrl = app.globalData.serverUrl;
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
    page: 1
  },

  switchTab:  function(e){
    let type = e.currentTarget.dataset.type;
    this.setData({currentType: type,page: 1},() =>{
      this.getData(type);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.setData({orderList: this.data.waitOrderList})
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
    wx.request({
      url: app.globalData.serverUrl + '/order/photographer/mine',
      header: {"token": wx.getStorageSync('tokenInfo').token},
      method: 'GET',
      data: {
        page: this.data.page,
        limit: 15,
        status: type
      },
      success (res) {
        if(res.data.code == 0){
          if(res.data.data.length){
            let arr = that.data.orderList;
            console.log('array',that.data);
            arr = arr.concat(res.data.data);
            that.setData({orderList: arr});
          }
        }
      }
    })
  },

  /**
   * 拒绝订单
   */
  refuseOrder(evt){
    let self = this,orderList = self.data.orderList;
    let item = evt.currentTarget.dataset.item;
    wx.showModal({
      title:"提示",
      content:"是否拒绝",
      success: async (res)=>{
        if(res.confirm){
          //拒绝
         let res  = await  http.post("/order/reject",{data:{orderId:item.orderId,rejectReason:"拒绝"}});
         if(res.code===0){
           //拒绝之后 删除当前拒绝项
            wx.showToast({ title: '拒绝成功！', icon: 'none' });
           self.setData({orderList:orderList.filter(it=>it.orderId!==item.orderId)});
         }
        }else{
          //取消拒绝
        }
      }
    })
  },
  //确认订单
  determineOrder(evt){
    let self = this,orderList = self.data.orderList;
    let item = evt.currentTarget.dataset.item;
    wx.showModal({
      title:"提示",
      content:"是否接单",
      success: async (res)=>{
        if(res.confirm){
          //确认接单
         let res  = await  http.post("/order/receive",{data:{orderId:item.orderId}});
         if(res.code===0){
           //确认之后 删除当前确认项
            wx.showToast({ title: '接单成功！', icon: 'none' });
           self.setData({orderList:orderList.filter(it=>it.orderId!==item.orderId)});
         }
        }else{
          //取消确认
        }
      }
    })
  },
  //核销
  writeOff(evt){
    let self = this,orderList = self.data.orderList;
    let item = evt.currentTarget.dataset.item;
    wx.showModal({
      title:"提示",
      content:"是否核销",
      success: async (res)=>{
        if(res.confirm){
          //确认核销
         let res  = await  http.post("/order/writeoff",{data:{orderId:item.orderId}});
         if(res.code===0){
           //核销之后 删除当前核销项
           wx.showToast({ title: '核销成功！', icon: 'none' });
           self.setData({orderList:orderList.filter(it=>it.orderId!==item.orderId)});
         }
        }else{
          //取消核销
        }
      }
    })

  },
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