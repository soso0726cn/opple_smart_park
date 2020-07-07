// pages/component_module/videoModal/videoModal.js
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
    showVideoModal () {
      this.setData({
        show: true
      })
    },

    closeVideoModal () {
      this.setData({
        show: false
      })
    }
  }
})
