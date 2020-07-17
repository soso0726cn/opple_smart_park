// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // 地图
  locationOnTap: async function () {
    let check = await this.check()
    if (check) {
      wx.navigateTo({
        url: '/pages/map_module/gis_map/gis_map'
      })
    }
  },

  // 设备录入
  scanOnTap: async function () {
    let check = await this.check()
    if (check) {
      console.log('------ 设备录入 ------')
    }
  },

  // 设备列表
  listOnTap: async function () {
    let check = await this.check()
    if (check) {
      console.log('------ 设备列表 ------')
    }
  },

  // 事件中心
  centerOnTap: async function () {
    let check = await this.check()
    if (check) {
      console.log('------ 事件中心 ------')
    }
  },

  // 我的账号
  accountOnTap: async function () {
    let check = await this.check()
    if (check) {
      wx.navigateTo({
        url: '/pages/setting/setting'
      })
    }
  },

  check: async function () {

    let isLogin = false
    let self = this

    await wx.checkSession().then((res) => {
      if (res.errMsg === 'checkSession:ok') {
        isLogin = true
      } else {
        self.redicetToLogin()
      }
    }).catch(err => {
      self.redicetToLogin()
    })

    return isLogin;
  },

  redicetToLogin: function () {
    wx.redirectTo({
      url: '/pages/login/login'
    })
  }

})