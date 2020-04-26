// pages/enterTime/enterTime.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let rowLength = 30 * 6;
    let length = 24 * 60 / rowLength;
    let list = [];
    for(let i = 0;i < length;i++){
      list.push({child: []})
      for(let j = 0;j < 6;j++){
        let Minute = i * 6 *30 + j * 30;
        //console.log(Minute,Math.floor(Minute / 60 % 30),Minute % 60)
        let h = Math.floor(Minute / 60 % 30) < 10 ? '0' + Math.floor(Minute / 60 % 30) : Math.floor(Minute / 60 % 30);
        let yu = Minute % 60 === 0 ? '0' + Minute % 60 :  Minute % 60;
        list[i].child.push(h + ':' + yu);
      }
    }
    this.setData({timeList: list})
  },

  selectTime:function(e){
    console.log(e.currentTarget.dataset.date)
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