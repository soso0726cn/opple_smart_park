// pages/login/login.js
const API = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '登录'
    })

    this.login()
  },

  login: function () {
    let self = this
    wx.login({
      success: (res) => {},
      complete: (res) => {
        if (res.errMsg === 'login:ok') {
          self.setData({
            code: res.code
          })
          console.log('------- code = ' + res.code)
        }
      }
    })
  },

  phone: function (e) {

    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv

    let param = {
      encryptedData: encryptedData,
      code: this.data.code,
      iv: iv
    }

    this.fetch(param)
  },

  userInfo: function (e) {

    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv

    let param = {
      encryptedData: encryptedData,
      code: this.data.code,
      iv: iv
    }

    this.fetch(param)
  },

  fetch: function (param) {
    const params = {
      "js_code": param.code
    };

    let self = this

    API.post(API.auth_user_mobile_wx_session_fetch, params).then((res) => {

      if (res.rstCode === 200) {

        console.log('------- fetch = ' + JSON.stringify(res))
        let para = {
          encryptedSession: res.encryptedSession,
          encryptedData: param.encryptedData,
          iv: param.iv
        }

        self.check(para)
      }
    }).catch(error => {
      console.log(error)
    });
  },

  check: function (param) {
    const params = {
      "encryptedData": param.encryptedData,
      "encryptedSession": param.encryptedSession,
      "iv": param.iv
    };

    API.post(API.auth_user_mobile_wx_phone_check, params).then((res) => {

      if (res.rstCode === 200) {
        console.log('------- check success = ' + JSON.stringify(res))
        wx.redirectTo({
          url: '/pages/main/main'
        })
      }
    }).catch(error => {
      console.log('----- check error -----' + JSON.stringify(error))
      let context = ''
      if (error.data.rstCode === 513) {
        context = '用户不存在'
      } else if (error.data.rstCode === 514) {
        context = '获取手机号码信息失败'
      } else {
        context = '请求失败'
      }
      wx.redirectTo({
        url: '/pages/equipment/equipment?context=' + context
      })
    });
  }
})