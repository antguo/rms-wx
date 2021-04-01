const app = getApp();
const cache = require('cache.js');
const util = require('util.js');
var config = require('./config.js');

function request(url, options) {
  var that = this;
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.host + url,
      method: options.method || 'post',
      data: options.data,
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'token': cache.getToken(),
      },
      success(res) {
        if (res.statusCode == 200){
          if (res.data.code == 0) {
            resolve(res.data)
          } else if (res.data.code == 401) {
            cache.clear()
            showToast('您还未登录，请先登录！', function () {
              setTimeout(function () {
                wx.reLaunch({
                  url: "/pages/mine/login/login"
                })
              }, 1000)
            });
          } else {
            util.hideLoading();
            util.showToast(res.data.msg);
            reject()
          }
        } else {
          util.hideLoading();
          showModal('提示', '请求超时，请稍后再试');
        }
      },
      fail(error) {
        reject(error.data)
      },
      complete(){
        
      }
    })
  })
}

function isLogin() {
  return wx.getStorageSync('token') ? true : false;
}

function showToast(content, success){
  wx.showToast({
    title: content,
    icon: 'none',
    success: function () {
      if(success) {
        success();
      }
    }
  });
}

function showModal(title, content){
  wx.showModal({
    title: title,
    content: content,
    showCancel: false
  });
}


function uploadImg(imgPaths, index, successFiles, callBack, urlName = "url") {
  var that = this;
  wx.showLoading({
    title: '正在上传第' + (index+1) + '张',
  })
  if (imgPaths[index].slice(0, 5) == 'https') {
    // 网络图片,不需要上传
    successFiles.push(imgPaths[index]);
    index++; //下一张
    if (index == imgPaths.length) {
      wx.hideLoading();
      //上传完毕，作一下提示
      wx.showToast({
        title: '上传成功',
        icon: 'success',
      });
      if (callBack) {
        callBack(successFiles);
      }
    } else {
      //递归调用，上传下一张
      that.uploadImg(imgPaths, index, successFiles, callBack);
    }
    return;
  }
  wx.uploadFile({
    url: config.config.requestUrl + "/app/oss/upload",
    filePath: imgPaths[index],
    name: 'file',
    header: {
      "Content-Type": "multipart/form-data"
    },
    success: function (res) {
      //成功,文件返回值存入成功列表
      if (res && res.data) {
        var data = JSON.parse(res.data);
        if (data[urlName]) {
          successFiles.push(data[urlName]);
        }
      }
    },
    complete: function (e) {
      index++; //下一张
      if (index == imgPaths.length) {
        wx.hideLoading();
        //上传完毕，作一下提示
        wx.showToast({
          title: '上传成功',
          icon: 'success',
        });
        if (callBack) {
          callBack(successFiles);
        }
      } else {
        //递归调用，上传下一张
        that.uploadImg(imgPaths, index, successFiles, callBack);
      }
    }
  })
}

module.exports = {
  request: request,
  isLogin: isLogin,
  uploadImg: uploadImg
}