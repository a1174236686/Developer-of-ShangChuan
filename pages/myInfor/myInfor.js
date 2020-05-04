// pages/myInfor/myInfor.js
const app = getApp();
import {getSession} from '../../utils/login'
const serverUrl = app.globalData.serverUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: serverUrl,
    headerImg:'../../img/faxian.png',
    postImg:'',
    cameramanId:'',
    userMsg:'',//info信息
    infoList: [
      {icon: serverUrl + '/statics/image/xingming.png',name: '姓名', value: '', type: 'name',key: 'nickName'},
      {icon: serverUrl + '/statics/image/nvx.png',name: '性别', value: '', type: 'sex',sexType:'',key: 'gender'},
      {icon: serverUrl + '/statics/image/riqi.png',name: '出生日期', value: '', type: 'date',key: 'birthDate'},
      {icon: serverUrl + '/statics/image/shouji.png',name: '电话', value: '', type: 'phone',key: 'phone'},
      {icon: serverUrl + '/statics/image/quyu.png',name: '区域', value: {value:'DDD'}, type: 'region'}],
      noEdit: false, 
      region: [],
      date: '',
      sexText: '',
      regionCode: [],
      sexArray: ['男','女'],
      sexIndex: 0 
  },

  

  switchBtn: function(){
    this.setData({noEdit: !this.data.noEdit})
  },
  postImg:function(){
    let noEdit =this.data.noEdit
    let that = this
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
    this.setData({date: e.detail.value})
  },
  //修改地址
  open:function(e){
    this.setData({region: e.detail.value,regionCode: e.detail.code})
  },
  //修改性别
  sexSelect:function(e){
    this.setData({sexIndex: e.detail.value})
  },
  formSubmit: function (e) {
    let vm = this;
    let data = {
      open_id: this.data.cameramanId,//用户ID
      nick_name: e.detail.value.name,//姓名
      avatar_url: this.data.postImg,//头像
      province: this.data.regionCode[0] || '', //省编码
      city: this.data.regionCode[1] || '',//市编码
      area: this.data.regionCode[2] || '',//区编码
      gender: this.data.sexArray[this.data.sexIndex] == '男' ? '1' : '2',//性别
      phone: e.detail.value.phone,//手机号码
      birth_date: this.data.date,//出生年月
    }
    if(this.data.userMsg.isPhotographer == 1){
      data.address = e.detail.value.address;
      data.target = e.detail.value.target;
    }
    for(let key in data){
      if(!data[key] && !data[key].length){
        wx.showToast({ title: '请完善数据！', icon: 'none' });
        return false
      }
    }
    let tokenInfo = wx.getStorageSync('tokenInfo')
    wx.request({
      url: app.globalData.serverUrl + '/wxuser/update',
      header: { 'token': tokenInfo.token },
      method: 'post',
      data: data,
      success: async function (result) {
        let wxUser =  await getSession();//获取session
        wx.setStorageSync('sessionInfo',wxUser);
        wx.navigateBack();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    let arr = this.data.infoList;
    let obj =  wx.getStorageSync('sessionInfo')
    if(obj.isPhotographer == 1){
      let arr = this.data.infoList;
      let arr2 = [
      {icon: serverUrl + '/statics/image/map.png',name: '拍摄地点', value: '', type: 'address'},
      {icon: serverUrl + '/statics/image/paishe.png',name: '拍摄对象', value: '', type: 'target'}]
      arr.qcConcat(arr2,'type')
      this.setData({infoList: arr})
    }
    for(let i = 0;i < arr.length;i++){
      let item = arr[i];
      item.value =  obj[item.key] || ''
    }
    let regionCode = obj.area ? [obj.province || '',obj.city || '',obj.area || ''] : []
    this.setData({
      infoList:arr,
      headerImg: obj.avatarUrl,
      postImg: obj.avatarUrl,
      cameramanId: obj.openId,
      userMsg: obj,
      date: obj.birthDate,
      sexIndex: obj.gender == 1 ? 0 : 1,
      regionCode: regionCode
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