const config = require('../../../../utils/config.js');
const promise = require('../../../../utils/promise.js');
const util = require('../../../../utils/util.js');
const request = require('../../../../utils/request.js');
const cache = require('../../../../utils/cache.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 房产证上传列表
    typeUploadArray:[
      // '/images/certificate/上传房产证2.png',
    ],
    /** 房产证类型 start*/
    housecardlist: [],
    /** 房产证类型 end*/
		curTypeIndex:0
  },
  // 上传房产证
  uploadHousecard: function(e) {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function(res) {
        var imgUrl = res.tempFilePaths;
        that.setData({
          typeUploadArray: [...that.data.typeUploadArray, ...imgUrl]
        })
      },
    })
  },
  delImg(e){
    let index = e.currentTarget.dataset.index;
    let typeUploadArray = this.data.typeUploadArray
    typeUploadArray.splice(index,1);
    this.setData({
      typeUploadArray
    })
  },
  // 改变房产证类型
  changeHousecard: function (e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      curTypeIndex: index,
    })
  },
  /**
   * 跳转到身份证上传页面
   */
  goIdentity:function(){
    let that = this;
    if (this.data.typeUploadArray.length == 0){
      util.showToast("请上传房产证");
      return;
    }
    util.showLoading();
    request.uploadImg(this.data.typeUploadArray, 0, [], function (callBack) {
      util.hideLoading();
      that.setData({
        typeUploadArray: callBack
      })
      let data = cache.getCacheValue("applyData");
      data.propertyImgs = callBack;
      data.houseCardType = that.data.housecardlist[that.data.curTypeIndex].title;
      cache.cacheValue("applyData", data);

      wx.navigateTo({
        url: '../identity/identity',
      })
    })
  },

  prviewImg(e){
    let data =  e.currentTarget.dataset;
    wx.previewImage({
      current: data.item, // 当前显示图片的http链接
      urls: data.arr // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let that = this;
    util.showLoading();
    // 获取房产证列表
    promise.get('app/basic/housecardlist', {}).then(res => {
      util.hideLoading();
			res.list.forEach(item =>{
				item.sampleUrlArr = item.sampleUrl.split(",")
			})
      this.setData({
        housecardlist: res.list,
      })
			
			if(cache.getCacheValue("detailInfo")){
				let info = cache.getCacheValue("detailInfo");
				let index;
				res.list.forEach((item,idx) =>{
					if(item.title == info.data.houseCardType){
						index = idx;
					}
				})
				that.setData({
					typeUploadArray: JSON.parse(info.data.houseCardPaths),
					curTypeIndex:index?index:0,
				})
			}else{
				let data = cache.getCacheValue("applyData");
				if(data){
					let index;
					res.list.forEach((item,idx) =>{
						if(item.title == data.houseCardType){
							index = idx;
						}
					})
					that.setData({
						typeUploadArray: data.propertyImgs?data.propertyImgs:[],
						curTypeIndex:index?index:0,
					})
				}
			}
			
    })
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