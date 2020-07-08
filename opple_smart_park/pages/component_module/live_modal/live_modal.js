// pages/component_module/live_modal/live_modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    video: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showLiveModal () {
      this.setData({
        show: true
      })
    },

    closeLiveModal () {
      this.setData({
        show: false
      })
    },
  }
})
