var app = getApp();
const promise = require('../../../utils/promise.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractArray:[
      { time: '2019-09-10 11:13:14', addr:'上海市嘉定区永靖路288弄19幢53-56号新城枫景5幢1101'},
      { time: '2019-09-10 15:20:18', addr:'上海市嘉定区永靖路288弄19幢53-56号新城枫景5幢1102'},
      { time: '2019-09-10 16:13:14', addr:'上海市嘉定区永靖路288弄19幢53-56号新城枫景5幢1103'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {
      page: 1,
      limit:5
    }
    promise.get('/app/contractList', data).then(res => {
      console.log('我的合同：'+JSON.stringify(res))
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