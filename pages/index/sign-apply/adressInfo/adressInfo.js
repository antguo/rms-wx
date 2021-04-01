const promise = require('../../../../utils/promise.js');
const util = require('../../../../utils/util.js');
const request = require('../../../../utils/request.js');
const cache = require('../../../../utils/cache.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:"",
		hasAdress:false,
  },
  // 跳转回首页
  laterPay(){
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  // 跳转到个人信息页面
	toUserInfo(){
		wx.navigateTo({
      url: "/pages/user/personal-info/personal_info",
    })
	},
	getUserInfo() {
		promise.get('/app/user/userInfo', {
		}).then(res => {
			this.setData({
				user: res.user,
			})
			if(res.user.province=="" || res.user.city=="" || res.user.area=="" || res.user.address==""){
				this.setData({
					hasAdress: false,
				})
			}else{
				this.setData({
					hasAdress: true,
				})
			}
		})
	},
  
	onShow: function (options) {
    this.getUserInfo();
  },
})