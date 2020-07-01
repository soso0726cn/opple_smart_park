// pages/device_list/device_list.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    tabList: [
      {
        title: '视频监控'
      },
      {
        title: '照明设备'
      }
    ],
    recommends: [
      {
        title: '园区监控门口',
        fee: '348',
        duration: '保障时间1年'
      },
      {
        title: '园区监控门口',
        fee: '688',
        duration: '保障时间2年'
      },
      {
        title: '园区监控门口',
        fee: '98',
        duration: '保障时间1.5年'
      }
    ],
    leftRecommends: [],
    rightRecommends: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var left = new Array()
    var right = new Array()
    let recommends = this.data.recommends
    for (let i = 0; i < recommends.length; ++i) {
      if (i % 2 === 0) {
        left.push(recommends[i])
      } else {
        right.push(recommends[i])
      }
    }

    this.setData({
      leftRecommends: left,
      rightRecommends: right
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})