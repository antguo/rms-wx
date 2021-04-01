const promise = require('../../utils/promise')

Page({

  data: {
    articleList:[],
  },
  
  onLoad: function (options) {
    this.helpList();
  },

  /**
   * 帮助列表
   */
  helpList: function() {
    promise.get('/app/article/helplist', {
    }).then(res => {
      this.setData({
        articleList: res.list
      })
    })
  },

  /**
   * 跳转帮助详情
   */
  goDetail: function (e){
    var articleId = e.currentTarget.dataset['id']
    wx.navigateTo({
      url: 'detail/detail?articleId=' + articleId ,
    })
  },

})