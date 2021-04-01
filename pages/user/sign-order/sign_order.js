const promise = require('../../../utils/promise.js')
var util = require('../../../utils/util.js')
var cache = require('../../../utils/cache.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagList: [
      { name: '全部', status: 0 },
      { name: '待付款', status: 1 },
      { name: '审核中', status: 2 },
      { name: '已完成', status: 3 },
      { name: '审核驳回', status: 4 }
    ],
    currentTag: 0,
    orderList: [],
    limit: 10,
    page: 1,
    status: 0,
    isOver: false
  },

  onLoad: function (options) {
    this.orderList();
  },
  
  tagOnChange: function (e) {
    let status = e.currentTarget.dataset.status;
    this.setData({
      currentTag: status,
      status: status,
      page: 1,
      isOver: false
    })
    this.orderList();
  },
  onReachBottom: function() {
    if (!this.data.isOver) {
      this.data.page = this.data.page + 1;
      this.orderList();
    }
  },
  refresh: function(){
    this.data.page = 1;
    this.orderList();
  },
  /**
   * 获取订单列表
   */
  orderList: function () {
    let that = this;
    util.showLoading();
    promise.get('/app/order/orderList', {
      page: this.data.page,
      limit: this.data.limit,
      status: this.data.status
    }).then(res => {
      util.hideLoading();
      if (this.data.page == 1) {
        this.data.orderList = [];
      }
      for (let idx in res.page.list) {
        let item = res.page.list[idx];
        if (item.rentType == 1) {
          item.roomCode = JSON.parse(item.roomCode)
        }
      }
      this.setData({
        orderList: that.data.orderList.concat(res.page.list),
        isOver: res.page.list.length != that.data.limit
      })
    })
  },

  /**
   * 跳转到支付界面
   */
  gotoPay: function (e) {
    util.showLoading();
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.login({
      success(res) {
        that.getMicroOpenId(res.code, id);
      }
    })
  },
  //获取小程序openId
  getMicroOpenId: function (code, orderId) {
    promise.get("/app/wx/microOpenId", {
      code: code
    }).then(res => {
      this.toPayRequest(res.data, orderId)
    })
  },
  //请求支付
  toPayRequest: function (openId, orderId) {
    promise.post("/app/pay/pay", {
      openId: openId,
      orderId: orderId
    }).then(res => {
      util.hideLoading();
      this.toJspay(res.data);
    })
  },
  toJspay: function(data) {
    let that = this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packageValue,
      signType: data.signType,
      paySign: data.paySign,
      success(res) {
        util.showToast('支付成功');
        setTimeout(function(){
          that.refresh();
        }, 1000);
      }, fail(res) {
        util.showToast('支付失败');
      }
    });
  },
  /**
   * 查看合同
   */
  gotoContract: function (e) {
    let url = e.currentTarget.dataset.contract;
    if (url) {
      wx.navigateTo({
        url: '../../web-view/web-view?url=' + url + "&title=合同信息",
      })
    } else {
      util.showToast('该网签无合同');
    }
  },
  /**
   * 重新编辑
   */
  gotoEdit: function (e) {
    let id = e.currentTarget.dataset.item.id;
    if (e.currentTarget.dataset.item.orderStatus == 1){
      cache.delCacheValue("applyData");
      wx.navigateTo({
        url: '/pages/index/sign-apply/sign_apply?id=' + id,
      })
    } else if (e.currentTarget.dataset.item.orderStatus == 4) {
      wx.navigateTo({
        url: '/pages/index/sign-change-detail/sign-change-detail?id=' + id + "&type=1",
      })
    }
  },
})