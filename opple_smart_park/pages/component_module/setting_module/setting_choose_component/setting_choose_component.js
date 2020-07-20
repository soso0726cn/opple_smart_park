// pages/component_module/setting_module/setting_choose_component/setting_choose_component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type:Array,
      value:[]
    },

    show: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectItem:null, // 选中数据
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange: function (e) {
      const index = e.detail.value[0];
      const item = this.data.list[index];
      this.setData({
        selectItem: item
      });
    },

    // 取消
    actionForClose: function () {
      this.setData({
        show: false
      });
    },

    // 确定
    actionForSure: function () {
      this.actionForClose();
      const selectItem = this.data.selectItem || this.data.list[0];
      console.log('选中');
      console.log(selectItem)
      this.triggerEvent('select',{item: selectItem})
    }
  }
})
