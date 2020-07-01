// pages/component_module/area_light_component/area_light_component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  是否显示区域调光
    areaStatus: {
      type:Boolean,
      value: false,
    },

    // 是否显示选中开灯
    openStatus:{
      type: Boolean,
      value: false,
    },

    // 是否显示关灯
    closeStatus: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lights:[
      {light: '0%', status: false,brightness:"0"},
      {light: '25%', status: false,brightness:"25"},
      {light: '50%', status: true,brightness:"50"},
      {light: '75%', status: false,brightness:"75"},
      {light: '100%', status: false,brightness:"100"},
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 开灯
    actionForAreaLightOpen: function () {
      this.triggerEvent('lightstatus',{'status':true});
    },

    // 关灯
    actionForAreaLightClose: function () {
      this.triggerEvent('lightstatus',{'status':false});
    },

    // 选中
    actionForAreaLightChoose: function (e) {
      const currentSelectIndex = e.currentTarget.dataset.index;
      let lights = this.data.lights.map((item,index) => {
        item['status'] = currentSelectIndex === index ;
        return item;
      });
  
      this.setData({
        lights: lights
      });

    },

    // 确定
    actionForAreaTurnLight: function () {
      // 默认必须有一个选中
      const selectItem = this.data.lights.filter((item) => {
        return item.status;
      });
      const item = selectItem.length > 0 ? selectItem[0] : {}
      this.triggerEvent('lightchange',{'item':item});
    }
  }
})
