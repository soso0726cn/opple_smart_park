// pages/component_module/sensor_module/sensor_component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Boolean,
      value: false,
    },
    sensors: {
      type: Array,
      value: []
    },
    name: {
      type: String,
      value: ''
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
    actionForClose: function () {
      this.setData({
        status: false,
        selectStatus: false,
      });
    },
  }
})
