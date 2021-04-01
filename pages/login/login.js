
var promise = require('../../utils/promise.js')
var util = require('../../utils/util.js')

Page({
  data: {
    microOpenId: '',
    nickName: '',
    avatarUrl: '',
    gender: '',
    wxOpenId: '',
    phone: '',

    isShowPop: false,

    code:"",
  },
  /**
   * 登录流程
   * 1. 先获取小程序微信用户信息和openId，
   * 2. 获取微信openId: 跳转web->获取code->跳回onShow->请求wxOpenId
   * 3. 获取手机号
   * 4. 去登录
   */
  onLoad: function (options) {
    let that = this;
    wx.login({
      success(res) {
        that.data.code = res.code;
      }
    })
    this.setData({
      isShowPop: false
    })
    wx.removeStorageSync('code');
    wx.removeStorageSync('startCode');
    this.getMicroUserInfo();
  },
  //获取小程序Code
  getMicroUserInfo: function() {
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          that.getMicroOpenId(res.code);
        } else {
          util.showModal('提示', '授权失败,请重新进入小程序', function () {
            wx.navigateBack({})
          }, function () {
            wx.navigateBack({})
          });
        }
      }
    })
  },
  //获取小程序openId
  getMicroOpenId: function(code) {
    promise.get("/app/wx/microOpenId",{
      code: code
    }).then(res => {
      this.setData({
        microOpenId: res.data
      })
    })
  },
  //授权获取用户信息
  bindGetUserInfo: function() {
    let that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          gender: res.userInfo.gender
        })
        that.getWxCode();
      },
      fail: function(res) {
        util.showModal('提示', '请授权获取用户信息', function(){
          wx.navigateBack({})
        }, function() {
          wx.navigateBack({})
        });
      }
    })
  },
  //获取公众号Code
  getWxCode: function() {
    wx.setStorageSync('startCode', '1');
    promise.get('/app/wx/wxUrl', {
    }).then(res => {
      console.log(res.data);
      wx.navigateTo({
        url: '/pages/web-view/web-view?url=' + encodeURIComponent(res.data) + "&title=住房租赁网签",
      })
    })
  },
  //获取公众号Code
  onShow: function() {
    if (wx.getStorageSync('startCode')) {
      let code = wx.getStorageSync('code');
      if (code) {
        this.getWxOpenId(code);
      } else {
        util.showModal('提示', '授权失败,请重新授权', function(){
          wx.navigateBack({});
        }, function() {
          wx.navigateBack({});
        });
      }
    }
  },
  //获取公众号openId
  getWxOpenId: function(code) {
    promise.post('/app/wx/wxOpenId',{
      code: code
    }).then(res => {
      this.setData({
        wxOpenId: res.data,
        isShowPop: true
      })
    })
  },
  //获取手机号
  bindGetPhoneNumber: function (e) {
    var phone = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      sessionKey: e.detail.sessionKey
    }
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      this.getWxPhone(phone);
    } else {
      util.showModal('提示', '授权失败,请重新授权', function(){
        wx.navigateBack({});
      }, function() {
        wx.navigateBack({});
      })
    }
  },
  //获取微信手机号
  getWxPhone: function(data) {
    let that = this;
    promise.get("/app/wx/microPhone", {
      code: this.data.code,
      encryptedData: data.encryptedData,
      ivStr: data.iv
    }).then(res => {
      that.setData({
        phone: res.data
      })
      that.gotoLogin();
    })
  },
  //登录或者注册
  gotoLogin: function() {
    promise.post('/app/login', {
      microOpenId: this.data.microOpenId,
      nickName: this.data.nickName,
      avatarUrl: this.data.avatarUrl,
      gender: this.data.gender,
      wxOpenId: this.data.wxOpenId,
      phone: this.data.phone,
    }).then(res => {
      wx.setStorageSync('token', res.token);
      util.showToast('登录成功');
      setTimeout(function(){
        wx.navigateBack({});
      }, 1000);
    })
  }
})