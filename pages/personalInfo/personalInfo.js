// pages/personalInfo/personalInfo.js
const app = getApp();
const { switchLevel } = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    imgList: [],
    tarList: [{ name: '视频', type: 1 }, { name: '图片', type: 2 }],
    currentType: 2,
  },

  switchBar: function (e) {
    this.setData({ currentType: e.currentTarget.dataset.type });
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
    const tokenInfo = wx.getStorageSync('tokenInfo')
    wx.request({
      url: app.globalData.serverUrl + '/photographer/info/7838155c-90ec-44ed-99c3-0bde13cbf523',
      header: { 'token': tokenInfo.token },
      success: result => {
        this.machiningRes(result.data.biPhotographer);
        const biPhotographer = result.data.biPhotographer;
        this.setData({ biPhotographer }, () => this.getVideoList())
      }
    })
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
    wx.showToast({ title: '加载中....', icon: 'loading' });
    const { currentType } = this.data;
    switch (currentType) {
      case 1:
        this.getVideoList();
        break;
      case 2:
        this.getImgList();
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 加工一下后台数据
   */
  machiningRes: function (res) {
    res.level = switchLevel(res.level);
  },




  /**
   * 请求视频
   */
  getVideoList: function () {
    const tokenInfo = this.getToken();
    const videoPageinfo = this.getVideoPageinfo();
    const { page, limit } = videoPageinfo;
    if (page > 5) {
      wx.showToast({ title: '我一滴也没有了', icon: 'none' });
      return;
    }
    wx.request({
      url: app.globalData.serverUrl + '/video/page',
      header: { 'token': tokenInfo.token },
      data: {
        page: 1,
        limit,
        userCode: this.data.biPhotographer.userCode
      },
      success: result => {
        const resVideoList = result.data.data;
        const currentVideoList = this.data.videoList
        // const videoList = currentVideoList.concat(resVideoList);
        let videoList = this.data.videoList;
        for (let i = 0; i < 5; i++) {
          videoList = videoList.concat(resVideoList);
        }
        this.setData({ videoList }, () => videoPageinfo.page++)
      }
    })
  },

  /**
   * 请求图片
   */
  getImgList: function () {
    const tokenInfo = this.getToken();
    const imgPageinfo = this.getImgPageinfo();
    const { page, limit } = imgPageinfo;
    const { userCode } = this.data.biPhotographer;
    if (page > 5) {
      wx.showToast({ title: '我一滴也没有了', icon: 'none' });
      return;
    }
    wx.request({
      url: app.globalData.serverUrl + '/video/photo',
      header: { 
        'token': tokenInfo.token ,
      },
      data: {
        page: 1,
        limit,
        userCode
      },
      success: result => {
        const resImgList = result.data.data;
        const currentImgList = this.data.videoList
        // const videoList = currentVideoList.concat(resVideoList);
        let imgList = [];
        for (let i = 0; i < 5; i++) {
          imgList = imgList.concat(imgList);
        }
        this.setData({ imgList }, () => imgPageinfo.page++)
      }
    })
  },

  getToken: function () {
    return wx.getStorageSync('tokenInfo')
  },

  /**
   * 视频分页信息
   */
  getVideoPageinfo: function () {
    const VideoPageinfo = {
      page: 1,
      limit: 5,
    }
    this.getVideoPageinfo = () => VideoPageinfo;
    return VideoPageinfo;
  },

  /**
   * 图片分页信息
   */
  getImgPageinfo: function () {
    const imgPageinfo = {
      page: 1,
      limit: 5,
    }
    this.getImgPageinfo = () => imgPageinfo;
    return imgPageinfo;
  },

  /**
   * 上传作品
   */
  uploadWork: function () {
    const { currentType } = this.data;
    switch (currentType) {
      case 1:
        // this.getVideoList();
        break;
      case 2:
        this.uploadImg();
        break;
    }
  },

  /**
   * 上传图片
   */
  uploadImg:function(){
    const { tempFilePaths } = res
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('我选择了图片',res)
        wx.uploadFile({
          // url: app.globalData.url + 'enquiryx/n3_reportfileupload.php',
          url: 'http://106.12.205.91:9000/sheying/sys/file/upload?dir=-1',
          header: { 'token': tokenInfo.token },
          filePath: tempFilePaths[0],
          method: 'post',
          name: 'file',
          success: (res) => {
           console.log(res)
          }
        })
      }
    })
  }
  
})