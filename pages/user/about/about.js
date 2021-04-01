const promise = require('../../../utils/promise.js')
let util = require('../../../utils/util.js')
let WxParse = require('../../../utils/wxParse/wxParse.js');

Page({

  data: {
    article: ""
  },

  onLoad: function (options) {
    this.getDetail();
  },
  /**
   * 获取详情
   */
  getDetail: function () {
    util.showLoading();
    promise.get('/app/article/about', {
    }).then(res => {
      util.hideLoading();
      WxParse.wxParse('articleData', 'html', res.data.articleContent, this, 0);
      this.setData({
        article: res.data
      })
    })
  }
})