const promise = require('../../../../utils/promise.js');
const util = require('../../../../utils/util.js');
const request = require('../../../../utils/request.js');
const cache = require('../../../../utils/cache.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null,
    tenantsRelation:""
  },
  chooseImg(e){
    const that = this;
    let arr = e.currentTarget.dataset.arr;
    let index = e.currentTarget.dataset.index;
    let val = e.currentTarget.dataset.val;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var imgUrl = res.tempFilePaths;

        util.showLoading();
        request.uploadImg(imgUrl, 0, [], function (callBack) {
          util.hideLoading();
          that.setData({
            ["info." + arr + "[" + index + "]." + val]: callBack[0]
          })
        })
      },
    })
  },
  // 上传关系证明的图
  tenantsRelationImg(){
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var imgUrl = res.tempFilePaths;

        util.showLoading();
        request.uploadImg(imgUrl, 0, [], function (callBack) {
          util.hideLoading();
          that.setData({
            tenantsRelation: callBack[0]
          })
        })
      },
    })
  },
  /**
   * 跳转到网签提交界面
   */
  goApplyPage:function(){
    if (this.checkOption()){
      let info = this.data.info;
      let landlordInfos = info.landlordInfos.map(item =>{
        return {
          "idCardBack": item.idCardB,
          "idCardFront": item.idCardA,
          "mobile": item.mobile,
          "userName": item.userName,
					"idCardNum": item.idCard,
        }
      })
      let tenantsInfos = info.tenantsInfos.map(item =>{
        return {
          "idCardBack": item.idCardB,
          "idCardFront": item.idCardA,
          "mobile": item.mobile,
          "userName": item.userName,
					"idCardNum": item.idCard,
        }
      })
      let roomCode = info.roomTypeArray.map(item =>{
        return {
          "direction": item.direction,
          "num": item.roomNum
        }
      })
      let postData = {
        "id":info.id,
        "address": info.address,  //地址
        "createType": info.roleTpyeCurr,  //0,房东 1,住客
        "detainNumber": info.detain,  //押金月数
        "endDate": info.endDate,  //合同结束时间
        "houseCardPaths": info.propertyImgs,  //房产证
        "houseCardType": info.houseCardType,
        "landlordInfos": landlordInfos,
        "paymentNumber": info.payment,
        "roomCode": roomCode,
        "rentPrice": info.rent,
        "rentType": info.leaseTypeCurr,
        "roomNumber": info.roomNumber,
        "startDate": info.startDate,
        "tenantsInfos": tenantsInfos,
        "undertakingPath": info.commitmentImg
      }
      console.log(JSON.stringify(postData))
      util.showLoading();
      if (postData.id){
        // 修改
        promise.post('/app/order/editApplySign', postData).then(res => {
          util.hideLoading();
          cache.delCacheValue("applyData");
          cache.delCacheValue("detailInfo");
          wx.showToast({
            title: '修改成功',
          })
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/index/index',
            })
          },1500)
        })
      }else{
        // 申请
        promise.post('/app/order/applySign', postData).then(res => {
          util.hideLoading();
          cache.delCacheValue("applyData");
					cache.delCacheValue("detailInfo");
          wx.reLaunch({
            url: '../apply-success/apply_success?data=' + JSON.stringify(res.data),
          })
        })
      }
    }
  },
  checkOption(){
    let landlordInfos = this.data.info.landlordInfos.filter(item =>{
      if (!item.idCardA || !item.idCardB){
        return item;
      }
    })
    let tenantsInfos = this.data.info.tenantsInfos.filter(item => {
      if (!item.idCardA || !item.idCardB) {
        return item;
      }
    })
    if (landlordInfos.length >= 1){
			util.showToast("请上传出租人身份证信息");
      return false;
    }else if(tenantsInfos.length >= 1){
      util.showToast("请上传承租人身份证信息");
			return false;
    }else if(this.data.tenantsRelation == "" && this.data.info.tenantsInfos.length>2){
      util.showToast("请上传承租人关系证明");
			return false;
    }else{
      return true;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = cache.getCacheValue("applyData");
    this.setData({
      info:data
    })
		
		if(cache.getCacheValue("detailInfo")){
			let info = cache.getCacheValue("detailInfo");
			this.data.info.tenantsInfos.forEach((item,idx) =>{
				item.idCardA = info.tenantsInfos[idx].idCardFront;
				item.idCardB = info.tenantsInfos[idx].idCardBack;
			})
			this.data.info.landlordInfos.forEach((item,idx) =>{
				item.idCardA = info.landlordInfos[idx].idCardFront;
				item.idCardB = info.landlordInfos[idx].idCardBack;
			})
			this.setData({
				["info.tenantsInfos"]:this.data.info.tenantsInfos,
				["info.landlordInfos"]:this.data.info.landlordInfos,
			})
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