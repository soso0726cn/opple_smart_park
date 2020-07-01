// pages/map_view/map_view.js

const APi = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    item:{}, // 选中项目
    areaList:[], // 区域列表
    productList:[], // 设备列表

    // 显示选中区域
    showSelectItem:{
      item:{}, // 选中区域
    },

    // 显示切换区域
    showChangeItem: {
      status: false,
    },
    
    // 音量设置
    voiceStatus: false,
    voices:[
      {voice: '0%', status: false},
      {voice: '25%', status: false},
      {voice: '50%', status: true},
      {voice: '75%', status: false},
      {voice: '100%', status: false},
    ],

    // 区域开灯
    lightStatus: false,
    lightOn: false, // 区域开灯选中状态
    lightOff: false, // 区域关灯选中状态
    lights:[
      {light: '0%', status: false,brightness:"0"},
      {light: '25%', status: false,brightness:"25"},
      {light: '50%', status: true,brightness:"50"},
      {light: '75%', status: false,brightness:"75"},
      {light: '100%', status: false,brightness:"100"},
    ],

    // 灯杆操作配置
    pole: {
      status: false,
      title: '',
      settings: [
        {image:'/assets/map_view/icon_camera.png',title:'监控'},
        {image:'/assets/map_view/icon_light.png',title:'照明'},
        {image:'/assets/map_view/icon_broadcast.png',title:'广播'},
        {image:'/assets/map_view/icon_screen.png',title:'屏幕'},
      ],
    },

    // 灯杆操作配置-点击广播
    poleBroadcastStatus: false,
    // 灯杆操作配置-点击照明
    poleLightStatus: false,

    // 地图相关设置
    map: {
      scale: 12,
      centerLocation: {
        latitude:'31.034777',
        longitude:'120.797248',
      },
    },

    // 选中单设备信息
    deviceInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'GIS地图'
    })

    // let item = JSON.parse(options.item);
    // this.setData({
    //   item: item
    // });

    this.networkForAreaList();
  
  },

  /**
   * 网络请求，请求区域列表
   */
  networkForAreaList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });

    const api = APi.mc_area_list;

    wx.request({
      url: api,
      data: {projectId: 1, token: 'string'},
      method: 'POST',
      success: function (res) {
        console.log(res);
        // 如果请求成功
        if (res.data.rstCode === 200) {
          that.setData({
            areaList: res.data.items,
            // 默认选中第一条
            showSelectItem: {
              item: res.data.items.length > 0 ? res.data.items[0] : null
            }
          });

          const query = that.data.showSelectItem.item;
          if (!!query) {
            that.networkForAreaItem(query);
          }
          
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

  // 请求园区具体项目数据
  networkForAreaItem: function (query) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const api = APi.mc_product_list;
    const params = {
      "queryConditions": {
        "areaId": query.id,
        "projectId": query.projectId,
        "type": "pole"
      },
      "token": "string"
    };
    wx.request({
      url: api,
      data: params,
      method: 'POST',
      success: function (res) {
        console.log(res);
        // 如果请求成功
        if (res.data.rstCode === 200) {
          that.businessForChangeToShowLocation(res.data.items);
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


  actionForCallOutTap: function (e) {
    console.log(e);
    const selectId = e.markerId;
    const selectItem = this.data.productList[selectId];
    console.log(selectItem);
    // 判断当前有是否有 监控、照明、广播、屏幕等信息，有什么现实什么
    // vcr:监控 {image:'/assets/map_view/icon_camera.png',title:'监控'}
    // broadcast:广播 {image:'/assets/map_view/icon_broadcast.png',title:'广播'}
    // lighting:照明 {image:'/assets/map_view/icon_light.png',title:'照明'}
    // screen:屏幕 {image:'/assets/map_view/icon_screen.png',title:'屏幕'}

    let settings = (selectItem.devices || []).map((item) => {
      if (item.type === 'vcr') {
        return {image:'/assets/map_view/icon_camera.png',title:'监控',type:'vcr',item: item}
      } else if (item.type === 'broadcast') {
        return {image:'/assets/map_view/icon_broadcast.png',title:'广播',type:'broadcast',item: item}
      } else if (item.type === 'lighting') {
        return {image:'/assets/map_view/icon_light.png',title:'照明',type:'lighting',item: item};
      } else if (item.type === 'screen') {
        return {image:'/assets/map_view/icon_screen.png',title:'屏幕',type:'screen',item: item}
      }
    });
    this.setData({
      pole: {
        status: true,
        title: selectItem.name || '',
        settings: settings,
      },
      lightStatus: false,
      voiceStatus: false,
      poleBroadcastStatus: false,
      poleLightStatus: false
    });
  },

  // 点击消息
  actionForMessage: function () {
    wx.navigateTo({
      url: '/pages/device_list/device_list'
    })
  },

  // 点击上报功能
  actionForReport : function () {
    wx.showToast({
      title: '点击进入上报',
    })
  },

  actionForNight: function (e) {

    const currentSelectIndex = e.currentTarget.dataset.index;
    const selectItem = this.data.pole.settings[currentSelectIndex];
    // vcr:监控 {image:'/assets/map_view/icon_camera.png',title:'监控'}
    // broadcast:广播 {image:'/assets/map_view/icon_broadcast.png',title:'广播'}
    // lighting:照明 {image:'/assets/map_view/icon_light.png',title:'照明'}
    // screen:屏幕 {image:'/assets/map_view/icon_screen.png',title:'屏幕'}

    // 请求单设备信息
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const api = APi.ls_device_info;
    const params = {
      "deviceId": selectItem.item.deviceId,
      "token": "string"
    };
    wx.request({
      url: api,
      data: params,
      method: 'POST',
      success: function (res) {
        console.log(res);
        // 如果请求成功
        if (res.data.rstCode === 200) {
          that.setData({
            deviceInfo: res.data.data
          })
        }
      },
      fail: function (error) {
        console.log(error);
      },
      complete: function () {
        wx.hideLoading();
      }
    })

    if (selectItem.type === 'lighting') { // 选中照明
      this.actionForChange();
      this.setData({
        poleLightStatus: true
      });
    } else if(selectItem.type === 'broadcast') { // 选中广播
      this.actionForChange();
      this.setData({
        poleBroadcastStatus: true
      })
    } else if(selectItem.type === 'vcr') { // 选中监控
      
    } else if(selectItem.type === 'screen') { // 选中屏幕
    }
  },

  // 单个灯杆照明开灯
  actionForPoleTurnOn: function (){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const api = APi.ls_device_switch;
    const params = {
      "deviceId": this.data.deviceInfo.id,
      "switchStatus": 1,
      "token": "string"
    };
    wx.request({
      url: api,
      data: params,
      method: 'POST',
      success: function (res) {
        console.log(res);
        // 如果请求成功
        if (res.data.rstCode === 200) {
          that.setData({
            lightOn: true, // 区域开灯选中状态
            lightOff: false
          })
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
  // 单个灯杆照明关灯
  actionForPoleTurnOff: function (){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const api = APi.ls_device_switch;
    const params = {
      "deviceId": this.data.deviceInfo.id,
      "switchStatus": 0,
      "token": "string"
    };
    wx.request({
      url: api,
      data: params,
      method: 'POST',
      success: function (res) {
        console.log(res);
        // 如果请求成功
        if (res.data.rstCode === 200) {
          that.setData({
            lightOn: false, // 区域开灯选中状态
            lightOff: true
          })
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

  // 关闭弹框
  actionForClose: function (){
    this.actionForChange();
  },
  
  // 单个灯杆调光
  actionForPoleTurnLight: function() {
    // 默认必须有一个选中
    const selectItem = this.data.lights.filter((item) => {
      return item.status;
    });
    console.log(selectItem);
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const api = APi.ls_device_area_switch;
    const params = {
      "deviceId": this.data.deviceInfo.id,
      "brightness": selectItem.brightness,
      "token": "string"
    };
    wx.request({
      url: api,
      data: params,
      method: 'POST',
      success: function (res) {
        console.log(res);
        // 如果请求成功
        if (res.data.rstCode === 200) {
         
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
  // 视野变化
  actionForChange: function () {
    this.setData({
      pole: {
        status: false,
        title: this.data.pole.title,
        settings: this.data.pole.settings,
      },
      lightStatus: false,
      voiceStatus: false,
      poleBroadcastStatus: false,
      poleLightStatus:false,
      lightOn: false, // 区域开灯选中状态
        lightOff: false
    });
  },

  // 放大
  actionForPlus: function () {
    let scale = this.data.map.scale;
    scale = (scale + 1) > 20 ? 20 : scale + 1;
    this.setData({
      map: {
        scale: scale,
        centerLocation: this.data.map.centerLocation
      }
    });
  },

  // 缩小
  actionForReduce: function () {
    let scale = this.data.map.scale;
    scale = (scale - 1) < 3 ? 3 : scale - 1;
    this.setData({
      map: {
        scale: scale,
        centerLocation: this.data.map.centerLocation
      }
    });
  },

  // 选中区域广播
  actionForVoiceSetting: function () {
    let status =  !this.data.voiceStatus;
    this.setData({
      voiceStatus: status,
      lightStatus: false,
      pole: {
        status: false,
        title: this.data.pole.title,
        settings: this.data.pole.settings,
      },
      poleBroadcastStatus: false,
      poleLightStatus:false
    });
  },

  // 选中区域广播音量
  actionForChooseVoice: function (e) {
    const currentSelectIndex = e.currentTarget.dataset.index;
    let voices = this.data.voices.map((item,index) => {
      item['status'] = currentSelectIndex === index ;
      return item;
    });

    this.setData({
      voices: voices
    });
  },


  // 选中区域开关灯
  actionForLightSetting: function () {
    let status = !this.data.lightStatus;
    this.setData({
      lightStatus: status,
      voiceStatus: false,
      pole: {
        status: false,
        title: this.data.pole.title,
        settings: this.data.pole.settings,
      },
      poleBroadcastStatus: false,
      poleLightStatus:false
    });
  },

  // 选中区域开灯状态
  actionForChooseLight: function (e) {
    const currentSelectIndex = e.currentTarget.dataset.index;
    let lights = this.data.lights.map((item,index) => {
      item['status'] = currentSelectIndex === index ;
      return item;
    });

    this.setData({
      lights: lights
    });
  },

  // 区域调光
  actionForAreaTurnLight : function () {
    // 默认必须有一个选中
    const selectItem = this.data.lights.filter((item) => {
      return item.status;
    });
    console.log(selectItem);
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const api = APi.ls_device_area_switch;
    const params = {
      "areaPath": this.data.showSelectItem.item.id,
      "brightness": selectItem.brightness,
      "token": "string"
    };
    wx.request({
      url: api,
      data: params,
      method: 'POST',
      success: function (res) {
        console.log(res);
        // 如果请求成功
        if (res.data.rstCode === 200) {
         
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

  // 区域开灯
  actionForAreaTurnOn: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const api = APi.ls_device_area_switch;
    const params = {
      "areaPath": this.data.showSelectItem.item.id,
      "switchStatus": 1,
      "token": "string"
    };
    wx.request({
      url: api,
      data: params,
      method: 'POST',
      success: function (res) {
        console.log(res);
        // 如果请求成功
        if (res.data.rstCode === 200) {
          that.setData({
            lightOn: true, // 区域开灯选中状态
            lightOff: false
          })
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

  // 区域关灯
  actionForAreaTurnOff: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const api = APi.ls_device_area_switch;
    const params = {
      "areaPath": this.data.showSelectItem.item.id,
      "switchStatus": 0,
      "token": "string"
    };
    wx.request({
      url: api,
      data: params,
      method: 'POST',
      success: function (res) {
        console.log(res);
        // 如果请求成功
        if (res.data.rstCode === 200) {
          that.setData({
            lightOn: false, // 区域开灯选中状态
            lightOff: true
          })
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

  // 点击切换园区
  actionForChangeArea: function () {
    this.setData({
      showChangeItem: {
        status: true,
      },
    });
  },

  // 点击隐藏切换园区
  actionForHideChangeItem: function () {
    this.setData({
      showChangeItem: {
        status: false,
      },
    });
  },

  // 点击选中园区
  actionForSelectChnageItem: function (e) {
    var that = this;
    this.actionForHideChangeItem();
    const selectItem = e.currentTarget.dataset.item;
    that.setData({
      // 默认选中第一条
      showSelectItem: {
        item: selectItem
      }
    });

    const query = that.data.showSelectItem.item;
    if (!!query) {
      that.networkForAreaItem(query);
    }
    
  },

  // 业务代码，装换请求数据经纬度为地图显示点经纬度
  businessForChangeToShowLocation: function(lists) {
    const showList = lists.map((item,index) => {
      item['iconPath'] = "/assets/map_view/icon_pole.png";
      item['id'] = index;
      item['latitude'] = parseFloat(item.lat || '');
      item['longitude'] = parseFloat(item.lng || '');
      item['width'] = 35;
      item['height'] = 50;
      return item;
    });

    let centerLocation = showList.length > 0 ? showList[0] : {};
    centerLocation = {
      latitude:centerLocation.latitude,
      longitude:centerLocation.longitude,
    };

    this.setData({
      productList: showList,
      map: {
        scale: this.data.map.scale,
        centerLocation: centerLocation,
      }
    });
  },

  /**
   * 点击定位
   */
  actionForLocation: function () {
    this.setData({
      map: {
        scale: 12,
        centerLocation: {
          latitude:'31.034777',
          longitude:'120.797248',
        },
      },
    });
  }
})