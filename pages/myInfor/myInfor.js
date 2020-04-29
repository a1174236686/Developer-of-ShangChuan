// pages/myInfor/myInfor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerImg:'../../img/faxian.png',
    postImg:'',
    infoList: [
      {icon: '',name: '姓名', value: '张三', type: 'name'},
      {icon: '',name: '性别', value: '李四', type: 'sex'},
      {icon: '',name: '出生日期', value: '王五', type: 'date'},
      {icon: '',name: '电话', value: '六六', type: 'phone'},
      {icon: '',name: '区域', value: '戚戚', type: 'region'}],
      noEdit: true,
  },

  formSubmit: function (e) {
    wx.showNavigationBarLoading();
    let vm = this;
    setTimeout(function(){
      vm.setData({noEdit: !vm.data.noEdit})
      wx.hideNavigationBarLoading() //完成停止加载
    },2000)
    console.log(e)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  switchBtn: function(){
    this.setData({noEdit: !this.data.noEdit})
  },
  postImg:function(){
    let noEdit =this.data.noEdit
    let that = this
    // if(noEdit){
    //   console.log('我点击修改不能用')
    // }else{
      console.log('我要修改图片')
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          console.log(res.tempFilePaths[0])
          let imgUrl = res.tempFilePaths[0]
          that.setData({
            headerImg:imgUrl
          })
          let tokenInfo = wx.getStorageSync('tokenInfo')
          wx.uploadFile({
            url: 'http://106.12.205.91:9000/sheying/sys/file/upload?dir=-1',
            header: { 'token': tokenInfo.token },
            filePath: imgUrl,
            method: 'post',
            name: 'file',
            success: (res) => {
              console.log(res)
              let srcUrlTwo = JSON.parse(res.data)
              that.setData({
                postImg:srcUrlTwo.fileName
              })
            }
          })
        }
      })
    // }
   
  },
  bindDataChange:function(e){
    console.log(e.detail.value)
    let msgM = this.data.infoList
    msgM[2].value = e.detail.value
    this.setData({
      infoList:msgM
    })
  },
  open:function(e){
    console.log(e)
    let msgM = this.data.infoList
    msgM[4].value = e.detail.value
    this.setData({
      infoList:msgM
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('sessionInfo'))
    let msg = wx.getStorageSync('sessionInfo')
    let msgM = this.data.infoList
    msgM[0].value = msg.nickName
    msgM[1].value = msg.gender == 1 ? '男' : '女'
    msgM[2].value = '1997-02-11'
    msgM[3].value = msg.phone
    msgM[4].value = msg.country
    this.setData({
      infoList:msgM
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