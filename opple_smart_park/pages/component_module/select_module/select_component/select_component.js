// pages/component_module/select_module/select_component/select_component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },

    status: {
      type: Boolean,
      value: false
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    selectItem: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 选中
    actionForChoose: function (e) {
      console.log(e)
    },
    // 变化
    bindChange: function (e) {
      const index = e.detail.value[0];
      this.setData({
        selectItem: this.data.list[index]
      })
    },

    // 取消
    actionForClose: function () {
      this.setData({
        status: false,
        selectItem: null
      });
      this.triggerEvent('selectClose');
    },

    // 确定
    actionForSure: function () {
      wx.showLoading({
        title: '请求中，请耐心等待..',
        mask:true
    });
      var that = this;
      setTimeout(function () {
        that.realActionForSure();
        wx.hideLoading();
       }, 1000)
    },

    realActionForSure:function(){
      console.log(this.data.list);
      const selectItem = this.data.selectItem || this.data.list[0];
      this.actionForClose();
      this.triggerEvent('select',{item: selectItem})
    },


  }
})
