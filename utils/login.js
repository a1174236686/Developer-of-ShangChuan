import {http} from './util'

//登录 微信login 返回微信code 
const login = ()=>{
  return new Promise((re,rj)=>{
    wx.login({
      success(res){
        re(res.code);
      },
      fail(){
        rj()
      }
    })
  })
};

//我的登录 返回token 
const getToken =  (obj)=>{
  let send = {
    code: obj.code,
    rawData:obj.rawData,
    signature: obj.signature,
    encryptedData: obj.encryptedData,
    iv: obj.iv,
  }

  return  http.post('/wx/login',{data:send}).then(re=>re);//返回token
}

//获取 session
const getSession = (token=null)=>{
  token = token ||  wx.getStorageSync('tokenInfo').token
  return http.init({  url:'/wxuser/session',  method:"GET",  header: {"token":token} }).then(res=>{
    if(res.code===0){
      return res.wxUser; //返回session信息
    }
  })
}

//最终登录
const loginSystem = async (obj,callback=null,er=null)=>{
    try { 
      let {userInfo,rawData,signature,encryptedData,iv} = obj;
      let code = await login(); //获取到用户code
      //console.log('获取到code',code)
      let token = await getToken({code,rawData,signature,encryptedData,iv}); //获取token
     // console.log('获取到token',token)
      let session = await getSession(token.token); //获取session  信息
    //  console.log('获取到session',session);
      //存储用户信息
      wx.setStorageSync('userInfo',userInfo)
      //存储用户code
     // wx.setStorageSync('temporaryCode',code);
      //存储token 
      wx.setStorageSync('tokenInfo',token);
      //存储session  信息
      wx.setStorageSync('sessionInfo',session);
      if(callback){
        callback()
      }
    } catch (error) {
        console.log('登录出现错误',error);
        if(er){
          er(error);
        }
    }

}





module.exports = {
  login,
  getToken,
  loginSystem,
  getSession


}