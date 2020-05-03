// pages/releaseWorks/releaseWorks.js
import { http } from '../../utils/util'
import { uploadFile } from '../../utils/util'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    videoSrc:'',
    textareaValue:'',
    fileName:'',
    currentType: 1,
    formDataMap:{
      videoFileName:'',
    }
  },

  clearSrc:function(){
    this.setData({imgSrc:'',videoSrc:''});
  },

  choice:function(){
    this.uploadWork();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('photographerCode',data=>{
      this.setData({...data})
    })
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

  /**
   * 上传图片
   */
  uploadImg: function () {
    let vm = this;
    wx.chooseImage({sourceType: 'album',
    success:async function(e){
      const Path = e.tempFilePaths[0];
      const res =  await uploadFile(Path);
      const fileName = res.fileName;
      const imgSrc = `${app.globalData.serverUrl}/sys/file/previewImg?fileName=${fileName}`;
      vm.setData({imgSrc,fileName})
    },fail:function(e){
    }})
  },

   /**
   * 上传视频
   */
  uploadVideo: function () {
    let vm = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: async e => {
        const Path = e.tempFilePath;
        wx.showToast({ title: '上传中...', icon: 'loading',mask:true});
        const res =  await uploadFile(Path);
        const videoFileName = res.fileName;
        const videoSrc = `${app.globalData.serverUrl}/sys/file/previewImg?fileName=${videoFileName}`;
        const formDataMap = {...this.data.formDataMap,videoFileName}
        vm.setData({videoSrc,formDataMap})
      }
    })
  },

  bindDataChange: function (e) {
    this.setData({textareaValue:e.detail.value})
  },

  /**
   * 添加作品
   */
  addWork: function () {
    const { currentType } = this.data;
    switch (currentType) {
      case 1:
        this.addVideo();
        break;
      case 2:
        this.addImg();
        break;
    }
  },

  addImg:async function (){
    const { textareaValue,fileName,photographerCode } = this.data;
    const res = await http.post("/photo/save", { data: {
      workName: textareaValue,
      fileName: fileName,
      photographerCode
    }});
    wx.navigateTo({
      url: '/pages/personalInfo/personalInfo',
      success: function(res) {
        res.eventChannel.emit('photographerCode', {
            photographerCode
          })
      }
    })
  },

  addVideo:async function (){
    const { textareaValue,photographerCode } = this.data;
    const { videoFileName } = this.data.formDataMap;
    const res = await http.post("/video/save", { data: {
      workName: textareaValue,
      fileName: videoFileName,
      photographerCode
    }});
    wx.navigateTo({
      url: '/pages/personalInfo/personalInfo',
      success: function(res) {
        res.eventChannel.emit('photographerCode', {
            photographerCode
          })
      }
    })
  },

  submitForm:async function (){
    this.addWork();
  }
})