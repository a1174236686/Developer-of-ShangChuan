// pages/personalInfo/personalInfo.js
const app = getApp();
const { switchLevel } = require('../../utils/util');
import { http,avatarUrlFn } from '../../utils/util'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    imgList: [],
    tarList: [{ name: '视频', type: 1 }, { name: '图片', type: 2 }],
    currentType: 1,
    isManage: false,
    hiddenPickBox: true,
    serverUrl:app.globalData.serverUrl,
    showGallery: false,
    gallerydData: []
  },

  switchBar: function (e) {
    this.setData({ currentType: e.currentTarget.dataset.type }, () => this.workListInit());
  },

  switchManage: function () {
    this.setData({ isManage: !this.data.isManage });
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
    const sessionInfo = wx.getStorageSync('sessionInfo');
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('photographerCode', data => {
      const { photographerCode } = data;
      const { userCode } = sessionInfo;
      const showAddBtn = userCode === photographerCode;
      console.log('11111',photographerCode)
      this.setData({ photographerCode, showAddBtn })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const tokenInfo = wx.getStorageSync('tokenInfo');
    const { photographerCode } = this.data;
    wx.request({
      url: app.globalData.serverUrl + '/photographer/info/' + photographerCode,
      header: { 'token': tokenInfo.token },
      success: result => {
        this.machiningRes(result.data.biPhotographer);
        const biPhotographer = result.data.biPhotographer;
        biPhotographer.avatarUrl = avatarUrlFn(biPhotographer.avatarUrl)
        this.setData({ biPhotographer }, () => this.workListInit())
      }
    })
  },

  closeAdd:function(){
    this.setData({hiddenPickBox: true});
  },

  noClick: function(){
    return false
  },

  goEvaluate: function(){
    let that = this;
    wx.navigateTo({
      url: '../myEvaluate/myEvaluate',
      success: function(res) {
        res.eventChannel.emit('photographerCode', {
            photographerCode: that.data.photographerCode
        })
      }
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //wx.showToast({ title: '加载中....', icon: 'loading' });
    this.getWork()
  },

  /**
   * 加工一下后台数据
   */
  machiningRes: function (res) {
    res.level = switchLevel(res.level);
    console.log('res', res);
    // res.workNum = res.
  },

  /**
   * 请求视频
   */
  getVideoList: function () {
    const tokenInfo = this.getToken();
    const videoPageinfo = this.getVideoPageinfo();
    const { page, limit } = videoPageinfo;
    const { photographerCode } = this.data;
    wx.request({
      url: app.globalData.serverUrl + '/video/page',
      header: { 'token': tokenInfo.token },
      data: {
        page,
        limit,
        photographerCode
      },
      success: result => {
        const { total, list } = result.data.data;
        const currentVideoList = this.data.videoList;
        const index = currentVideoList.length;
        const resLength = list.length;
        if (index == total) {
          //wx.showToast({ title: '我是有底线的。。。', icon: 'none' });
          return;
        }
        const resVideoList = list;
        const videoList = currentVideoList.qcConcat(resVideoList, 'id');
        this.setData({ videoList }, () => resLength === limit && videoPageinfo.page++)
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
    const { photographerCode } = this.data;
    wx.request({
      url: app.globalData.serverUrl + '/photo/page',
      header: {
        'token': tokenInfo.token,
      },
      data: {
        page: page,
        limit,
        photographerCode
      },
      success: result => {
        const { total, list } = result.data.data;
        const currentImgList = this.data.imgList;
        const index = currentImgList.length;
        const resLength = list.length;
        if (index == total) {
          // wx.showToast({ title: '我是有底线的。。。', icon: 'none' });
          return;
        }
        const imgList = currentImgList.qcConcat(list, 'id');
        this.setData({ imgList }, () => resLength === limit && imgPageinfo.page++)
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
    this.setData({ hiddenPickBox: !this.data.hiddenPickBox })
  },

  pickWorkType: function (e) {
    const { photographerCode } = this.data;
    const currentType = parseInt(e.target.dataset.param);
    wx.navigateTo({
      url: '/pages/releaseWorks/releaseWorks',
      success: function (res) {
        res.eventChannel.emit('photographerCode', { photographerCode,currentType })
      }
    })
  },

  getWork: function () {
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

  workListInit: function () {
    const { currentType } = this.data;
    switch (currentType) {
      case 1:
        this.data.videoList.length<1&&this.getVideoList();
        break;
      case 2:
        this.data.imgList.length<1&&this.getImgList();
        break;
    }
  },


  deleteWork: function (e) {
    const self = this;
    wx.showModal({
      title: '温馨提示',
      content: '您确定删除吗？',
      success : res => {
        if (res.confirm) {
          const { currentType } = self.data;
          const id = e.target.dataset.param;
          switch (currentType) {
            case 1:
              self.deleteVideo({ id });
              break;
            case 2:
              self.deleteImg({ id });
              break;
          }
        }
      }
    })
  },

  deleteVideo: async function ({ id }) {
    const ids = [id]
    await http.post("/video/delete", { data: ids });
    this.setData({ videoList: this.data.videoList.filter(item => item.id != id) })
  },

  deleteImg: async function ({ id }) {
    const ids = [id]
    await http.post("/photo/delete", { data: ids });
    this.setData({ imgList: this.data.imgList.filter(item => item.id != id) })
  },

  openGallery: function (e) {
    let serverUrl = this.data.serverUrl;
    let item = e.target.dataset.param
    let index = [`${serverUrl}/sys/file/previewImg?fileName=${item.fileName}`];
    this.setData({showGallery: true,gallerydData: index})
  }
})