// pages/component_module/select_component/select_component.js
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

    showType: {
      type: String,
      value: 1, // 1: 音乐 2: 选择园区
    }
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
    bindChange: function (e) {
      const index = e.detail.value[0];
      console.log(index);
      this.setData({
        selectItem: this.data.playList[index]
      })
    },

    // 取消
    actionForClose: function () {
      // this.triggerEvent('close',{})
      this.setData({
        playListStatus: false
      });
    },

    // 确定
    actionForSure: function () {
      this.actionForClose();
      const selectItem = this.data.selectItem || this.data.playList[0];
      if (this.data.showType == 1) {
        this.triggerEvent('choosemusic',{item: selectItem})
      } else if (this.data.showType == 2) {
        this.triggerEvent('choosearea',{item: selectItem})
      }
      
    }
  }
})
