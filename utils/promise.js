//添加finally：因为还有一个参数里面还有一个complete方法。
var config = require('./config.js');
var util = require('./util.js');

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

//封装异步api
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}

const getLocationPromisified = wxPromisify(wx.getLocation);//获取经纬度
const showModalPromisified = wxPromisify(wx.showModal);//弹窗

// 封装post请求
const post = (url, data, type) => {
  var promise = new Promise((resolve, reject) => {
    wx.request({
      url: config.config.requestUrl + url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if(res.data.code == 0) {
            resolve(res.data);
          } else { 
            util.hideLoading()
            util.showModal('提示', res.data.msg);
          }
        } else {
          util.hideLoading()
          util.showModal('提示', res.data);
        }
      },
      error: function (e) {
        util.showModal('提示', '网络出错');
      }
    })
  });
  return promise;
}
// 封装get请求
const get = (url, data) => {
  var promise = new Promise((resolve, reject) => {
    wx.request({
      url: config.config.requestUrl + url,
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 0) {
            resolve(res.data);
          } else {
            util.hideLoading()
            util.showModal('提示', res.data.msg);
          }
        } else {
          util.hideLoading()
          util.showModal('提示', res.data);
        }
      },
      error: function (e) {
        util.showModal('提示', '网络出错');
      }
    })
  });
  return promise;
}

// 封装upload请求
const upload = (url, data) => {
  var promise = new Promise((resolve, reject) => {
    wx.uploadFile({
      url: config.config.requestUrl + url,
      filePath: data,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        resolve(JSON.parse(res.data));
      },
      fail(res) {
        util.showModal('提示', '上传失败');
      }
    })
  });
  return promise;
}

module.exports = {
  post,
  get,
  upload,
  getLocationPromisified,
  showModalPromisified
}