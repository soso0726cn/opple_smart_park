// pages/component_module/product_module/product_control_component/product_control_component.js

const API = require('../../../../utils/api.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Boolean,
      value: false
    },

    product: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

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

  /**
   * 组件的方法列表
   */
  methods: {
    actionForClose: function (e) {
      this.setData({
        status: false,
        signalLightStatus: false,
        signalLight: null, // 照明设备
        signalBroadcastStatus: false,
        signalBroadcast: null,
        signalVcrStauts: false,
        signalVcr: null,
        signalAdStatus:false,
        signalAd:null
      })
    },

    actionForChooseControl: function (e) {
      const item = e.currentTarget.dataset.item;
      console.log(item)
      if (item.type === 'lighting') { // 选中照明
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
        
      } else if(item.type === 'broadcast') { // 选中广播
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
      } else if(item.type === 'vcr') { // 选中监控
  
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
        
      } else if(item.type === 'screen') { // 选中屏幕
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
  }
  
})
