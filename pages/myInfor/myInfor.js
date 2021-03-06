// pages/myInfor/myInfor.js
const app = getApp();
import {avatarUrlFn,http} from '../../utils/util';
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
      {icon: serverUrl + '/statics/image/xingming.png',name: '姓名', value: '', type: 'name',key: 'name'},
      {icon: serverUrl + '/statics/image/nvx.png',name: '性别', value: '', type: 'sex',sexType:'',key: 'gender'},
      {icon: serverUrl + '/statics/image/riqi.png',name: '出生日期', value: '', type: 'date',key: 'birthDate'},
      {icon: serverUrl + '/statics/image/shouji.png',name: '电话', value: '', type: 'phone',key: 'phone'},
      {icon: serverUrl + '/statics/image/quyu.png',name: '区域', value: {value:'DDD'}, type: 'region'}],
      noEdit: false, 
      date: '',
      sexText: '',
      sexArray: ['男','女'],
      sexIndex: 0,
      regionData: {code: [],value: []}
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
            wx.showLoading({title: '上传中...',})
            wx.uploadFile({
              url: app.globalData.serverUrl + '/sys/file/upload?dir=-1',
              header: { 'token': tokenInfo.token },
              filePath: imgUrl,
              method: 'post',
              name: 'file',
              success: (res) => {
                wx.hideLoading();
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
    this.setData({regionData: e.detail})
  },
  //修改性别
  sexSelect:function(e){
    this.setData({sexIndex: e.detail.value})
  },
  formSubmit: function (e) {
    let vm = this;
    let data = {
      //open_id: this.data.cameramanId,//用户ID
      name: e.detail.value.name,//姓名
      avatarUrl: this.data.postImg,//头像
      province: this.data.regionData.code[0] || '', //省编码
      city: this.data.regionData.code[1] || '',//市编码
      area: this.data.regionData.code[2] || '',//区编码
      sex: this.data.sexArray[this.data.sexIndex] == '男' ? '1' : '2',//性别
      phone: e.detail.value.phone,//手机号码
      birthDate: this.data.date,//出生年月
    }
    for(let key in data){
      if(!data[key] && !data[key].length){
        wx.showToast({ title: '请完善数据！', icon: 'none' });
        return false
      }
    }
    let tokenInfo = wx.getStorageSync('tokenInfo')
    wx.request({
      url: app.globalData.serverUrl + '/photographer/updateMine',
      header: { 'token': tokenInfo.token },
      method: 'post',
      data: data,
      success: async function (result) {
        //let wxUser =  await getSession();//获取session
        //wx.setStorageSync('sessionInfo',wxUser);
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
    let obj =  wx.getStorageSync('syDetails');
    for(let i = 0;i < arr.length;i++){
      let item = arr[i];
      item.value =  obj[item.key] || ''
    }
    let regionData = {
      code: obj.area ? [obj.province || '',obj.city || '',obj.area || ''] : [],
      value: obj.areaName ? [obj.provinceName + '省' || '',obj.cityName + '市' || '',obj.areaName || ''] : []
    }
    this.setData({
      infoList:arr,
      headerImg: avatarUrlFn(obj.avatarUrl),
      postImg: obj.avatarUrl,
      userMsg: obj,
      date: obj.birthDate || '',
      sexIndex: obj.sex == 1 ? 0 : 1,
      regionData: regionData
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