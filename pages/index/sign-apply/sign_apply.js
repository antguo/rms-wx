const promise = require('../../../utils/promise.js');
var cache = require('../../../utils/cache.js');
var util = require('../../../utils/util.js');
var request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		id:"",  //编辑申请会存在
    roleTpye:[
      { name: "出租人", type: 0, isActive: true }, { name: "承租人", type: 1, isActive: false }
    ],  //角色类型
    roleTpyeCurr:0,
    address:"",  //产权地址
    leaseType: [
      { name: "整套租赁", type: 0, isActive: true }, { name: "按间租赁", type: 1, isActive: false }
    ],  //出租类型
    leaseTypeCurr: 0,
    roomArray: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],  //出租房间数
    roomIndex:0,
    roomTypeArray: [
      { direction: '', roomNum: '' }
    ],  //房间属性
    roomDirection: ['东', '南', '西', '北'],  //朝向
    roomDirectionIndex: '',
    roomNum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],  //卧室数量
    roomNumIndex: '',
    landlordInfos: [
      { mobile: "", userName: "" , idCard: "" }
    ],  //出租人信息
    tenantsInfos: [
      { mobile: "", userName: "" , idCard: "" }
    ],  //承担人信息
    startDate: "",  //合同开始时间
    endDate:"",  //合同结束时间
    rent:"",  //租金
    detain:"",  //押几个月
    payment: "",  //付几个月
  },
  // 更改角色类型
  changeRoleType(e){
    let index = e.currentTarget.dataset.index;
    this.data.roleTpye.forEach(item =>{
      item.isActive = false;
    })
    this.data.roleTpye[index].isActive = true;
    this.setData({
      roleTpye: this.data.roleTpye,
      roleTpyeCurr: index,
    })
  },
  // 出租类型
  changeLeaseType(e){
    let index = e.currentTarget.dataset.index;
    this.data.leaseType.forEach(item => {
      item.isActive = false;
    })
    this.data.leaseType[index].isActive = true;
    this.setData({
      leaseType: this.data.leaseType,
      leaseTypeCurr: index,
    })
  },
  // 房间数字
  pickerChange(e){
    this.setData({
      roomIndex: e.detail.value
    })
    let idx = parseInt(e.detail.value);
    idx = idx+=1;
    let arr = [];
    for (let i = 0; i < idx;i++){
      arr.push({ direction: '', roomNum: '' });
    }
    this.setData({
      roomTypeArray:arr
    })
  },
  // 更改朝向
  directionChange(e){
    let itemIdx = e.currentTarget.dataset.index;
    let value = this.data.roomDirection[e.detail.value]
    this.setData({
      ['roomTypeArray[' + itemIdx +'].direction']:value
    })
  },
  // 更改卧室数量
  bedroomChange(e){
    let itemIdx = e.currentTarget.dataset.index;
    let value = this.data.roomNum[e.detail.value]
    this.setData({
      ['roomTypeArray[' + itemIdx + '].roomNum']: value
    })
  },

  saveUserInfos(e){
    let arr = e.currentTarget.dataset.arr;
    let key = e.currentTarget.dataset.key;
    let index = e.currentTarget.dataset.index;
    this.data[arr][index][key] = e.detail.value;
    this.setData({
      [arr]: this.data[arr]
    })
  },
  // 添加出租人,承租人信息
  addUserInfo(e){
    let type = e.currentTarget.dataset.type;
    let arr = this.data[type];
    arr.push({ mobile: "", userName: "" , idCard: "" });
    this.setData({
      [type]: arr,
    })
  },
  // 删除出租人,承租人信息
  delUserInfo(e){
    let type = e.currentTarget.dataset.delname;
    let index = e.currentTarget.dataset.index;
    let arr = this.data[type];
    arr.splice(index,1);
    this.setData({
      [type]: arr,
    })
  },

  // 合同期开始时间更改
  changeStarData(e){
    this.setData({
      startDate:e.detail.value
    })
  },
  // 合同结束时间
  changeEedData(e){
    this.setData({
      endDate: e.detail.value
    })
  },

  changeVal(e) {
    let key = e.currentTarget.dataset.val;
    this.setData({
      [key]: e.detail.value
    })
  },
  // 下一步
	goCommitmentLetter: function () {
    let data = {
			id: this.data.id,
      roleTpyeCurr: this.data.roleTpyeCurr,
      address: this.data.address,
      leaseTypeCurr: this.data.leaseTypeCurr,
      roomTypeArray: this.data.roomTypeArray,
      roomNumber: this.data.roomArray[this.data.roomIndex],
      landlordInfos: this.data.landlordInfos,
      tenantsInfos: this.data.tenantsInfos,
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      rent: this.data.rent,
      detain: this.data.detain,
      payment: this.data.payment,
    }
		
    if(this.checkOption(data)){
      if (data.leaseTypeCurr == 0){
        data.roomTypeArray = [];
      }
      cache.cacheValue("applyData",{...cache.getCacheValue("applyData"),...data});
      wx.navigateTo({
        url: 'commitment-letter/commitment_letter',
      })
    }
  },

  checkOption(data){
		const time = 2000;  //提示持续时间
		
		if(data.address == ""){
			util.showToast("请填写地址");
			return false;
		}
		if(data.startDate == "" || data.endDate == "" ){
			util.showToast("请填写合同期开始时间或结束时间");
			return false;
		}
		if(data.rent == ""){
			util.showToast("请填写月租金");
			return false;
		}
		if(data.payment == "" || data.detain == ""){
			util.showToast("请填写押金信息");
			return false;
		}
    
		let roomTypeArray = [];
    if (data.leaseTypeCurr == 1){
      roomTypeArray = data.roomTypeArray.filter(item =>{
        if (item.direction == "" || item.roomNum == ""){
          return item;
        }
      })
    }
    let landlordInfos = data.landlordInfos.filter(item => {
      if (item.mobile == "" || item.userName == "" || item.idCard == "") {
        return item;
      }
    })
    let tenantsInfos = data.tenantsInfos.filter(item => {
      if (item.mobile == "" || item.userName == "" || item.idCard == "") {
        return item;
      }
    });

		if(roomTypeArray.length>=1){
			util.showToast("请填写房间信息");
			return false;
		}
		if(landlordInfos.length >= 1){
			util.showToast("请填写出租人信息");
			return false;
		}
		if(tenantsInfos.length>=1){
			util.showToast("请填写承租人信息");
			return false;
		}
		
		
		// 电话号码验证
		let landlordTel = data.landlordInfos.filter(item =>{
			if(!util.checkPhone(item.mobile)){
				return item;
			}
		})
		let tenantsTel = data.tenantsInfos.filter(item =>{
			if(!util.checkPhone(item.mobile)){
				return item;
			}
		})
		if(landlordTel.length>0){
			util.showToast("出租人信息电话格式错误");
			return false;
		}else if(tenantsTel.length>0){
			util.showToast("承租人信息电话格式错误");
			return false;
		}
    // 身份证号码验证
		let landlordIdCard = data.landlordInfos.filter(item =>{
			if(!util.checkIDCard(item.idCard)){
				return item;
			}
		})
		let tenantsIdCard = data.tenantsInfos.filter(item =>{
			if(!util.checkIDCard(item.idCard)){
				return item;
			}
		})
		if(landlordIdCard.length>0){
			util.showToast("出租人信息身份证格式错误");
			return false;
		}else if(tenantsIdCard.length>0){
			util.showToast("承租人信息身份证格式错误");
			return false;
		}
		// 身份证号码是否相同
		let idCardCrossList = data.tenantsInfos.filter(item => data.landlordInfos.some(it => it.idCard === item.idCard));
		if(idCardCrossList.length>0){
			util.showToast("出租人、承租人身份证号码不能相同",time);
			return false;
		}
		// 电话号码是否相同
		let mobleCrossList = data.tenantsInfos.filter(item => data.landlordInfos.some(it => it.mobile === item.mobile));
		if(mobleCrossList.length>0){
			util.showToast("出租人、承租人电话号码不能相同",time);
			return false;
		}
		
		// 合同期限验证
		if(new Date(data.endDate) - new Date(data.startDate) < 2592000000){
			util.showToast("合同结束时间不得小于开始时间一个月以下",2000);
			return false;
		}
		return true;
  },
 
	getDetail(id){
		const that = this;
		util.showLoading();
		promise.get("/app/order/detail", {
		  id: id
		}).then(res => {
			util.hideLoading();
			cache.cacheValue("detailInfo",res);
			let data = that.data;
			data.roleTpyeCurr = res.data.createType;
			data.roleTpye.forEach(item =>{
				item.isActive = false;
			})
			data.roleTpye[res.data.createType].isActive = true;

			data.leaseTypeCurr = res.data.rentType;
			data.leaseType.forEach(item =>{
				item.isActive = false;
			})
			data.leaseType[res.data.rentType].isActive = true;
			
			data.landlordInfos = res.landlordInfos.map(item =>{
				return { mobile: item.mobile, userName: item.userName , idCard: item.idCardNum }
			})
			data.tenantsInfos = res.tenantsInfos.map(item =>{
				return { mobile: item.mobile, userName: item.userName , idCard: item.idCardNum }
			})
			that.setData({
				roleTpyeCurr: that.data.roleTpyeCurr,
				roleTpye: that.data.roleTpye,
				address: res.data.address,
				leaseType: that.data.leaseType,
				landlordInfos: that.data.landlordInfos,
				tenantsInfos: that.data.tenantsInfos,
				startDate: res.data.startDate,
				endDate: res.data.endDate,
				rent: res.data.rentPrice,
				detain: res.data.detainNumber,
				payment: res.data.paymentNumber,
				roomIndex: res.data.roomNumber-1,
			})
			
			if(res.data.rentType == 1){
				that.setData({
					roomTypeArray: JSON.parse(res.data.roomCode).map(item =>{
						return { direction: item.direction, roomNum: item.num }
					})
				})
			}
			
		})
	},
	/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
			this.setData({
				id:options.id
			})
			this.getDetail(options.id);
    }
		if(cache.getCacheValue("applyData")){
			let data = cache.getCacheValue("applyData");
			if(data.id){
				cache.delCacheValue("applyData");
				return;
			}
			
			console.log(JSON.stringify(data));
			this.data.roleTpye.forEach(item =>{
				item.isActive = false;
			})
			this.data.roleTpye[data.roleTpyeCurr].isActive = true;
			
			this.data.leaseType.forEach(item =>{
				item.isActive = false;
			})
			this.data.leaseType[data.leaseTypeCurr].isActive = true;
			
			this.setData({
				roleTpyeCurr: data.roleTpyeCurr,
				roleTpye: this.data.roleTpye,
				leaseTypeCurr: data.leaseTypeCurr,
				leaseType: this.data.leaseType,
				address: data.address,
				landlordInfos: data.landlordInfos,
				tenantsInfos: data.tenantsInfos,
				startDate: data.startDate,
				endDate: data.endDate,
				rent: data.rent,
				detain: data.detain,
				payment: data.payment,
			})
			
			if(data.leaseTypeCurr == 1){
				this.setData({
					roomIndex: data.roomNumber-1,
					roomTypeArray: data.roomTypeArray
				})
			}else{
				this.setData({
					roomIndex:0,
					roomTypeArray: [{ direction: '', roomNum: '' }]
					
				})
			}
		}
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})