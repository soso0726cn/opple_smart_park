// pages/component_module/play_list_component/play_list_component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playList: {
      type: Array,
      value: []
    },

    playListStatus: {
      type: Boolean,
      value: false
    },
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
/**
   * 选中项目
   */
  actionForChooseItem: function (e) {
    let item = e.currentTarget.dataset.item;
    console.log(item);
    this.triggerEvent('choosemusic',{item: item})
  }
  }
})
