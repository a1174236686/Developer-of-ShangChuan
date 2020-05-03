// pages/evaluate/index.js
import {http,switchLevel} from '../../utils/util'
Page({
  data: {
      files: [{
        url: 'http://mmbiz.qpic.cn/mmbiz_png/VUIF3v9blLsicfV8ysC76e9fZzWgy8YJ2bQO58p43Lib8ncGXmuyibLY7O3hia8sWv25KCibQb7MbJW3Q7xibNzfRN7A/0',
    }],
    formDataMap: {
        professional: 0,
        service: 0,
        responseSpeed: 0,
      },
    evaluateDimensionArr: [
        {title:'专业度',starsSize:'45rpx',mapping:'professional'},
        {title:'服务态度',starsSize:'45rpx',mapping:'service'},
        {title:'响应速度',starsSize:'45rpx',mapping:'responseSpeed'}
    ],
    orderId:"",//订单id
    remark:"",
    info:{
        avatarUrl:"",//头像
        levelName:"",//等级
        score:0,//评分
        name:"",//名称
    },
  },
  onLoad(opt) {
      let info = JSON.parse(opt.info);
      console.log("初始化信息",info);
      http.get("/photographer/info/"+info.photographerCode).then(res=>{
          if(res.code===0){
              let biPhotographer = res.biPhotographer;
              let send = {
                avatarUrl:biPhotographer.avatarUrl,
                levelName:switchLevel(biPhotographer.level),
                score:biPhotographer.score, 
                name:biPhotographer.name
              }
              this.setData({info:send})
          }
          
      })
      this.setData({
          orderId:info.orderId,
          selectFile: this.selectFile.bind(this),
          uplaodFile: this.uplaodFile.bind(this),
          rateChangeCallBack:this.rateChangeCallBack.bind(this)
      })
  },
  //输入建议
  remarkInput(e){
    this.setData({
        remark:e.detail.value
    })
  },
  //发布
 async  submitForm(){
      let {remark,orderId,formDataMap} = this.data;
      let send = {
        orderId:orderId,//	是	string	订单号
        professionScore:formDataMap.professional,//	是	double	专业度评分
        serviceScore:formDataMap.service,//	是	double	服务态度评分
        responseScore:formDataMap.responseSpeed,//	是	double	响应速度评分
        suggestion:remark,//	是	string	建议
      }

       
      let res = await http.post("/evaluate/save",{data:send});
      if(res.code===0){
          wx.showToast({
            title: '评价成功',
            icon:"none"
          })
          wx.reLaunch({
            url: '../userOrder/userOrder',
          })
      }

  },
  selectFile(files) {
      console.log('files', files)
      return true;
  },
  uplaodFile(files) {
      console.log('upload files', files)
      const {tempFilePaths} = files; 
      return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({urls:tempFilePaths})
            //   reject('some error')
          }, 1000)
      })
  },
  uploadError(e) {
      console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
      console.log('upload success', e.detail)
  },
  rateChangeCallBack({flag,e}){
      const obj = {};
      obj[flag] = e.currentTarget.dataset.param;
      this.setData({
        formDataMap: { ...this.data.formDataMap, ...obj }
      })
  }
});