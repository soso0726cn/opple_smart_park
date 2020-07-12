// pages/component_module/area_play_component/area_play_component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  是否显示区域广播
    areaPlayStatus: {
      type:Boolean,
      value: false,
    },

    // 媒体播放列表
    areaPlayMusicList: {
      type: Array,
      value: []
    },

    // 选中媒体
    areaPlayMusicItem: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    lights:[
      {light: '0%', status: false,brightness:"0"},
      {light: '25%', status: false,brightness:"25"},
      {light: '50%', status: true,brightness:"50"},
      {light: '75%', status: false,brightness:"75"},
      {light: '100%', status: false,brightness:"100"},
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击隐藏
    actionForclose: function (e) {
      this.setData({
        areaPlayStatus: false
      });
    },
    // 选中
    actionForAreaPlayChoose: function (e) {
      const currentSelectIndex = e.currentTarget.dataset.index;
      const selectItem = this.data.lights[currentSelectIndex];
      let lights = this.data.lights.map((item,index) => {
        item['status'] = currentSelectIndex === index ;
        return item;
      });
  
      this.setData({
        lights: lights
      });

      this.triggerEvent('playvoice',{item: selectItem});

    },

    // 获取音频列表
    actionForChooseMusicList: function () {
      this.triggerEvent('musicllist',{})
    },

    // 播放音频列表
    actionForPlayAreaMusic: function() {
      if (!this.data.areaPlayMusicItem.id) return;
      this.triggerEvent('playmusic',{item:this.data.areaPlayMusicItem})
    },

    // 停止播放
    actionForStopPlayMusic: function () {
      this.triggerEvent('stopmusic',{})
    },

    // 关闭
    actionForClose: function () {
      // this.triggerEvent('close',{})
      this.setData({
        areaPlayStatus: false
      });
    }
  }
})
