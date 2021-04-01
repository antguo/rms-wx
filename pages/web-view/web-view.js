
Page({
  data: {
    title: '',
    url: '',
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      url: decodeURIComponent(options.url)
    })
  },
  bindmessage: function(e) {
    let code = e.detail.data[0];
    wx.setStorageSync('code', code);
  }
})