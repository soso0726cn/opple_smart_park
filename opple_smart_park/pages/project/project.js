// pages/project/project.js


const APi = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectItems:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '项目选择'
    })
    this.networkForProjectList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 请求项目列表
   */
  networkForProjectList : function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    let api = APi.mc_project_list;
    wx.request({
      url: api,
      data: {regionID: 1, token: 'string'},
      method: 'POST',
      success: function (res) {
        // 如果请求成功
        if (res.data.rstCode === 200) {
          that.setData({
            projectItems: res.data.items
          });
        }
      },
      fail: function (error) {
        console.log(error);
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },


  /**
   * 选中项目
   */
  actionForChooseItem: function (e) {
    let item = e.currentTarget.dataset.item;
    console.log(item);
    wx.navigateTo({
      url: '/pages/center/center?item=' + JSON.stringify(item),
    })
  }

})