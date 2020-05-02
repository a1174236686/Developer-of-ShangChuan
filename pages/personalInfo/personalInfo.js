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
    this.setData({ currentType: e.currentTarget.dataset.type },() => this.getWork());
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const tokenInfo = wx.getStorageSync('tokenInfo');
    console.log('tokenInfo',tokenInfo)
    wx.request({
      url: app.globalData.serverUrl + '/photographer/info/d6545779-7d94-4c83-926a-80f0368dd791',
      header: { 'token': tokenInfo.token },
      success: result => {
        this.machiningRes(result.data.biPhotographer);
        const biPhotographer = result.data.biPhotographer;
        this.setData({ biPhotographer }, () => this.getWork())
      }
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({ title: '加载中....', icon: 'loading' });
    this.getWork()
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
        page,
        limit,
        photographerCode: this.data.biPhotographer.userCode
      },
      success: result => {
        const resVideoList = result.data.data;
        const currentVideoList = this.data.videoList
        const videoList = currentVideoList.concat(resVideoList);
        console.log('videoList',videoList)
        this.setData({ videoList }, () => videoPageinfo.page++)
      }
    })
  },

  /**
   * 请求图片
   */
  getImgList: function () {
    const tokenInfo = this.getToken();
    console.log('tokenInfo',tokenInfo)
    const imgPageinfo = this.getImgPageinfo();
    const { page, limit } = imgPageinfo;
    const { userCode } = this.data.biPhotographer;
    if (page > 5) {
      wx.showToast({ title: '我一滴也没有了', icon: 'none' });
      return;
    }
    wx.request({
      url: app.globalData.serverUrl + '/photo/page',
      header: { 
        'token': tokenInfo.token ,
      },
      data: {
        page: page,
        limit,
        userCode
      },
      success: result => {
        console.log('result',result)
        const resImgList = result.data.data;
        const currentImgList = this.data.imgList;
        const imgList = currentImgList.concat(resImgList);
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
        this.uploadVideo();
        break;
      case 2:
        this.uploadImg();
        break;
    }
  },

  getWork:function(){
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
   * 上传图片
   */
  uploadImg:function(){
    const tokenInfo = this.getToken();
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('11111111111111')
        const { tempFilePaths } = res
        wx.uploadFile({
          // url: app.globalData.url + 'enquiryx/n3_reportfileupload.php',
          url: 'http://106.12.205.91:9000/sheying/sys/file/upload?dir=-1',
          header: { 'token': tokenInfo.token },
          filePath: tempFilePaths[0],
          method: 'post',
          name: 'file',
          success: (res) => {
            console.log('22222222222222')
            console.log('res',res);
            const obj = JSON.parse(res.data);
            const { userCode } = this.data.biPhotographer;
            wx.request({
              url: app.globalData.serverUrl + '/photo/save',
              header: {
                'token': tokenInfo.token ,
              },
              data: {
                workName:obj.fileName,
                fileName:obj.fileName,
                userCode
              },
              method:"POST",
              success: result => {
                console.log(33333333333333333)
                console.log('result',result);
              }
            })
          }
        })
      }
    })
  },

   /**
   * 上传视屏
   */
  uploadVideo:function(){
    const tokenInfo = this.getToken();
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success: res => {
        const { tempFilePath } = res
        wx.uploadFile({
          url:app.globalData.serverUrl+'/sys/file/upload?dir=-1',
          header: { 'token': tokenInfo.token },
          filePath: tempFilePath,
          method: 'post',
          name: 'file',
          success: res => {
            console.log('是这个res吗',res);
            const obj = JSON.parse(res.data);
            const { userCode } = this.data.biPhotographer;
            wx.request({
              url: app.globalData.serverUrl + '/video/save',
              header: {
                'token': tokenInfo.token ,
              },
              data: {
                workName:obj.fileName,
                fileName:obj.fileName,
                userCode
              },
              method:"POST",
              success: result => {
                console.log(33333333333333333)
                console.log('result',result);
              }
            })
          }
        })
      }
    })
  }
  
})