// pages/component_module/live_modal/live_modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    

    product: {
      type: Object,
      value: null,
    },

    status: {
      type: Boolean,
      value: false
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
    actionForClose: function  () {
      this.setData({
        status: false,
      })
    }
  }
})
