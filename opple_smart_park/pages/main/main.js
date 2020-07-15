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
  locationOnTap: function () {
    wx.navigateTo({
      url: '/pages/map_module/gis_map/gis_map'
    })
  },

  // 设备录入
  scanOnTap: function () {

  },

  // 设备列表
  listOnTap: function () {

  },

  // 事件中心
  centerOnTap: function () {
    
  },

  // 我的账号
  accountOnTap: function () {
    
  }

})