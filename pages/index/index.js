const promise = require('../../utils/promise')
var util = require("../../utils/util.js")
var cache = require("../../utils/cache.js")

Page({
  data: {
    processArray:[
      { imgUrl: '/images/icon/sign-step1.png', name:'填写资料',type:1},
      { imgUrl: '', name:'',type:2},
      { imgUrl: '/images/icon/sign-step2.png', name:'支付费用',type:1},
      { imgUrl: '', name:'',type:2},
      { imgUrl: '/images/icon/sign-step3.png', name:'合同下载',type:1},
    ],
    signArray:[
      { color: '#3889f1', imgUrl:'/images/icon/sign-apply.png',name:'网签申请'},
      { color: '#12bfff', imgUrl:'/images/icon/sign-update.png',name:'变更申请'},
      { color: '#45dfff', imgUrl:'/images/icon/sign-cancel.png',name:'撤销申请'},
    ],
    bannerList:[],
  },

  onLoad: function (options) {
    this.getBannerList();
  },

  /**
   * 获取轮播列表
   */
  getBannerList: function () {
    var data = { type: 0 };
    promise.get('/app/banner/list', {}).then(res => {
      this.setData({
        bannerList: res.list
      })
    })
  },

  /**
   * 点击轮播图片跳转对应url
   */
  goUrl:function(e){
    var title = e.currentTarget.dataset.title;
    var url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: '../web-view/web-view?title=' + title + "&url=" + encodeURIComponent(url),
      })
    }
  },
  
  /**
   * 网签跳转事件
   */
  switchLabel: function (e) {
    if (!util.isLogin()) {
      util.showToast('请先登录');
      setTimeout(function(){
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }, 1000)
      return;
    }
    var click_name = e.currentTarget.dataset['name']
    switch(click_name){
      case '网签申请':
        this.signApply();
        break;
      case '变更申请':
        this.signChange();
        break;
      case '撤销申请':
        this.signCancel();
        break;
    }
  },

  /**
   * 网签申请事件
   */
  signApply: function() {
    wx.navigateTo({
      url: 'sign-apply/sign_apply'
    })
  },
  /**
   * 变更申请
   */
  signChange: function() {
    wx.navigateTo({
      url: 'sign-change/sign_change',
    })
  },
  /**
   * 撤销申请
   */
  signCancel:function(){
    wx.navigateTo({
      url: 'sign-cancel/sign_cancel',
    })
  },
  onShow(){
    cache.delCacheValue("detailInfo");
  }
})