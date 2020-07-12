// pages/component_module/product_control_component/product_control_component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  //  是否显示区域调光
    controlStatus: {
      type:Boolean,
      value: false,
    },

    // 选中灯杆
    controlItem: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    actionForclose: function (e) {
      this.setData({
        controlStatus: false
      })
    },
    actionForChooseControl: function (e) {
      const item = e.currentTarget.dataset.item;
      this.triggerEvent('choosecontrol',{item: item}); // 选中设备 
    },

    actionForClose: function () {
      // this.triggerEvent('close',{})
      this.actionForclose();
    }
  }
})
