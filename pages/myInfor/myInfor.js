// pages/myInfor/myInfor.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerImg:'../../img/faxian.png',
    postImg:'',
    cameramanId:'',
    userMsg:'',//info信息
    infoList: [
      {icon: '',name: '姓名', value: '张三', type: 'name'},
      {icon: '',name: '性别', value: '李四', type: 'sex',sexType:''},
      {icon: '',name: '出生日期', value: '王五', type: 'date'},
      {icon: '',name: '电话', value: '六六', type: 'phone'},
      {icon: '',name: '区域', value: {value:'DDD'}, type: 'region'}],
      noEdit: true,
      sexArr: [{ key: '男', map: { label: '男', key: '1' } }, { key: '女', map: { label: '女', key: '2' } }] 
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
      if(!noEdit){
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
      }
     
    // }
   
  },
  //修改出生日期
  bindDataChange:function(e){
    console.log(e.detail.value)
    let msgM = this.data.infoList
    msgM[2].value = e.detail.value
    this.setData({
      infoList:msgM
    })
  },
  //修改地址
  open:function(e){
    console.log(e)
    let msgM = this.data.infoList
    msgM[4].value = e.detail
    this.setData({
      infoList:msgM
    })
  },
  //修改性别
  sexSelect:function(e){
    console.log(e)
    let msgM = this.data.infoList
    console.log(this.data.infoList)
    msgM[1].value = this.data.sexArr[e.detail.value].map.label
    msgM[1].sexType = this.data.sexArr[e.detail.value].map.key
    this.setData({
      infoList:msgM
    })
  },
  inputValue:function(e){
    console.log(e)
    let msgM = this.data.infoList
    console.log(this.data.infoList)
    if(e.currentTarget.dataset.value == 'name'){
      msgM[0].value = e.detail.value
    }else if(e.currentTarget.dataset.value == 'phone'){
      msgM[3].value = e.detail.value
    }
    // msgM[0].value = e.detail.value
    this.setData({
      infoList:msgM
    })
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
    console.log(this.data.infoList)
    let upDate = [];
    upDate.header = this.data.postImg
    upDate.name = e.detail.value.name
    upDate.sex = this.data.infoList[1].sexType
    upDate.time = this.data.infoList[2].value
    upDate.phone = e.detail.value.phone
    upDate.adress = this.data.infoList[4].value.code
    upDate.cameramanId = this.data.cameramanId
    // upDate.isPhotographer = userMsg.isPhotographer
    console.log(upDate)
    for(let key in upDate){
      if(!upDate[key] && !upDate[key].length){
        return false
      }
    }
    console.log('456')
    let tokenInfo = wx.getStorageSync('tokenInfo')
    wx.request({
      url: app.globalData.serverUrl + '/wxuser/update',
      header: { 'token': tokenInfo.token },
      method: 'post',
      data: {
        open_id:upDate.cameramanId,//用户ID
        nick_name: upDate.name,//姓名
        avatar_url:upDate.header,//头像
        province:upDate.adress[0], //省编码
        city: upDate.adress[1],//市编码
        area:upDate.adress[2],//区编码
        gender: upDate.sex,//性别
        phone: upDate.phone,//手机号码
        birth_date: upDate.time,//出生年月
      },

      success: function (result) {
        console.log(result)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('sessionInfo'))
    let msg = wx.getStorageSync('sessionInfo')
    let userMsg = wx.getStorageSync('sessionInfo')
    let msgM = this.data.infoList
    msgM[0].value = msg.nickName
    msgM[1].value = msg.gender == 1 ? '男' : '女'
    msgM[1].sexType = msg.gender
    msgM[2].value = '1997-02-11'
    msgM[3].value = msg.phone
    msgM[4].value.value = msg.country
    this.setData({
      infoList:msgM,
      headerImg:msg.avatarUrl,
      postImg:msg.avatarUrl,
      cameramanId:userMsg.openId,
      userMsg:userMsg
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