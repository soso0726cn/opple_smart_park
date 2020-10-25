// pages/visitor/visitor.js

const API = require('../../utils/api.js');

const TEST_PRODUCT1 = {
  areaId: 67,
  areaName: "展厅",
  createDate: "2020-03-12 16:52:05",
  devNum: 4,
  devices:[
    {
      deviceId: "3",
      id: 313,
      macAddress: "D42805075",
      name: "智慧灯杆",
      type: "vcr",
    },
    {
      deviceId: "3",
      id: 314,
      macAddress: "y30-a18-20236",
      name: "西门口屏幕",
      type: "screen",
    },
    {
      deviceId: "4",
      id: 312,
      macAddress: "867726031862537",
      name: "智慧灯杆照明",
      type: "lighting",
    },
    {
      deviceId: "144",
      id: 315,
      macAddress: "867726030294856",
      name: "nena测试",
      type: "lighting",
    }
  ],
  height: 50,
  iconPath: "/assets/map_view/icon_pole.png",
  id: 70,
  installer: "-",
  lat: 31.035164,
  latitude: 31.035164,
  lng: 120.795501,
  longitude: 120.795501,
  name: "智慧灯杆",
  poleType: 0,
  productModelId: 1,
  productModelName: "欧普灯杆",
  projectId: 1,
  projectName: "欧普环湖",
  remarks: "",
  serialNo: "智慧灯杆",
  status: 0,
  type: "pole",
  width: 35,
};

const TEST_PRODUCT2 = {
  areaId: 10,
  areaName: "欧普园区",
  createDate: "2020-07-08 17:53:16",
  devNum: 2,
  devices:[
    {
      deviceId: "20",
      id: 309,
      macAddress: "202642283",
      name: "展厅半球",
      type: "vcr",
    },
    {
      deviceId: "25",
      id: 310,
      macAddress: "8136",
      name: "8136",
      type: "broadcast",
    },
    {
      deviceId: "4",
      id: 312,
      macAddress: "867726031862537",
      name: "智慧灯杆照明",
      type: "lighting",
    },
    {
      deviceId: "144",
      id: 315,
      macAddress: "867726030294856",
      name: "nena测试",
      type: "lighting",
    }
  ],
  height: 50,
  iconPath: "/assets/map_view/icon_pole.png",
  id: 0,
  installer: "-",
  lat: 31.034563,
  latitude: 31.034563,
  lng: 120.795849,
  longitude: 120.795849,
  name: "展厅智多星",
  poleType: 0,
  productModelId: 1,
  productModelName: "欧普灯杆",
  projectId: 1,
  projectName: "欧普环湖",
  remarks: "",
  serialNo: "01",
  status: 0,
  type: "pole",
  width: 35,
};

Page({

   /**
   * 组件的初始数据
   */
  data: {

    currentProduct:TEST_PRODUCT1,

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
        if(this.data.currentProduct.devices[i].checked){
          this.data.currentProduct.devices[i].checked = false;
        }else{
          this.data.currentProduct.devices[i].checked = true;
        }
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
      API.post(API.ls_device_info,params).then(res => {
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
      API.post(API.bc_device_infor,params).then((res) => {
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
      API.post(API.vcr_ipc_infor,param).then((res) => {
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

      API.post(API.scn_device_info,param).then((res) => {
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