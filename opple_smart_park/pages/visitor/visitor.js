// pages/visitor/visitor.js
Page({

   /**
   * 组件的初始数据
   */
  data: {

    signalProduct:[
      {index:"0",type:"lighting",online:true},{index:"1",type:"broadcast",online:true},{index:"3",type:"vcr",online:true},{index:"4",type:"screen",online:true}
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
    var id = e.currentTarget.dataset.id
    for (var i = 0; i < this.data.signalProduct.length; i++) {
      if (this.data.signalProduct[i].index == id) {
        if(this.data.signalProduct[i].checked){
          this.data.signalProduct[i].checked = false;
        }else{
          this.data.signalProduct[i].checked = true;
        }
      }else{
        this.data.signalProduct[i].checked = false;
      }
    }
    this.setData(
      {
        signalProduct:this.data.signalProduct
      }
    )
    if(item.type === 'lighting'&& !item.checked){
      console.log("点击lighting");
      // this.setData({
      //   signalLightStatus: true,
      //   signalLight: null
      // });
    }
    if(item.type === 'broadcast'&& !item.checked){
      console.log("点击broadcast");
      // this.setData({
      //   signalBroadcastStatus: true,
      //   signalBroadcast: null
      // })
    }
    if(item.type === 'vcr'&& !item.checked){
      console.log("点击vcr");
      // this.setData({
      //   signalVcrStauts: true,
      //   signalVcr: null
      // });
    }
    if(item.type === 'screen'&& !item.checked){
      console.log("点击screen");
      // this.setData({
      //   signalAdStatus: true,
      //   signalAd: null
      // });
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