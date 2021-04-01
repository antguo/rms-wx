const promise = require('../../../utils/promise.js');
var cache = require('../../../utils/cache.js');
var util = require('../../../utils/util.js');
var request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    type:"",  //0 变更 1驳回的变更编辑
    address: "",  //产权地址
    startDate:"",
    endDate:"",
    rent:"",
    undertakingPath: [],
    picker: [],
  },
  // 合同期开始时间更改
  changeStarData(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  // 合同结束时间
  changeEedData(e) {
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
  pickerChange(e) {
    let index = e.detail.value;
    let data = {
      ...this.data.picker[index],
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      rent: this.data.rent,
      tenantsInfos: this.data.tenantsInfos,
      address: this.data.address,
    }
    wx.navigateTo({
      url: '/pages/index/commitment-book2/commitment-book2?data= ' + JSON.stringify(data),
    })
  },
  // 选择承诺书
  uploadLetter: function () {
    let that = this;
    wx.chooseImage({
      count: this.data.picker.length - this.data.undertakingPath.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          undertakingPath: [...that.data.undertakingPath, ...res.tempFilePaths]
        })
      },
    })
  },
  // 删除
  delImg(e) {
    let index = e.currentTarget.dataset.index;
    let arr = this.data.undertakingPath;
    arr.splice(index, 1)
    this.setData({
      undertakingPath: arr,
    })
  },
  submit(){
    if (this.data.undertakingPath.length == 0) {
      util.showToast("请选择承诺书");
      return;
    }
    if (this.data.undertakingPath.length != this.data.picker.length) {
      util.showToast("有" + this.data.picker.length + "个出租人，需要" + this.data.picker.length + "张承诺书");
      return;
    }
		
		let that = this;
		util.showLoading();
		request.uploadImg(that.data.undertakingPath, 0, [], function (callBack) {
		  util.hideLoading();
		  that.setData({
		    undertakingPath: callBack
		  })
			
			util.showLoading();
			promise.post('/app/order/cancelSign', {
				id: that.data.id,
				undertakingPath: that.data.undertakingPath.join(",")
			}).then(res => {
				util.hideLoading();
				if(res.data.price == 0){
					util.showToast("撤销成功")
					setTimeout(function(){
						wx.switchTab({
							url: "/pages/index/index"
						})
					},1500)
				}else{
					wx.reLaunch({
						url: '../sign-apply/apply-success/apply_success?data=' + JSON.stringify(res.data),
					})
				}
			});
		})
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    util.showLoading();
    // 获取房产证列表
    promise.get('/app/order/detail', { "id": options.id }).then(res => {
      util.hideLoading()
      this.setData({
        id:res.data.id,
        address: res.data.address,
        startDate: res.data.startDate,
        endDate: res.data.endDate,
        rent: res.data.rentPrice,
        picker: res.landlordInfos,
        tenantsInfos: res.tenantsInfos,
      })
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