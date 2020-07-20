// pages/component_module/setting_module/setting_item_component/setting_item_component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value:{}
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
    // 选中
    actionForTap: function () {
      if(this.data.item.type == 'project') {
        this.triggerEvent('project',{})
      }
    }
  }
})
