// pages/map_module/gis_map_v2/gis_map_v2.js

const API = require('../../../utils/api.js');
const PROJECT = require('../../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    statusHeight: 44,
    navigateHeight: 44,
    /*********** 项目数据 **********/ 
    areaList: [], // 对应项目下区域列表

    /*********** 区域数据 **********/ 
    selectAreaMapSetting:null , // 选中区域下地图
    selectArea: null, // 选中区域
    selectAreaProducts:[], // 选中区域下所有设备
    selectAreaLightings:[], // 选中区域下设备中灯杆
    selectAreaVcrs: [], // 选中区域下设备监控
    selectAreaBroadcasts: [], // 选中区域下广播
    selectAreaScreens:[], // 选中区域下广播

    /*********** 选择区域 **********/ 
    changeAreaStatus: false, // 默认不选择

    /*********** 点击区域广播控制 **********/ 
    selectAreaBroadcastStatus: false, // 选中区域广播

    /*********** 点击区域灯光控制 **********/ 
    selectAreaLightingStatus: false, // 选中区域灯光

    /*********** 点击选中设备 **********/ 
    selectSignalProduct: null, // 选中设备
    selectSignalProductStatus: false, // 状态

    /*********** 点击选中筛选 **********/ 
    multipleStatus: false,
    multipleLists: [{name: '照明', id: 'lighting', status: false},{name: '广播', id: 'broadcast',status: false},{name: '监控', id: 'vcr',status: false},], // 多选列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'GIS地图'
    })

    this.setData({ statusHeight: app.globalData.statusHeight,navigateHeight: app.globalData.navigateHeight});

    this.netWorkForAreaList();
  },


  /**
   * ---------- 网络请求部分 ----------
   */

  // 请求区域列表
  netWorkForAreaList: function() {

    // 获取当前项目id
    const project = wx.getStorageSync('project');
    const projectId = project.id;
    API.post(API.mc_area_list,{projectId: projectId, token: 'string'}).then((res) => {
      this.setData({
        areaList: res.items,
        selectArea: res.items.length > 0 ? res.items[0] : null
      });
      this.networkForAreaItem({area:this.data.selectArea});
    });
  },

  // 区域对应设备
  networkForAreaItem: function ({area,filter}) {

    // 如果有筛选条件
    let params = !!filter ? {
      "queryConditions": {
        "areaId": area.id,
        "projectId": area.projectId,
        "type": "pole",
        "typeFilters": filter
      },
      "token": "string"
    } : {
      "queryConditions": {
        "areaId": area.id,
        "projectId": area.projectId,
        "type": "pole"
      },
      "token": "string"
    };

    API.post(API.mc_product_list,params).then((res) => {
      let productList = this.businessForChangeToShowLocation(res.items);
      let centerLocation = productList.length > 0 ? productList[0] : {};
      centerLocation = {
        latitude:this.data.selectArea.lat,
        longitude:this.data.selectArea.lng,
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
        selectAreaProducts: productList,
        selectAreaMapSetting: {
          centerLocation: centerLocation,
        },
        selectAreaLightings: lightings,
        // 区域下所有 vcr 设备
        selectAreaVcrs:vcrs,
        // 区域下所有 broadcast 设备
        selectAreaBroadcasts:broadcasts,
        // 区域下所有 screen 设备
        selectAreaScreens:screens,
      });
    });
  },


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
   * ---------- 地图操作 ---------
   */
  // 点击定位
  actionForLocation: function (){
    console.log("this.data.selectArea.latitude:"+this.data.selectArea.lat);
    console.log("this.data.selectArea.longitude:"+this.data.selectArea.lng);
    this.setData({
      selectAreaMapSetting: {
        centerLocation: {
          latitude:this.data.selectArea.lat,
          longitude:this.data.selectArea.lng,
        },
      },
    });
  },

  // 地图
  actionForChange: function (){
  },


  actionForChooseProduct: function (e){
    const selectId = e.markerId;
    let selectItem = this.data.selectAreaProducts[selectId];
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
      return a.showSetting['showIndex'] - b.showSetting['showIndex'];
    });

    selectItem.devices = settings;
    this.setData({
      selectSignalProduct: selectItem,
      selectSignalProductStatus: true
    });
  },
  /**
   * ---------- 区域选择 ----------
   */
  actionForChangeArea : function () {
    this.setData({
      changeAreaStatus: true
    })
  },

  // 选中区域
  actionForChooseArea: function (e) {
    let select = e.detail.item;
    this.setData({
      selectArea: select
    });
    this.networkForAreaItem({area:select});
  },

  /**
   * -------- 区域广播 ----------
   */
  // 点击区域广播
  actionForAreaBroadcast: function(){
    this.setData({
      selectAreaBroadcastStatus: true
    });
  },

  /**
   * ---------- 区域调光 ----------
   */
  actionForAreaLight: function () {
    this.setData({
      selectAreaLightingStatus: true
    });
  },
  
  /**
   * ---------- 设备列表 ----------
   */
  actionForDeviceList: function () {
    wx.navigateTo({
      url: '/pages/device_list/device_list'
    })
  },

  /**
   * ---------- 筛选 ---------
   */
  actionForSelect: function () {
    this.setData({
      multipleStatus: true,
    });
  },

  // 单选选中结果
  actionForMultipleSelects: function (e) {
    let lists = e.detail.selects;
    
    let querys = lists.filter(item => {
      return item.status;
    }).map(item => {
      return item.id;
    });

    let allStatus = lists.some(item => {
      return !item.status;
    })

    this.setData({
      multipleLists: lists
    })
    

    let selectArea = this.data.selectArea;
    if (allStatus) { // 单选
      this.networkForAreaItem({area:selectArea, filter: querys});
    } else { // 全选
      this.networkForAreaItem({area:selectArea});
    }
    
  },

})