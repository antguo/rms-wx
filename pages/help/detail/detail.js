const promise = require('../../../utils/promise.js')
let WxParse = require('../../../utils/wxParse/wxParse.js');

Page({

  data: {
    articleId: "",
    article: ""
  },

  onLoad: function (options) {
    this.data.articleId = options.articleId;
    this.getDetail();
  },
  /**
   * 获取详情
   */
  getDetail: function() {
    promise.get('/app/article/detail', {
      id: this.data.articleId
    }).then(res => {
      WxParse.wxParse('articleData', 'html', res.data.articleContent, this, 0);
      this.setData({
        article: res.data
      })
    })
  }
})