var app = getApp();
const promise = require('../../../utils/promise.js');
var util = require("../../../utils/util.js");

Page({
  
  data: {
    user: null,
    region: [],
  },
  onLoad: function(){
    this.getUserInfo();
  },
  /**
   * 获取个人信息
   */
  getUserInfo: function () {
    promise.get('/app/user/userInfo', {
    }).then(res => {
      let region = [];
      region[0] = res.user.province ? res.user.province : '上海市';
      region[1] = res.user.city ? res.user.city : '上海市';
      region[2] = res.user.area ? res.user.area : '嘉定区';
      this.setData({
        user: res.user,
        region: region
      })
    })
  },
  /**
 * 更新个人信息
 */
  updateUserInfo: function () {
    let user = this.data.user;
    if (!user.userName) {
      util.showToast('请输入昵称');
      return;
    }
    if (!user.address) {
      util.showToast('请输入详细地址');
      return;
    }
    if (!user.recipients) {
      util.showToast('请输入收件人');
      return;
    }
    if (!util.checkPhone(user.tel)) {
      util.showToast('请输入正确收件人手机号');
      return;
    }
    
    let updateData = {
      imagesUrl: user.imagesUrl,
      userName: user.userName,
      province: this.data.region[0],
      city: this.data.region[1],
      area: this.data.region[2],
      address: user.address,
      recipients: user.recipients,
      tel: user.tel,
      postCode: user.postCode,
    }
    promise.post('/app/user/update', updateData).then(res => {
      util.showToast('修改成功');
      setTimeout(function () {
        wx.navigateBack({});
      }, 1500);
    })
  },
  /**
   * 选择用户头像
   */
  chooseUserface: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: function (res) {
        if (res.errMsg == "chooseImage:ok" && res.tempFilePaths.length > 0) {
          promise.upload('/app/oss/upload', res.tempFilePaths[0]).then(res => {
            that.setData({
              ['user.imagesUrl']: res.url,
            })
          });
        } else {
          util.showToast('选择头像失败');
        }
      },
    })
  },


  /**
   * 改变省区
   */
  regionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  // 更改data
  changeUserInput(e) {
    let key = e.currentTarget.dataset.val;
    this.setData({
      ['user.'+key]: e.detail.value
    })
  },
})