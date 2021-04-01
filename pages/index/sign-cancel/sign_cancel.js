const promise = require('../../../utils/promise.js')
var util = require('../../../utils/util.js')

Page({
  data: {
    orderList: [],
    limit: 10,
    page: 1,
    status: 3,//已审核通过
    isAlive: true,//合约未过期
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
  onReachBottom: function () {
    if (!this.data.isOver) {
      this.data.page = this.data.page + 1;
      this.orderList();
    }
  },
  refresh: function () {
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
      status: this.data.status,
      isAlive: this.data.isAlive
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
      console.log(res);
      this.setData({
        orderList: that.data.orderList.concat(res.page.list),
        isOver: res.page.list.length != that.data.limit
      })
    })
  },
  cancelSign: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/index/sign-cancel-detail/sign-cancel-detail?id=" + id + "&type=0",
    })
    // let that = this;
    // util.showModal('提示', '是否要进行撤销申请', function(){
    //   util.showLoading();
    //   promise.post('/app/order/cancelSign', {
    //     id: id
    //   }).then(res => {
    //     util.hideLoading();
    //     wx.reLaunch({
    //       url: '../sign-apply/apply-success/apply_success?data=' + JSON.stringify(res.data),
    //     })  
    //   });
    // })
  },
  // /**
  //  * 跳转到支付界面
  //  */
  // gotoPay: function (id) {
  //   util.showLoading();
  //   let id = e.currentTarget.dataset.id;
  //   let that = this;
  //   wx.login({
  //     success(res) {
  //       that.getMicroOpenId(res.code, id);
  //     }
  //   })
  // },
  // //获取小程序openId
  // getMicroOpenId: function (code, orderId) {
  //   promise.get("/app/wx/microOpenId", {
  //     code: code
  //   }).then(res => {
  //     this.toPayRequest(res.data, orderId)
  //   })
  // },
  // //请求支付
  // toPayRequest: function (openId, orderId) {
  //   promise.post("/app/pay/pay", {
  //     openId: openId,
  //     orderId: orderId
  //   }).then(res => {
  //     util.hideLoading();
  //     this.toJspay(res.data);
  //   })
  // },
  // toJspay: function (data) {
  //   let that = this;
  //   wx.requestPayment({
  //     timeStamp: data.timeStamp,
  //     nonceStr: data.nonceStr,
  //     package: data.packageValue,
  //     signType: data.signType,
  //     paySign: data.paySign,
  //     success(res) {
  //       util.showToast('支付成功');
  //       setTimeout(function () {
  //         that.refresh();
  //       }, 1000);
  //     }, fail(res) {
  //       util.showToast('支付失败');
  //     }
  //   });
  // },
})