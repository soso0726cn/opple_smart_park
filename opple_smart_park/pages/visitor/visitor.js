// pages/visitor/visitor.js

const API = require('../../utils/api.js');

const TEST_PRODUCT_114 = {
  "id": 114,
  "name": "智慧灯杆A",
  "areaId": 84,
  "areaName": "会展中心",
  "projectId": 39,
  "projectName": "进博会",
  "productModelId": 1,
  "productModelName": "欧普灯杆",
  "lat": 31.189648,
  "lng": 121.301593,
  "type": "pole",
  "status": 0,
  "serialNo": "EPLOE2020-A",
  "devNum": 0,
  "remarks": "",
  "installer": "-",
  "devices": [
    {
      "id": 34,
      "deviceId": "34",
      "type": "vcr",
      "macAddress": "867726030859963",
      "name": "1"
    },
    {
      "id": 137,
      "deviceId": "137",
      "type": "lighting",
      "macAddress": "ba7db984e8f211b8",
      "name": "环湖屏幕"
    },
    // {
    //   "id": 25,
    //   "deviceId": "25",
    //   "type": "broadcast",
    //   "macAddress": "867726030859963",
    //   "name": "1"
    // },
    {
      "id": 36,
      "deviceId": "36",
      "type": "screen",
      "macAddress": "ba7db984e8f211b8",
      "name": "环湖屏幕"
    }
  ],
  "createDate": "2020-10-29 12:29:47",
  "poleType": 1
};

const TEST_PRODUCT_115 =  {
  "id": 115,
  "name": "智慧灯杆B",
  "areaId": 84,
  "areaName": "会展中心",
  "projectId": 39,
  "projectName": "进博会",
  "productModelId": 1,
  "productModelName": "欧普灯杆",
  "lat": 31.189687,
  "lng": 121.301548,
  "type": "pole",
  "status": 0,
  "serialNo": "EPLOE2020-B",
  "devNum": 0,
  "remarks": "",
  "installer": "-",
  "devices": [
    {
      "id": 33,
      "deviceId": "33",
      "type": "vcr",
      "macAddress": "867726030859963",
      "name": "1"
    },
    {
      "id": 138,
      "deviceId": "138",
      "type": "lighting",
      "macAddress": "ba7db984e8f211b8",
      "name": "环湖屏幕"
    },
    // {
    //   "id": 25,
    //   "deviceId": "25",
    //   "type": "broadcast",
    //   "macAddress": "867726030859963",
    //   "name": "1"
    // },
    {
      "id": 37,
      "deviceId": "37",
      "type": "screen",
      "macAddress": "ba7db984e8f211b8",
      "name": "环湖屏幕"
    }
  ],
  "createDate": "2020-10-29 12:30:49",
  "poleType": 1
};

Page({

   /**
   * 组件的初始数据
   */
  data: {

    currentProduct:null,

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
    for (var i = 0; i < this.data.currentProduct.devices.length; i++) {
      if (this.data.currentProduct.devices[i].id == item.id) {
        this.data.currentProduct.devices[i].checked = true;
      }else{
        this.data.currentProduct.devices[i].checked = false;
      }
    }
    this.setData(
      {
        currentProduct:this.data.currentProduct
      }
    )
    if(item.type === 'lighting'&& !item.checked){
      console.log("点击lighting");
      // 请求设备信息
      const params = {
        "deviceId": item.deviceId,
        "token": "string"
      };
      API.postNoLoading(API.ls_device_info,params).then(res => {
        this.setData({
          signalLightStatus: true,
          signalLight: res.data
        });
      });
    }
    if(item.type === 'broadcast'&& !item.checked){
      console.log("点击broadcast");
      // 请求设备信息
      const params = {
        "id": item.deviceId,
        "token": "string"
      };
      API.postNoLoading(API.bc_device_infor,params).then((res) => {
        let item = res.data;
        item.showStatus = (item.status == 'idle' ? '空闲' : (item.status == 'offline' ? '离线' : (item.status == 'play' ? '正在播放' : (item.status == 'warning' ? '报警' : '空闲'))))
        this.setData({
          signalBroadcastStatus: true,
          signalBroadcast: item
        })
      });
    }
    if(item.type === 'vcr'&& !item.checked){
      console.log("点击vcr");
      const param = {
        "id": item.deviceId,
        "token": "string"
      };
      API.postNoLoading(API.vcr_ipc_infor,param).then((res) => {
        this.setData({
          signalVcrStauts: true,
          signalVcr: res.data
        });
      });
    }
    if(item.type === 'screen'&& !item.checked){
      console.log("点击screen");
      const param = {
        "deviceId": item.deviceId,
        "token": "string"
      };

      API.postNoLoading(API.scn_device_info,param).then((res) => {
        let item = res.data;
        if (item.online === 0) {
          item.onlineContext = '设备离线'
        } else if (item.online === 1) {
          item.onlineContext = '设备在线'
        } else {
          item.onlineContext = '设备报警'
        }
        this.setData({
          signalAdStatus: true,
          signalAd: item
        });
      });
    }
  },

  noAction:function(){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var qrCode = decodeURIComponent(options.q);
    var home = "https://zhiyuan.opple.com/wx?pole=";
    console.log("qrCode:"+qrCode);
    if(qrCode.startsWith(home)){
      console.log("通过二维码扫描地址:"+qrCode);  
      var id = qrCode.substring(home.length,qrCode.length);
      console.log("通过二维码扫描ID:"+id);  
      if(id == "114"){
        this.setData({
          currentProduct:TEST_PRODUCT_114,
          signalLightStatus: false,
          signalLight: null,
          signalBroadcastStatus: false,
          signalBroadcast: null,
          signalVcrStauts: false,
          signalVcr: null,
          signalAdStatus: false,
          signalAd: null,
        })
      }
      if(id == "115"){
        this.setData({
          currentProduct:TEST_PRODUCT_115,
          signalLightStatus: false,
          signalLight: null,
          signalBroadcastStatus: false,
          signalBroadcast: null,
          signalVcrStauts: false,
          signalVcr: null,
          signalAdStatus: false,
          signalAd: null,
        })
      }
    }else{
      this.data.currentProduct = wx.getStorageSync('currentVisitorProduct')
      console.log("currentProduct in cache:"+this.data.currentProduct)
      if(this.data.currentProduct!=null){
        this.setData({
          currentProduct:this.data.currentProduct
        })
      }
    }
    // this.setData({
    //   currentProduct:TEST_PRODUCT_115
    // })
    if(this.data.currentProduct!=null){
      var project = {
        'id':this.data.currentProduct.projectId
      }
      console.log("project id:"+project.id)
      wx.setStorageSync('project', project)
      wx.setStorageSync('visitor', true);
      wx.setStorageSync('currentVisitorProduct', this.data.currentProduct);
    }
  },

  receiveValue:function(res){
    console.log(res);
    if(res.detail=="close"){
      for (var i = 0; i < this.data.currentProduct.devices.length; i++) {
        this.data.currentProduct.devices[i].checked = false;
      }
      this.setData(
        {
          currentProduct:this.data.currentProduct
        }
      )
    }
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

  },

})