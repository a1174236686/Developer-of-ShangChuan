//index.js
//获取应用实例

const app = getApp();
const computedBehavior = require('miniprogram-computed')


Page({
  behaviors: [computedBehavior],
  data: {
    topImgData:{
      src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg', mode: 'scaleToFill'
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
      Gender: '',
      PhoneNumber: '',
      birthday: '',
      IDImgFront: '',
      IDImgback: '',
      name: '',
      adrees:'',
    },
    /**
     * mapping 映射formDataMap的key和dom对象的id
     * render  指定渲染模板的name 非必填项
     */
    formData: [
      { label: '姓名', placeholder: '请输入您的真实姓名', mapping: 'name' },
      { label: '性别', placeholder: '请输入支付宝姓名', mapping: 'Gender' },
      { label: '电话', placeholder: '请输入您的电话号码', mapping: 'PhoneNumber' },
      { label: '出身日期', render: 'pickerDate', mapping: 'birthday' },
      { label: '身份证号码', placeholder: '请输入您的身份证号码', mapping: 'id' },
      { label: '地址', render: 'adress', mapping: 'adrees' },
    ],
    IDImgData: [
      { src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg', mode: 'scaleToFill', mapping: 'IDImgFront' },
      { src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg', mode: 'scaleToFill', mapping: 'IDImgback' },
    ],
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
  getFormCheckObj:function (){
    const formCheckObj={
      /**
       * 表单校验配置
       * key需要和formDataMap的key对应
       * 支持配置两种校验规则 非空校验required和自定义校验validator
       */
      rules:{
        id:{ required: true,message:'需要错误信息可以配置我',validator:()=>{console.log('需要自定义校验可以在这里写')}},
        Gender: { required: true},
        PhoneNumber: { required: true},
        birthday: { required: true},
        IDImgFront: { required: true},
        IDImgback: { required: true},
        name: { required: true},
      },
      /**
       * 校验器
       */
      Check:()=>{
        let type=[];
        const {rules} = formCheckObj;
        const map = this.data.formDataMap;
        
        for(const key in rules){
          const rule=rules[key];
          const mapValue=map[key];
          const {required,validator,message} = rule;
         
          if(required){
            if(!mapValue) {
              console.log(message)
            }else{
              console.log(map)
              type.push(true)

            }
          } else if(validator){
            console.log('自定义校验');
          }
        }
        if(type.length == '7'){
          // console.log(type)
          // console.log('全部正确')
          wx.request({
            url: app.globalData.serverUrl+'/photographerapply/save',
            header: app.globalData.header,
            method: 'post',
            data: {
              platform: 'wx',
                 name:map.name,//姓名
                 province:'440000',//省编码
                 city:'440300 ',//市编码
                 area:'440307 ',//区编码
                 sex:map.Gender,//性别
                 phone:map.PhoneNumber,//手机号码
                 birthDate:map.birthday,//出生年月
                 idCardNumber:map.id,//省份证号
                 idCardPhoto1:map.IDImgFront[0],//身份证正面照
                 idCardPhoto2:map.IDImgback[0]//身份证背面照
            },
      
            success: function(result) {
              console.log(result)
           
      
            }
          })
        }
      }
     
    }
    this.getFormCheckObj=()=>formCheckObj;
    // 保证formCheckObj只会创建一次
    return formCheckObj;
  },

  bindDataChange: function (e) {
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
        obj[target.id] = tempFilePaths;
        for (let i = 0, len = IDImgData.length; i < len; i++) {
          if (IDImgData[i].mapping === target.id) {
            IDImgData[i].src = tempFilePaths;
            break;
          }
        }
        this.setData({
          IDImgData,
          formDataMap: { ...this.data.formDataMap, ...obj }
        })
      }
    })
  },
  // 地址选择
  open:function(){
    console.log('1234')
  },
  submitForm:function(){
    const {Check}=this.getFormCheckObj();
    Check();
  }
})
