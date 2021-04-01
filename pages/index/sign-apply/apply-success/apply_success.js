const promise = require('../../../../utils/promise.js');
const util = require('../../../../utils/util.js');
const request = require('../../../../utils/request.js');
const cache = require('../../../../utils/cache.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: "",
    id: "",
    payAgreement:false,
  },
  // 服务协议
  payAgreement(){
    wx.navigateTo({
      url: "/pages/index/sign-apply/payAgreement/payAgreement",
    })
  },
  checkChange(e){
    console.log(e);
    if (e.detail.value.length == 0){
      this.setData({
        payAgreement:false
      })
    }else{
      this.setData({
        payAgreement: true
      })
    }
  },
  // 跳转回首页
  laterPay(){
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  // 立即付款
  pay(){
    if (!this.data.payAgreement){
      util.showToast("请阅读并同意支付协议");
      return;
    }
    let that = this;
    util.showLoading();
    wx.login({
      success(res) {
        that.getMicroOpenId(res.code);
      }
    })
  },
  //获取小程序openId
  getMicroOpenId: function (code) {
    promise.get("/app/wx/microOpenId", {
      code: code
    }).then(res => {
      this.toPayRequest(res.data)
    })
  },
  //请求支付
  toPayRequest: function (openId) {
    
    promise.post("/app/pay/pay", {
      openId: openId,
      orderId: this.data.id
    }).then(res => {
      util.hideLoading();
      this.toJspay(res.data);
    })
  },
  toJspay: function (data) {
    let that = this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packageValue,
      signType: data.signType,
      paySign: data.paySign,
      success(res) {
        util.showToast('支付成功');
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/index/sign-apply/adressInfo/adressInfo',
          })
        }, 1000);
      }, fail(res) {
        util.showToast('支付失败');
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.data);
    this.setData({
      "price": data.price,
      "id": data.id
    })
  },
})