// pages/myOrder/myOrder.js
const app = getApp();
import {
  http
} from '../../utils/util'
const serverUrl = app.globalData.serverUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    tabList: [{
      name: '待接单',
      type: '1'
    }, {
      name: '待拍摄',
      type: '2'
    }, {
      name: '已拍摄',
      type: '3'
    }, {
      name: '已完成',
      type: '4'
    }], //tab
    // waitOrderList: [],//待接单
    // waitShotList:[],//待拍摄
    // alreadyCompleteList: [],//已拍摄
    // alreadyShotList: [],//已完成
    orderList: [],
    currentType: '1',
    page: 1
  },

  switchTab: function (e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      currentType: type,
      page: 1
    }, () => {
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

  getData(type = null) {
    let that = this;
    type = type || this.data.currentType
    wx.request({
      url: app.globalData.serverUrl + '/order/photographer/mine',
      header: {
        "token": wx.getStorageSync('tokenInfo').token
      },
      method: 'GET',
      data: {
        page: this.data.page,
        limit: 15,
        status: type
      },
      success(res) {
        if (res.data.code == 0) {
          if (res.data.data.length) {
            //之前的老数据
            let arr = that.data.orderList;
            //获取到的新数据
            let newArray = res.data.data;
            //根据id去重 qcConcat 见 util js
            arr = arr.qcConcat(newArray, 'orderId');
            that.setData({
              orderList: arr
            });
          }
        }
      }
    })
  },

  /**
   * 拒绝订单
   */
  refuseOrder(evt) {
    let self = this,
      orderList = self.data.orderList;
    let item = evt.currentTarget.dataset.item;
    wx.showModal({
      title: "提示",
      content: "是否拒绝",
      success: async (res) => {
        if (res.confirm) {
          //拒绝
          let res = await http.post("/order/reject", {
            data: {
              orderId: item.orderId,
              rejectReason: "拒绝"
            }
          });
          if (res.code === 0) {
            //拒绝之后 删除当前拒绝项
            self.setData({
              orderList: orderList.filter(it => it.orderId !== item.orderId)
            });
          }
        } else {
          //取消拒绝
        }
      }
    })
  },
  //确认订单
  determineOrder(evt) {
    let self = this,
      orderList = self.data.orderList;
    let item = evt.currentTarget.dataset.item;
    wx.showModal({
      title: "提示",
      content: "是否接单",
      success: async (res) => {
        if (res.confirm) {
          //确认接单
          let res = await http.post("/order/receive", {
            data: {
              orderId: item.orderId
            }
          });
          if (res.code === 0) {
            //确认之后 删除当前确认项
            self.setData({
              orderList: orderList.filter(it => it.orderId !== item.orderId)
            });
          }
        } else {
          //取消确认
        }
      }
    })
  },
  //核销
  writeOff(evt) {
    let self = this,
      orderList = self.data.orderList;
    let item = evt.currentTarget.dataset.item;
    /**
     *  核销
     *  1 客户预约摄影师
     *  2 摄影师接单
     *  3 客户 出示二维码 
     *  4 摄影师 扫描二维码
     *  5 扫码成功 修改状态(是否需要把扫描结果发送后台)
     *  6 该订单变成另一个状态 结束
     * 
     */
    wx.scanCode({
      success: async (cardNoInfo) => {
        if (cardNoInfo.result) {
          let orderId = cardNoInfo.result;
          if (orderId === item.orderId) {
            //判断扫码id 是否与 当前核销订单id是否 一致   
            //cardNoInfo 二维码信息 二维码信息 
            //扫码成功
            let res = await http.post("/order/writeoff", {
              data: {
                orderId: cardNoInfo.result
              }
            });
            if (res.code === 0) {
              //核销之后 删除当前核销项
              self.setData({
                orderList: orderList.filter(it => it.orderId !== item.orderId)
              });
              wx.showToast({
                title: '核销成功',
                icon: "success"
              })


            } else {
              //核销失败
              wx.showToast({
                title: '核销失败',
                icon: "none"
              })
            }



          } else {
            //核销订单不一致
            wx.showToast({
              title: '核销订单不一致',
              icon: "none"
            })

          }
        }
      },
      fail: (error) => {
        //扫码失败
        
      }
    })

  },
  //打电话给客户
  makePhoneCall(evt) {
    let item = evt.currentTarget.dataset.item;
    console.log(item);
    wx.makePhoneCall({
      phoneNumber: item.customerPhone, //客户电话
      success(re) {
        //调用拨打电话成功
      },
      fail(error) {
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})