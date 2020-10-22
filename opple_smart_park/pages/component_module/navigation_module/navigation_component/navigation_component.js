// pages/component_module/navigation_module/navigation_component/navigation_component.js

const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "",
    },
    
    backgroudColor: {
      type: String,
      value: '#2F7DF6',
    },
    
    titleColor: {
      type: String,
      value: 'white'
    },

    backType: {
      type: String,
      value: 'back' // back: 返回 none: 没有任何图片
    }
  },

  lifetimes: {
    attached: function () {
      var that = this;
      that.setNavSize();
    },
  },

 

  /**
   * 组件的初始数据
   */
  data: {
    statusHeight: 0,
    navigateHeight: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backAction() {
      wx.navigateBack();
    },

    setNavSize() {
      const that = this;
      that.setData({ statusHeight: app.globalData.statusHeight,navigateHeight: app.globalData.navigateHeight});
    }
  }
})
