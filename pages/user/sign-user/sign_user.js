const promise = require('../../../utils/promise.js')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagList: [
      { name: '全部', status: 0},
      { name: '待申请', status: 1 },
      { name: '待审核', status: 2 },
      { name: '审核成功', status: 3 },
      { name: '审核失败', status: 4 }
    ],
    currentTag: 0,
    orderList: [],
    limit: 10,
    page: 1,
    status: 0,

    // 1待支付2待审核3审核通过4审核驳回
    // signArray: [
    //   { date: '2019-10-10', time: '20:20:10', type: 1, addr: '上海市嘉定区永靖路288弄19幢53-56号新城枫景5幢1101', payTypes: [{ payName: '整租' }, { payName: '300/每月' }, { payName: '押三付一' }], roomTypes: [{ roomName: '东卧室一' }, { roomName: '东卧室二' }, { roomName: '东卧室三' }], deadTime: '2019-09-09~2020-09-09' },
    //   { date: '2019-10-10', time: '20:20:10', type: 2, addr: '上海市嘉定区永靖路288弄19幢53-56号新城枫景5幢1101', payTypes: [{ payName: '整租' }, { payName: '300/每月' }, { payName: '押三付一' }], roomTypes: [{ roomName: '东卧室一' }, { roomName: '东卧室二' }, { roomName: '东卧室三' }], deadTime: '2019-09-09~2020-09-09' },
    //   { date: '2019-10-10', time: '20:20:10', type: 3, addr: '上海市嘉定区永靖路288弄19幢53-56号新城枫景5幢1101', payTypes: [{ payName: '整租' }, { payName: '300/每月' }, { payName: '押三付一' }], roomTypes: [{ roomName: '东卧室一' }, { roomName: '东卧室二' }, { roomName: '东卧室三' }], deadTime: '2019-09-09~2020-09-09' },
    //   { date: '2019-10-10', time: '20:20:10', type: 4, addr: '上海市嘉定区永靖路288弄19幢53-56号新城枫景5幢1101', payTypes: [{ payName: '整租' }, { payName: '300/每月' }, { payName: '押三付一' }], roomTypes: [{ roomName: '东卧室一' }, { roomName: '东卧室二' }, { roomName: '东卧室三' }], deadTime: '2019-09-09~2020-09-09' }
    // ]
  },

  onLoad: function (options) {
    this.orderList();
  },

  tagOnChange: function(e) {
    console.log(e);
    let status = e.currentTarget.dataset.status;
    this.setData({
      currentTag: status,
      status: status
    })
    this.orderList();
  },

  /**
   * 获取订单列表
   */
  orderList: function() {
    util.showLoading();
    promise.get('/app/order/orderList', {
      page: this.data.page,
      limit: this.data.limit,
      status: this.data.status
    }).then(res => {
      util.hideLoading();
      this.setData({
        orderList: res.page.list
      })
    })
  },

  /**
   * 跳转到支付界面
   */
  goApplyPage: function () {
    wx.navigateTo({
      url: '../sign-apply/apply-success/apply_success',
    })
  },
  
  
})