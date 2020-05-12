//index.js
//获取应用实例

const app = getApp();
const computedBehavior = require('miniprogram-computed')
const serverUrl = app.globalData.serverUrl


Page({
  behaviors: [computedBehavior],
  data: {
    serverUrl: serverUrl,
    topImgData: {
      src: serverUrl + '/statics/image/joinMe.png', mode: 'scaleToFill'
    },
    /**
     * 表单数据绑定对象
     * id 身份证号码
     * Gender 性别
     * PhoneNumber 电话号码
     * birthday 出生日期
     * IDImgFront 身份证正面
     * IDImgback 身份证反面
     * name 姓名
     */
    formDataMap: {
      id: '',
      //Gender: '',
      PhoneNumber: '',
      birthday: '',
      IDImgFront: '',
      IDImgback: '',
      name: '',
      adrees: '',
      sex:'',

    },
    adreesNumber: '',
    /**
     * mapping 映射formDataMap的key和dom对象的id
     * render  指定渲染模板的name 非必填项
     */
    formData: [
      { label: '姓名', placeholder: '请输入您的真实姓名', mapping: 'name' },
      { label: '性别', render: 'sex', mapping: 'sex', arr: [{ key: '男', map: { label: '男', key: '1' } }, { key: '女', map: { label: '女', key: '2' } }],serverUrl },
      { label: '电话', placeholder: '请输入您的电话号码', mapping: 'PhoneNumber' ,type: 'number' },
      { label: '出生日期', render: 'pickerDate', mapping: 'birthday',serverUrl },
      { label: '身份证号码', placeholder: '请输入您的身份证号码', mapping: 'id',type: 'idcard' },
      { label: '地址', render: 'adress', mapping: 'adrees' ,serverUrl},
    ],

    IDImgData: [
      { src: serverUrl + '/statics/image/idjoinMe.png', mode: 'scaleToFill', mapping: 'IDImgFront', baseSrc: '' },
      { src: serverUrl + '/statics/image/idjoinMetwo.png', mode: 'scaleToFill', mapping: 'IDImgback', baseSrc: '' },
    ],
  },
  onLoad: function () {
    let formDataN = this.data.formDataMap
    let userMsg = wx.getStorageSync('sessionInfo')
    formDataN.name = userMsg.nickName
    this.setData({
      formDataMap: formDataN
    })

  },

  computed: {
    getFormCardData: function (data) {
      const { formData } = data;
      const minArrMaxLength = 4;
      const arr = []
      let minArr = []
      formData.forEach(c => {
        if (minArr.length === minArrMaxLength) {
          minArr = []
        }
        if (minArr.length === 0) {
          arr.push(minArr)
        }
        minArr.push(c)
      })
      return arr
    },
  },
  /**
   * 表单校验对象
   */
  getFormCheckObj: function () {
    const formCheckObj = {
      /**
       * 表单校验配置
       * key需要和formDataMap的key对应
       * 支持配置两种校验规则 非空校验required和自定义校验validator
       */
      rules: {
        // id: { required: true, message: '需要错误信息可以配置我', validator: () => { console.log('需要自定义校验可以在这里写') } },
        // Gender: { required: true },
        PhoneNumber: { required: true },
        birthday: { required: true },
        IDImgFront: { required: true },
        IDImgback: { required: true },
        name: { required: true },
      },
      /**
       * 校验器
       */
      Check: () => {
        console.log(this.data.formDataMap)
        const { rules } = formCheckObj;
        const map = this.data.formDataMap
        console.log(rules)
        for (const key in rules) {
          const rule = rules[key];
          const mapValue = map[key];
          const { required, validator, message } = rule;

          if (required) {
            if (!mapValue) {
              // console.log(message)
              return false;
            }
          } else if (validator) {
            console.log('自定义校验');
          }
        };

        return true;

      }

    }
    this.getFormCheckObj = () => formCheckObj;
    // 保证formCheckObj只会创建一次
    return formCheckObj;
  },

  bindDataChange: function (e) {
    console.log(e)
    const { target, detail } = e;
    const obj = {};
    obj[target.id] = detail.value;
    this.setData({
      formDataMap: { ...this.data.formDataMap, ...obj }
    })
  },
  pickIDImg: function (e) {

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const { tempFilePaths } = res
        const IDImgData = JSON.parse(JSON.stringify(this.data.IDImgData));
        const { target } = e;
        const obj = {};
        let tokenInfo = wx.getStorageSync('tokenInfo')
        console.log(tokenInfo)

        obj[target.id] = IDImgData;
        for (let i = 0, len = IDImgData.length; i < len; i++) {
          if (IDImgData[i].mapping === target.id) {
            IDImgData[i].src = tempFilePaths;
            wx.uploadFile({
              url:app.globalData.serverUrl+'/sys/file/upload?dir=-1',
              header: { 'token': tokenInfo.token },
              filePath: tempFilePaths[0],
              method: 'post',
              name: 'file',
              success: (res) => {
                let text = JSON.parse(res.data)
                IDImgData[i].baseSrc = text.fileName
                obj[target.id] = text.fileName;
                console.log(text)
                this.setData({
                  formDataMap: { ...this.data.formDataMap, ...obj }
                })
                console.log(this.data.formDataMap)
              }
            })
            // wx.getFileSystemManager().readFile({
            //   filePath: tempFilePaths[0],
            //   encoding: "base64",
            //   success: data => {
            //     IDImgData[i].baseSrc = data.data
            //     obj[target.id] = data.data;
            //     console.log(data.data)
            //     this.setData({
            //       formDataMap: { ...this.data.formDataMap, ...obj }
            //     })
            //   }
            // })
            break;
          }
        }
        this.setData({
          IDImgData,
          // formDataMap: { ...this.data.formDataMap, ...obj }
        })
        console.log('obj', obj)
      }
    })
  },
  //性别选择器
  sexSelect:function(e){
    let index = e.detail.value
    const { target, detail } = e;
    const obj = {};
    obj[target.id] = this.data.formData[1].arr[index].map ;
    this.setData({
      formDataMap: { ...this.data.formDataMap, ...obj },
    })
  },
  // 地址选择
  open: function (e) {
    const { target, detail } = e;
    const obj = {};
    obj[target.id] = detail.value;

    this.setData({
      formDataMap: { ...this.data.formDataMap, ...obj },
      adreesNumber: e.detail.code
    })
console.log(this.data.formData)
  },
  postMsg: function () {
    // console.log(this.data.formDataMap)
    let map = this.data.formDataMap
    let sex = parseInt(map.sex.key)
    let tokenInfo = wx.getStorageSync('tokenInfo')
    wx.request({
      url: app.globalData.serverUrl + '/photographerapply/save',
      header: { 'token': tokenInfo.token },
      method: 'post',
      data: {
        // platform: 'wx',
        name: map.name,//姓名
        province: this.data.adreesNumber[0],//省编码
        city: this.data.adreesNumber[1],//市编码
        area: this.data.adreesNumber[2],//区编码
        sex: sex,//性别
        phone: map.PhoneNumber,//手机号码
        birthDate: map.birthday,//出生年月
        idCardNumber: map.id,//省份证号
        idCardPhoto1: map.IDImgFront,//身份证正面照
        idCardPhoto2: map.IDImgback//身份证背面照
      },

      success: function (result) {
        if (result.data.code == 0) {
          wx.showToast({ title: '提交成功,24小时内审核!', icon: 'none',mask: true});
          setTimeout(function() {
            wx.navigateBack()
          },1500)
        }else{
          wx.showToast({ title: result.data.msg, icon: 'none'});
        }
      }
    })
  },
  submitForm: function () {
    const { Check } = this.getFormCheckObj();
    const res = Check();
    if(!res){
      wx.showToast({
        title: '请完善信息！',
        icon: 'none'
      })
    }
    res && this.postMsg();
    // this.postMsg()
  }
})
