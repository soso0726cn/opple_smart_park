// pages/component_module/light_module/area_light_component/area_light_component.js

const API = require('../../../../utils/api.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    status: {
      type:Boolean,
      value: false,
    },

    area: {
      type: Object,
      value: null,
    }
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

    openStatus: false, //开灯状态
    closeStatus: false, // 关灯状态
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 点击隐藏
    actionForClose: function (e) {
      this.setData({
        status: false
      });
    },

    // 开灯
    actionForAreaLightOpen: function () {
      
      let params = {
        "areaPath": this.data.area.id,
        "switchStatus": 1,
        "token": "string"
      };

      API.post(API.ls_device_area_switch,params).then((res) => {
        this.setData({
          openStatus: true,
          closeStatus: false
        });
      }).catch(error => {
        wx.showToast({
          icon:'none',
          title: '区域开灯失败',
        })
      });
    },

    // 关灯
    actionForAreaLightClose: function () {
      let params = {
        "areaPath": this.data.area.id,
        "switchStatus": 0,
        "token": "string"
      };

      API.post(API.ls_device_area_switch,params).then((res) => {
        this.setData({
          openStatus: false,
          closeStatus: true
        });
      }).catch(error => {
        wx.showToast({
          icon:'none',
          title: '区域关灯失败',
        })
      });
    },

    // 选中
    actionForAreaLightChoose: function (e) {
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
        "areaPath": this.data.area.id,
        "brightness": selectItem.level,
        "token": "string"
      };
  
      API.post(API.ls_device_area_control,params);

    },
  }
})
