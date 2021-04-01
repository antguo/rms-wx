const promise = require('../../../utils/promise.js')
var util = require('../../../utils/util.js')

Page({
  data: {
    orderList: [],
    limit: 10,
    page: 1,
    status: 3,//已审核通过
    isAlive: 1,//合约未过期
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
      this.setData({
        orderList: that.data.orderList.concat(res.page.list),
        isOver: res.page.list.length != that.data.limit
      })
    })
  },
  changeSign: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/index/sign-change-detail/sign-change-detail?id=" + id+"&type=0",
    })
  },
})