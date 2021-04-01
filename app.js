//app.js
var config = require('utils/config.js');
const promise = require('utils/promise.js')
App({
  globalData: {
    userInfo: null,
    code: '',
    requestUrl: '',
  },
  onLaunch: function () {
    this.globalData.requestUrl = config.config.requestUrl; //后台接口地址
    this.getUserLocation();
  },

  /**
   * 获取用户地理位置
   */
  getUserLocation: function() {
    wx.getLocation({
      success: function(res) {
        let data = {
          accuracy: res.accuracy,
          createDate: new Date(),
          id: 0,
          latitude: res.latitude,
          longitude: res.longitude,
          userId: 0
        }
        // promise.post('/app/saveUserlocation',data, null).then(res => {

        // })
      },
    })
  },
})