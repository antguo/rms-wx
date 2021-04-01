const promise = require('../../utils/promise')
var util = require('../../utils/util.js')

Page({

  data: {
    userItemArray:[
      { type: 1, name: '我的网签', imgUrl:'/images/icon/my-sign.png'},
      // { type: 1, name: '我的合同', imgUrl:'/images/icon/我的合同.png'},
      { type: 2, name: '联系我们', tel: '021-59533301', imgUrl: '/images/icon/staff.png'},
      { type: 1, name: '关于我们', imgUrl: '/images/icon/about-us.png'},
    ],
    isLogin: false,
    user: "",
    hasAddress: 0,
    hasOrder:0,
  },
  onLoad: function() {

  },
  onShow: function() {
    let isLogin = util.isLogin();
    this.setData({
      isLogin: isLogin
    })
    if (isLogin) {
      this.getInfo();
    }
  },
  
  /**
   * 获取个人信息
   */
  getInfo: function () {
    promise.get('/app/user/userInfo', {
    }).then(res => {
      this.setData({
        user: res.user,
        hasOrder: res.hasAddress,
        hasAddress: res.hasAddress,
      })
    })
  },

  /**
   * 个人信息界面、登录
   */
  gotoUserInfo: function () {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: 'personal-info/personal_info',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  /**
   * 点击功能项
   */
  gotoOpeartion:function(e){
    let clickName = e.currentTarget.dataset['name']
    switch(clickName){
      case '我的合同':
        this.goContract();
        break;
      case '联系方式':
        this.goContact();
        break;
      case '关于我们':
        this.goAbout();
        break;
      case '我的网签':
        this.goSign();
        break;
    }
  },

  /**
   * 跳转我的合同界面
   */
  goContract: function () {
    if (!this.data.isLogin) {
      util.showModal('提示', '请先登录');
      return;
    }
    wx.navigateTo({
      url: 'contract/contract',
    })
  },

  /**
    * 跳转到我的网签界面
    */
  goSign: function () {
    if (!this.data.isLogin) {
      util.showModal('提示', '请先登录');
      return;
    }
    wx.navigateTo({
      url: 'sign-order/sign_order',
    })
  },

  /**
   * 拨打联系方式电话
   */
  goContact: function () {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.userItemArray[1].tel
    })
  },

  /**
  * 跳转关于我们界面
  */
  goAbout: function () {
    wx.navigateTo({
      url: 'about/about',
    })
  },
})