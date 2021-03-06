const app = getApp();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const switchWeek = date => {
	let week = ''
	switch (date) {
		case 0:
			week = '天';
			break;
		case 1:
			week = '一';
			break;
		case 2:
			week = '二';
			break;
		case 3:
			week = '三';
			break;
		case 4:
			week = '四';
			break;
		case 5:
			week = '五';
			break;
		case 6:
			week = '六';
			break;
		default:
			week = 'error';
			break;
	}
	return week
}

const switchJSON= json => {
	for (let key in json){
		if(!json[key] && !json[key].length){
			return false
		}
	}
  return true; 
}

	// 工具方法 - start
	// 1.为了获得每个月的日期有多少，我们需要判断 平年闰年[四年一闰，百年不闰，四百年再闰]
	const isLeapYear = (year) => {
		return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
	};
	// 2.获得每个月的日期有多少，注意 month - [0-11]
	const getMonthCount = (year, month) => {
		let arr = [
			31, null, 31, 30,
			31, 30, 31, 31,
			30, 31, 30, 31
		];
		let count = arr[month] || (isLeapYear(year) ? 29 : 28);
		return Array.from(new Array(count), (item, value) => value + 1);
	};
	// 3.获得某年某月的 1号 是星期几，这里要注意的是 JS 的 API-getDay() 是从 [日-六](0-6)，返回 number
	const getWeekday = (year, month) => {
		let date = new Date(year, month, 1);
		return date.getDay();
	};
	// 4.获得上个月的天数
	const getPreMonthCount = (year, month) => {
		if (month === 0) {
			return getMonthCount(year - 1, 11);
		} else {
			return getMonthCount(year, month - 1);
		}
	};
	// 5.获得下个月的天数
	const getNextMonthCount = (year, month) => {
		if (month === 11) {
			return getMonthCount(year + 1, 0);
		} else {
			return getMonthCount(year, month + 1);
		}
	};
	// 工具方法 - end
	//周
	let weekList = ['日', '一', '二', '三', '四', '五', '六']

	// 这里获得我们第一次的 数据 数组
	/* 
	 year 年
	  month 月
	  day 日
	 */
	const updateCalendar = (year=null, month=null, day=null) => {
		let nowDate = new Date();
		if(year===null){
			year = nowDate.getFullYear();
		}
		if(month===null){
			month = nowDate.getMonth();
		}
		if(day===null){
			day = nowDate.getDate();
		}
		//年月日信息
		let info = {
			year,
			month: month + 1,
			day,
			list: []
		}

		// 生成日历数据，上个月剩下的的 x 天 + 当月的 28（平年的2月）或者29（闰年的2月）或者30或者31天 + 下个月的 y 天 = 42
		let res = [];
		let currentMonth = getMonthCount(year, month);
		let preMonth = getPreMonthCount(year, month);
		let nextMonth = getNextMonthCount(year, month);
		let whereMonday = getWeekday(year, month);
		if (whereMonday === 0) {
			whereMonday = 7
		}
		// 这里当 whereMonday 为 0 的时候会截取上月的所有数据
		let preArr = preMonth.slice(-1 * whereMonday);
		if(preArr.length>=7){
			preArr = []; //如果上一个月数据 大于等于7 则不需要生成
		}
		//生成下一个月日期数据
		let nextLen = 42-currentMonth.length-whereMonday;
		if(nextLen>7){
			//如果下一个月的取大于7的值 则说明生成的下一个月的日期大于一行 => 所以 -7 清除一行
			nextLen = nextLen-7;
		}
		if(nextLen==7){
			nextLen = 0; //下一个日期正好一行 则不需要生成下个月数据
		}
	let nextArr = nextMonth.slice(0, nextLen);
	
		preArr = preArr.map(it=>{
			return {
				value:it,
				current:false,
				isDay:false,
				
			}
		})
		nextArr = nextArr.map(it=>{
			return {
				value:it,
				current:false,
					isDay:false
			}
		})
		currentMonth = currentMonth.map(it=>{
			return {
				value:it,
				current:true,
					isDay:it===day
			}
		})
		

		res = [].concat(preArr, currentMonth, nextArr);
		
		
	
		
		
	
		for (let i = 0; i < 6; i++) {
			let mylist = []
			for (let j = 0; j < 7; j++) {
				mylist.push(res.shift());
				if (j === 6) {
					info.list.push(mylist)
				}
			}
		}
		return info;
	
	};



	const http = {
	
		init(obj){
			return new Promise((re,rj)=>{

				let __url = app.globalData.serverUrl || null;
				if(__url){
						//有公共 url  请求地址 __url + obj.url 拼接
					__url = __url+  obj.url;
				}else{
					//没有公共url 直接用传入的 url 
					__url = obj.url;
				}

				wx.request({
					header: {"token": wx.getStorageSync('tokenInfo').token},
					...obj,
					url: __url,
					method: obj.method,
					data: obj.data,
					success (res) {
						if(res.data.code == 0){
								re(res.data);
						}else if(res.data.code==401){
							//session 过期  TODO 过期了
							// wx.showToast({
							// 	title: '401 需要重新登录',
							// 	icon:"none"
							// })
						}else{
							rj(res.data);
						
							
						}
						// if(res.data.code==500){
						// 	wx.showToast({
						// 		title: '返回500  '+ res.data.msg,
						// 		icon:"none"
						// 	})
						// }

					},
					fail(){
						rj()
					}
				})

			})


		},
		post(url,obj){
			return this.init({method:"POST",url,...obj})

		},
		get(url,data){
			return this.init({url:url,method:"GET",data:data})
		},


	}
	//根据id去重合并
	Array.prototype.qcConcat = function(array,key){
		let list = this;
		if(list.length===0){
			return array;
		}
		for(let i = 0 ; i < array.length ; i ++){
			let item = array[i];
			let bool = false;
			if(key){
				//根据id
				bool =  list.findIndex(it=>it[key]===item[key])===-1; //不在里面
			}else{
				bool =  list.findIndex(it=>it===item)===-1; //不在里面
			}
			if(bool){
				list.push(item);
			}
		}
		return list;
		 
 }

	//上传文件
	const uploadFile = (path)=>{
		return new Promise((re,rj)=>{
		 let tokenInfo = wx.getStorageSync('tokenInfo')
		 wx.uploadFile({
				 url:app.globalData.serverUrl+'/sys/file/upload?dir=-1',
				 header: { 'token': tokenInfo.token },
				 filePath: path,
				 method: 'post',
				 name: 'file',
				 success:(res)=>{
						 let resInfo = JSON.parse(res.data);		
						 if(resInfo.code===0){
								 re(resInfo);
						 }else{
							 rj()
						 }
						
				 },
				 fail(error){
					 rj();
				 }
		 })

		})
 }


	const switchLevel = level =>{
		let levelLabel = '';
		switch (level) {
			case 1:
				levelLabel = '初级摄影师';
				break;
			case 2:
				levelLabel = '中级摄影师';
				break;
			case 3:
				levelLabel = '高级摄影师';
				break;
		}
		return levelLabel
	} 

	const switchSex = sex => {
		let sexLabel = '';
		switch (sex) {
			case 1:
				sexLabel = '男';
				break;
			case 2:
				sexLabel = '女';
				break;
		}
		return sexLabel
	}

	const filterString = str => {
		let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;      
		if (str.match(reg)) {
      str = str.replace(reg, '');
    } 
		return str
	}


	//返回图片地地址
	const avatarUrlFn = (url)=>{
	//	console.log('url',url);
		const serverUrl = app.globalData.serverUrl;
		try {
			if(url.indexOf('https') !=-1 || url.indexOf('http') !=-1){
				return url
			}else{
				return serverUrl+'/sys/file/previewImg?fileName='+url;
			}
		} catch (error) {
			return '';
		}
	}

	//解析钱的格式
	  // defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
			places = !isNaN(places = Math.abs(places)) ? places : 2;
			symbol = '';// 加前缀 symbol !== undefined ? symbol : "$";
			thousand = thousand || ",";
			decimal = decimal || ".";
			let number = this,
					negative = number < 0 ? "-" : "",
					i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
					j = (j = i.length) > 3 ? j % 3 : 0;
			return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
	};

	//根据id去重合并
	Array.prototype.qcConcat = function(array,key){
		 let list = this;
		 if(list.length===0){
			 return array;
		 }
		 for(let i = 0 ; i < array.length ; i ++){
			 let item = array[i];
			 let bool = false;
			 if(key){
				 //根据id
				 bool =  list.findIndex(it=>it[key]===item[key])===-1; //不在里面
			 }else{
				 bool =  list.findIndex(it=>it===item)===-1; //不在里面
			 }
			 if(bool){
				 list.push(item);
			 }
		 }
		 return list;
		  
	}



	


module.exports = {
  formatTime: formatTime,
	updateCalendar:updateCalendar,
	switchWeek: switchWeek,
	switchJSON: switchJSON,
	http:http,
	switchLevel,
	switchSex,
	avatarUrlFn,
	uploadFile,
	filterString
}
