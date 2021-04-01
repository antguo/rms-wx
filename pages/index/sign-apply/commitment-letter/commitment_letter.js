const promise = require('../../../../utils/promise.js');
const request = require('../../../../utils/request.js');
const cache = require('../../../../utils/cache.js');
const util = require('../../../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    letterStatus: 0, //是否上传
		applyInfo:null,  //申请信息
    imagesUrl: '',
    undertakingPath: [],
    picker:[],
  },
  pickerChange(e){
		let index = e.detail.value;
		let data = {
			...this.data.picker[index],
			startDate: this.data.applyInfo.startDate,
			endDate: this.data.applyInfo.endDate,
			rent: this.data.applyInfo.rent,
			tenantsInfos: this.data.applyInfo.tenantsInfos,
			address: this.data.applyInfo.address,
		}
		wx.navigateTo({
		  url: '/pages/index/commitment-book/commitment-book?data= '+JSON.stringify(data),
		})
  },
  // 上传承诺书
  uploadLetter: function () {
    let that = this;
    wx.chooseImage({
      count: this.data.picker.length - this.data.undertakingPath.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          undertakingPath: [...that.data.undertakingPath, ...res.tempFilePaths]
        })
      },
    })
  },
  // 删除
  delImg(e){
    let index = e.currentTarget.dataset.index;
    let arr = this.data.undertakingPath;
    arr.splice(index, 1)
    this.setData({
      undertakingPath:arr,
    })
  },
  /**
   * 跳转到上传房产证
   */
  goOwnershipCertificate:function(){
    let that = this;
    util.showLoading();
    if (this.data.undertakingPath.length == 0){
      util.showToast("请选择承诺书");
      return;
    }
    if (this.data.undertakingPath.length != this.data.picker.length) {
      util.showToast("有" + this.data.picker.length + "个出租人，需要" + this.data.picker.length+"张承诺书");
      return;
    }
    request.uploadImg(that.data.undertakingPath, 0, [], function (callBack) {
      util.hideLoading();
      let undertakingPath = that.data.undertakingPath;
      that.setData({
        undertakingPath: callBack
      })

      let data = cache.getCacheValue("applyData");
      data.commitmentImg = that.data.undertakingPath.join(",");
      cache.cacheValue("applyData", data);
      wx.navigateTo({
        url: '../ownership-certificate/ownership_certificate',
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = cache.getCacheValue("applyData");
		if(data){
			this.setData({
				applyInfo:data,
				picker:data.landlordInfos,
				undertakingPath: data.commitmentImg ?data.commitmentImg.split(","):[]
			})
			
		}
		
		if(cache.getCacheValue("detailInfo")){
			let info = cache.getCacheValue("detailInfo");
			this.setData({
				undertakingPath: info.data.undertakingPath.split(",")
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