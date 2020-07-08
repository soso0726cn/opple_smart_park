// pages/map_module/gis_map/gis_map.js

const API = require('../../../utils/api.js');
const PROJECT = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

      // 区域列表
      areaList:[],
      // 当前选中区域
      selectArea:{},
      // 当前区域设置
      areaSetting:{
        areaStatus: false, // 默认不显示
        openStatus: false,
        closeStatus: false
      },
      
      // 区域音频列表
      areaPlayList:[],
      // 选中音频
      selectAreaPlay:{},
      // 当前区域广播设置
      areaPlaySetting: {
        areaPlayStatus: false, // 默认不显示
      },

      // 区域音频列表显示状态
      areaPlayListStatus: false, // 默认不显示

      // 当前选中区域产品列表
      productList:[],
      // 当前选中产品
      selectProduct:{},
      // 当前选中产品设置
      productSetting:{
        productStatus: false, // 默认不显示
        openStatus: false,
        closeStatus: false
      },

      // 产品控制
      controlLightItem: {}, // 当前点击请求产品信息
      controlSetting: {
        controlStatus: false, // 默认不显示
      },

      // 广播控制
      controlBroadcastItem: {},
      controlBroadcastSetting: {
        controlStatus: false, // 默认不显示
      },

      lightings:[],
      // 区域下所有 vcr 设备
      vcrs:[],
      // 区域下所有 broadcast 设备
      broadcasts:[],
      // 区域下所有 screen 设备
      screens:[],
      // 视频监控
      controlVideoItem: {},

      // 地图相关设置
      mapSetting: {
        centerLocation: {
          latitude:'',
          longitude:'',
        },
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: 'GIS地图'
    })

    this.netWorkForAreaList();
  },

  /**
   * ---------- 网络请求部分 ----------
   */
  // 请求区域列表
  netWorkForAreaList: function() {

    API.post(API.mc_area_list,{projectId: PROJECT.projectId, token: 'string'}).then((res) => {
      console.log(res);
      this.setData({
        areaList: res.items,
        selectArea: res.items.length > 0 ? res.items[0] : null
      });
      this.networkForAreaItem(this.data.selectArea);
    }).catch(error => {
      console.log(error)
    });
  },

  // 区域对应产品
  networkForAreaItem: function (query) {

    const params = {
      "queryConditions": {
        "areaId": query.id,
        "projectId": query.projectId,
        "type": "pole"
      },
      "token": "string"
    };

    API.post(API.mc_product_list,params).then((res) => {
      console.log(res);
      let productList = this.businessForChangeToShowLocation(res.items);
      let centerLocation = productList.length > 0 ? productList[0] : {};
      centerLocation = {
        latitude:centerLocation.latitude,
        longitude:centerLocation.longitude,
      };
      // 获取对应区域下所有分模块设备
      let lightings = [];
      // 区域下所有 vcr 设备
      let vcrs = [];
      // 区域下所有 broadcast 设备
      let broadcasts = [];
      // 区域下所有 screen 设备
      let screens = [];
      productList.map(item => {
        item.devices.map((detail) => {
          if (detail.type === 'vcr') {
            vcrs.push(detail);
          } else if (detail.type === 'lighting') {
            lightings.push(detail);
          } else if (detail.type === 'broadcast') {
            broadcasts.push(detail);
          } else if (detail.type === 'screen') {
            screens.push(detail);
          }
        });
      });
      this.setData({
        productList: productList,
        mapSetting: {
          centerLocation: centerLocation,
        },
        lightings: lightings,
        // 区域下所有 vcr 设备
        vcrs:vcrs,
        // 区域下所有 broadcast 设备
        broadcasts:broadcasts,
        // 区域下所有 screen 设备
        screens:screens,
      });
    }).catch(error => {
      console.log(error)
    });
  },

  /**
   * ---------- 顶部按钮操作部分 ---------- 
   */
  // 处理地图定位点
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
    return showList;
  },

  /**
   * ---------- 顶部按钮操作部分 ----------
   */
  // 点击定位
  actionForLocation: function (){
    this.setData({
      mapSetting: {
        centerLocation: {
          latitude:'31.034777',
          longitude:'120.797248',
        },
      },
    });
  },
  // 点击选择区域
  actionForChangeArea: function(){
    if (this.areaList.length <= 1) return;
  },
  // 点击区域广播
  actionForAreaBroadcast: function(){
    this.actionForChange();
    this.setData({
      areaPlaySetting: {
        areaPlayStatus: !this.data.areaPlaySetting.areaPlayStatus, // 默认不显示
      },
    });
  },

  // 关闭区域广播
  actionForClose: function () {
    this.actionForChange();
  },

  // 点击区域照明
  actionForAreaLight: function(){
    this.actionForChange();
    this.setData({
      areaSetting:{
        areaStatus: !this.data.areaSetting.areaStatus, // 默认不显示
        openStatus: false,
        closeStatus: false
      },
    });
  },

  /**
   * 设备列表
   */
  actionForDeviceList: function () {
    wx.navigateTo({
      url: '/pages/device_list/device_list'
    })
  },

  /**
   * ---------- 区域部分 ----------
   */

  // 区域照明部分 状态
  actionForAreaLightStatus: function (e) {

    let params = {
      "areaPath": this.data.selectArea.id,
      "switchStatus": e.detail.status ? 1 : 0,
      "token": "string"
    };

    API.post(API.ls_device_area_switch,params).then((res) => {
      this.setData({
        areaSetting:{
          areaStatus: this.data.areaSetting.areaStatus,
          openStatus: e.detail.status,
          closeStatus: !e.detail.status
        },
      });
    }).catch(error => {
      console.log(error)
    });
  },

  // 区域调光部分
  actionForAreaLightChange: function (e) {
    console.log(e.detail.item);

    const params = {
      "areaPath": this.data.selectArea.id,
      "brightness": e.detail.item.brightness,
      "token": "string"
    };

    API.post(API.ls_device_area_control,params).then((res) => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    });
  },

  // 区域音频列表
  actionForAreaMusicList: function () {
    const params = {
      "projectId": 1,
      "token": "string"
    };

    API.post(API.bc_media_type_list,params).then((res) => {
      this.setData({
        areaPlayList: res.items,
        areaPlayListStatus: true,
      });
    }).catch(error => {
      console.log(error)
    });
  },

  // 选中音频
  actionForChooseMusic: function (e) {
    const item = e.detail.item;
    console.log(item);
    this.setData({
      selectAreaPlay: item,
      areaPlayListStatus: false, // 默认不显示
    })
  },

  // 播放区域音频
  actionForAreaPlayMusic: function (e) {
    const item = e.detail.item;
    const params = {
      areaIds: [
        this.data.selectArea.id,
      ],
      listId: item.id,
      mode: '1',
      "token": "string"
    };
    API.post(API.bc_manager_area_playList,params).then((res) => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    });
  },

  // 播放单个音频
  actionForProductPlayMusic: function (e) {
    const item = e.detail.item;
    console.log(item);
    const params = {
      "deviceIds": [
        this.data.selectArea.id
      ],
      listId: item.id,
      mode: '1',
      "token": "string"
    };
    API.post(API.bc_manager_device_playList,params).then((res) => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    });
  },

  // 停止播放区域音频
  actionForAreaStopMusic: function () {
    const params = {
      areaIds: [
        this.data.selectArea.id
      ],
      token: "string"
    };
    API.post(API.bc_manager_area_stopPlay,params).then((res) => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    });
  },

  // 停止播放单个
  actionForProductStopMusic: function () {
    const params = {
      deviceIds: [
        this.data.selectProduct.id
      ],
      token: "string"
    };
    API.post(API.bc_manager_device_stopPlay,params).then((res) => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    });
  },

  // 区域广播音量调整
  actionForAreaPlayVoice: function (e) {
    const item = e.detail.item;
    console.log(item)
    const params = {
      areaIds: [
        this.data.selectArea.id
      ],
      token: 'string',
      volume: item.brightness,
    };
    API.post(API.bc_manager_area_volumeSet,params).then((res) => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    });

  },

  // 单个调音量
  actionForProductPlayVoice: function (e) {
    const item = e.detail.item;
    console.log(item)
    const params = {
      deviceIds: [
        this.data.selectProduct.id
      ],
      token: 'string',
      volume: item.brightness,
    };
    API.post(API.bc_manager_device_volumeSet,params).then((res) => {
      console.log(res);
      let controlBroadcastItem = this.data.controlBroadcastItem;
      controlBroadcastItem.volume = item.brightness;
      this.setData({
        controlBroadcastItem: controlBroadcastItem,
      });
    }).catch(error => {
      console.log(error)
    });
  },

  // 关闭
  actionForProductBroadcastClose: function (e) {
    this.setData({
      controlBroadcastSetting: {
        controlStatus: false, // 默认不显示
      },
    });
  },

  /**
   * ---------- 单个产品调光部分 ----------
   */
  // 单个照明部分 状态
  actionForProductLightStatus: function (e) {

    let params = {
      "deviceId": this.data.controlLightItem.id,
      "switchStatus": e.detail.status ? 1 : 0,
      "token": "string"
    };

    API.post(API.ls_device_switch,params).then((res) => {
      this.setData({
        productSetting:{
          productStatus: this.data.productSetting.productStatus, // 默认不显示
          openStatus: e.detail.status,
          closeStatus: !e.detail.status
        },
      });
    }).catch(error => {
      console.log(error)
    });
  },

  // 单个调光部分
  actionForProductLightChange: function (e) {
    console.log(e.detail.item);

    const params = {
      "deviceId": this.data.controlLightItem.id,
      "brightness": e.detail.item.brightness,
      "token": "string"
    };

    API.post(API.ls_device_control,params).then((res) => {
      console.log(res);
    }).catch(error => {
      console.log(error)
    });
  },

  // 关闭
  actionForProductLightClose: function (e) {
    this.setData({
      productSetting:{
        productStatus: false, // 默认不显示
        openStatus: false,
        closeStatus: false
      },
    });
  },
  /**
   * ---------- 地图部分 ----------
   */
  actionForChange: function (){
    this.setData({
      controlSetting: {
        controlStatus: false, // 默认不显示
      },
      // 当前选中产品设置
      productSetting:{
        productStatus: false, // 默认不显示
        openStatus: false,
        closeStatus: false
      },

      // 区域调光
      areaSetting:{
        areaStatus: false, // 默认不显示
        openStatus: false,
        closeStatus: false
      },

      // 区域广播
      areaPlaySetting: {
        areaPlayStatus: false, // 默认不显示
      },

      controlBroadcastSetting: {
        controlStatus: false, // 默认不显示
      },

      areaPlayListStatus: false, // 默认不显示

      selectAreaPlay:{}, // 消除选中音频
    });
  },

  actionForChooseProduct: function (e){
    this.actionForChange();
    console.log(e);
    const selectId = e.markerId;
    let selectItem = this.data.productList[selectId];
    console.log(selectItem);
    let settings = (selectItem.devices || []);
    if (settings.length == 0) {
      wx.showToast({
        title: '暂无设备',
        icon: 'none'
      })
      return;
    }

    // 视频，照明，广播，屏幕
    settings = settings.map((item) => {
      if (item.type === 'vcr') {
        const showSetting = {image:'/assets/map_view/icon_camera.png',title:'监控',type:'vcr', showIndex: 0};
        item.showSetting = showSetting;
        return item;
      } else if (item.type === 'broadcast') {
        const showSetting = {image:'/assets/map_view/icon_broadcast.png',title:'广播',type:'broadcast', showIndex: 2};
        item.showSetting = showSetting;
        return item;
      } else if (item.type === 'lighting') {
        const showSetting = {image:'/assets/map_view/icon_light.png',title:'照明',type:'lighting', showIndex: 1};
        item.showSetting = showSetting;
        return item;
      } else if (item.type === 'screen') {
        const showSetting = {image:'/assets/map_view/icon_screen.png',title:'屏幕',type:'screen', showIndex: 3};
        item.showSetting = showSetting;
        return item;
      }
    });

    settings = settings.sort(function (a,b) {
      console.log('----------')
      console.log(a);
      console.log(b);
      console.log(a.showSetting['showIndex'] - b.showSetting['showIndex'])
      return a.showSetting['showIndex'] - b.showSetting['showIndex'];
    });

    selectItem.devices = settings;
    this.setData({
      selectProduct: selectItem,
      controlSetting: {
        controlStatus: !this.data.controlSetting.controlStatus, // 默认不显示
      },
    });
  },




  /**
   * ---------- 点击选中单个产品 ----------
   */
  actionForChooseControl: function (e) {
    const item = e.detail.item;

    console.log(item)
    
   

    if (item.type === 'lighting') { // 选中照明
       // 请求设备信息
    const params = {
      "deviceId": item.deviceId,
      "token": "string"
    };

      API.post(API.ls_device_info,params).then((res) => {
        this.actionForChange();
        this.setData({
          controlLightItem: res.data,
          // 当前选中产品设置
          productSetting:{
            productStatus: true, // 默认不显示
            openStatus: false,
            closeStatus: false
          },
        });
      }).catch(error => {
        console.log(error)
      });
      
    } else if(item.type === 'broadcast') { // 选中广播
       // 请求设备信息
    const params = {
      "id": item.deviceId,
      "token": "string"
    };
      API.post(API.bc_device_infor,params).then((res) => {
        this.actionForChange();
        let item = res.data;
        item.status = (item.status == 'idle' ? '空闲' : (item.status == 'offline' ? '离线' : (item.status == 'play' ? '广播' : (item.status == 'warning' ? '报警' : '空闲'))))
        this.setData({
          controlBroadcastItem: item,
          controlBroadcastSetting: {
            controlStatus: true, // 默认不显示
          },
        })
      }).catch(error => {
        console.log(error)

        // // warning ------------------ 接口通了之后需要删除 ------------
        // this.actionForChange();
        // this.setData({
        //   controlBroadcastItem: {},
        //   controlBroadcastSetting: {
        //     controlStatus: true, // 默认不显示
        //   },
        // })
      });
    } else if(item.type === 'vcr') { // 选中监控

      const param = {
        "id": item.deviceId,
        "token": "string"
      };

      API.post(API.vcr_ipc_infor,param).then((res) => {
        this.actionForChange();
        this.setData({
          controlVideoItem: res.data
        });
      }).catch(error => {
        console.log(error)
      });

      this.selectComponent("#video_modal").showVideoModal()
      
    } else if(item.type === 'screen') { // 选中屏幕
    }

    
  }
})