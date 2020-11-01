// pages/component_module/light_module/signal_light_component/signal_light_component.js

const API = require('../../../../utils/api.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  是否显示区域调光
    status: {
      type:Boolean,
      value: false,
    },

    product: {
      type: Object,
      value: null,
      observer: function (newVal) {
        if ( Object.keys(newVal).length != 0) {
          if (newVal.switchOn) { // 开灯状态
            this.setData({
              openStatus: true,
              closeStatus: false
            });
          } else if (!newVal.switchOn) { // 关灯状态
            this.setData({
              openStatus: false,
              closeStatus: true
            });
          }

          let level = !!newVal.lastRec ? (newVal.lastRec.level || 0) : 0;
          if (level == 0) {
            this.toolsForLight(0);
          }else if (level > 0 && level <= 25) {
            this.toolsForLight(1);
          } else if (level > 25 && level <= 50) {
            this.toolsForLight(2);
          } else if (level > 50 && level <= 75) {
            this.toolsForLight(3);
          } else {
            this.toolsForLight(4);
          }
        }
      }
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    lists:[
      {show: '0', status: true,level:"0"},
      {show: '25', status: false,level:"25"},
      {show: '50', status: false,level:"50"},
      {show: '75', status: false,level:"75"},
      {show: '100', status: false,level:"100"},
    ],
    openStatus: false,
    closeStatus: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * ---------- V2.0 操作 ----------
     */
    actionForClose: function () {
      this.setData({
        status: false
      });
      this.triggerEvent("homePage", "close");
    },

    // 开灯
    actionForProductLightOpen: function () {
      if (!this.data.product.lastRec.online) {
        wx.showToast({
          icon:'none',
          title: '当前设备离线状态',
        })
        return;
      }

      let params = {
        "deviceId": this.data.product.id,
        "switchStatus": 1,
        "token": "string"
      };

      let that = this;
      API.post(API.ls_device_switch,params).then((res) => {
        that.setData({
          openStatus: true,
          closeStatus: false
        });
        
      }).catch(error => {
        wx.showToast({
          icon:'none',
          title: '当前设备开灯失败',
        })
      });
    },

    // 关灯
    actionForProductLightClose: function () {
      if (!this.data.product.lastRec.online) {
        wx.showToast({
          icon:'none',
          title: '当前设备离线状态',
        })
        return;
      }

      let params = {
        "deviceId": this.data.product.id,
        "switchStatus": 0,
        "token": "string"
      };

      let that = this;
      
      API.post(API.ls_device_switch,params).then((res) => {
        that.setData({
          openStatus: false,
          closeStatus: true
        });
      }).catch(error => {
        wx.showToast({
          icon:'none',
          title: '当前设备关灯失败',
        })
      });
    },

    // 选中
    actionForProductLightChoose: function (e) {

      if (!this.data.product.lastRec.online) {
        wx.showToast({
          icon:'none',
          title: '当前设备离线状态',
        })
        return;
      }

      const currentSelectIndex = e.currentTarget.dataset.index;
      let selectItem = this.data.lists[currentSelectIndex];
      let lights = this.data.lists.map((item,index) => {
        item['status'] = currentSelectIndex === index ;
        return item;
      });
  
      this.setData({
        lists: lights
      });


      const params = {
        "deviceId": this.data.product.id,
        "brightness": selectItem.level,
        "token": "string"
      };
      let that = this;
      let product = this.data.product;
      API.post(API.ls_device_control,params).then(res => {
        product.lastRec.level = selectItem.level;
        that.setData({
          product: product
        });
      }).catch(() => {
        wx.showToast({
          icon:'none',
          title: '当前设备调光失败',
        })
      });

    },

    /**
     * ---------- 设置调光状态 ----------
     */
    toolsForLight: function (selectIndex) {
      let lights = this.data.lists.map((item,index) => {
        item['status'] = selectIndex === index ;
        return item;
      });
      this.setData({
        lists: lights
      });
    }



  }
})

