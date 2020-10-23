// pages/visitor/visitor.js
Page({

   /**
   * 组件的初始数据
   */
  data: {

    signalProduct:[
      {type:"lighting"},{type:"broadcast"},{type:"vcr"},{type:"screen"}
    ],

    /*********** 照明设备 **********/ 
    signalLightStatus: false,
    signalLight: null, // 照明设备

    /*********** 广播设备 **********/ 
    signalBroadcastStatus: false,
    signalBroadcast: null,

    /*********** 视频设备 **********/ 
    signalVcrStauts: false,
    signalVcr: null,

    /*********** 广告设备 **********/ 
    signalAdStatus: false,
    signalAd: null,
  },

  actionForChooseControl: function (e){
    const item = e.currentTarget.dataset.item;
    console.log(item);
    if(item.type === 'lighting'){
      console.log("点击lighting");
      this.setData({
        signalLightStatus: true,
        signalLight: null
      });
    }
    if(item.type === 'broadcast'){
      console.log("点击broadcast");
      this.setData({
        signalBroadcastStatus: true,
        signalBroadcast: null
      })
    }
    if(item.type === 'vcr'){
      console.log("点击vcr");
      this.setData({
        signalVcrStauts: true,
        signalVcr: null
      });
    }
    if(item.type === 'screen'){
      console.log("点击screen");
      this.setData({
        signalAdStatus: true,
        signalAd: null
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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