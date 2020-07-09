// pages/component_module/product_boardcast_component/product_broadcast_component.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  是否显示区域广播
    productStatus: {
      type:Boolean,
      value: false,
    },

    product: {
      type: Object,
      value: {}
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
    volumes:[
      {volume: '0%', status: false,brightness:"0"},
      {volume: '25%', status: false,brightness:"25"},
      {volume: '50%', status: true,brightness:"50"},
      {volume: '75%', status: false,brightness:"75"},
      {volume: '100%', status: false,brightness:"100"},
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    

    // 关闭
    actionForProductBroadcastClose: function () {
      this.triggerEvent('productclose',{});
    },

    // 选中
    actionForProductVolumeChoose: function (e) {

      const currentSelectIndex = e.currentTarget.dataset.index;
      const selectItem = this.data.volumes[currentSelectIndex];
      let volumes = this.data.volumes.map((item, index) => {
        item['status'] = currentSelectIndex === index
        return item
      })
  
      this.setData({
        volumes: volumes
      });

      this.triggerEvent('playvoice',{item: selectItem});

    },
    actionForProductClose: function() {
      this.triggerEvent('productclose',{});
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
    }
  }
})
