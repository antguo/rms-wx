// pages/index/commitment-book/commitment-book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		info:"",
		tenantsName:"",
		date:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let data = JSON.parse(options.data);
		
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		if (month < 10) {
		    month = "0" + month;
		}
		if (day < 10) {
		    day = "0" + day;
		}
		this.setData({
			date:year + "年" + month + "月" + day + "日"
		})
		
		if(data){
			let tenantsName = data.tenantsInfos.map(item =>{
				return item.userName
			})
			this.setData({
				info: data,
				startYear: data.startDate.substring(0,4),
				startMonth: data.startDate.substring(5,7),
				startDay: data.startDate.substring(8,10),
				endYear: data.endDate.substring(0,4),
				endMonth: data.endDate.substring(5,7),
				endDay: data.endDate.substring(8,10),
				tenantsName: tenantsName.join("、"),
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