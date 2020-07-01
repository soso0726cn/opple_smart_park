// pages/center/center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '智慧园区运营中心'
    })

    let item = JSON.parse(options.item);
    this.setData({
      item: item
    });
  },

  /**
   * GIS地图
   */
  actionForMap: function () {
    let item = this.data.item;
    wx.navigateTo({
      url: '/pages/map_view/map_view?item=' + JSON.stringify(item),
    })
  },

  /**
   * 我的工作
   */
  actionForMyWork: function () {

  },

  /**
   * 用户信息
   */
  actionForUserInfo: function () {

  },

  /**
    * 项目切换
    */
  actionForProject: function () {
    wx.navigateBack();
  }

})