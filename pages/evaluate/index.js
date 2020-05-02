// pages/evaluate/index.js
Page({
  data: {
      files: [{
        url: 'http://mmbiz.qpic.cn/mmbiz_png/VUIF3v9blLsicfV8ysC76e9fZzWgy8YJ2bQO58p43Lib8ncGXmuyibLY7O3hia8sWv25KCibQb7MbJW3Q7xibNzfRN7A/0',
    }],
    formDataMap: {
        professional: 3.7,
        service: 0,
        responseSpeed: 0,
      },
    evaluateDimensionArr: [
        {title:'专业度',starsSize:'45rpx',mapping:'professional'},
        {title:'服务态度',starsSize:'45rpx',mapping:'service'},
        {title:'响应速度',starsSize:'45rpx',mapping:'responseSpeed'}
    ],
    
  },
  
  onLoad(option) {
     // console.log(option);
      this.setData({
          selectFile: this.selectFile.bind(this),
          uplaodFile: this.uplaodFile.bind(this),
          rateChangeCallBack:this.rateChangeCallBack.bind(this)
      })
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