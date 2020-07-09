// pages/component_module/product_light_component/product_light_component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  是否显示区域调光
    productStatus: {
      type:Boolean,
      value: false,
    },

    product: {
      type: Object,
      value: {}
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
    },

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

    // 关闭
    actionForProductClose: function() {
      this.triggerEvent('lightclose',{});
    },
    // 开灯
    actionForProductLightOpen: function () {
      this.triggerEvent('lightstatus',{'status':true});
    },

    // 关灯
    actionForProductLightClose: function () {
      this.triggerEvent('lightstatus',{'status':false});
    },

    // 选中
    actionForProductLightChoose: function (e) {
      const currentSelectIndex = e.currentTarget.dataset.index;
      let lights = this.data.lights.map((item,index) => {
        item['status'] = currentSelectIndex === index ;
        return item;
      });
  
      this.setData({
        lights: lights
      });

      this.actionForProductTurnLight();
    },

    // 确定
    actionForProductTurnLight: function () {
      // 默认必须有一个选中
      const selectItem = this.data.lights.filter((item) => {
        return item.status;
      });
      const item = selectItem.length > 0 ? selectItem[0] : {}
      this.triggerEvent('lightchange',{'item':item});
    }
  }
})
