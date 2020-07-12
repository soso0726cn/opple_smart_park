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

    // 选中灯杆设备
    selectItem: {
      type: Object,
      value: {},
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
    
    // 点击隐藏
    actionForclose: function (e) {
      this.setData({
        productStatus: false
      });
    },

    // 关闭
    actionForProductBroadcastClose: function () {
      // this.triggerEvent('productclose',{});
      this.actionForclose();
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

      this.triggerEvent('playvoice',{item: selectItem,selectItem: this.data.selectItem});

    },
    actionForProductClose: function() {
      // this.triggerEvent('productclose',{});
      this.actionForclose();
    },
  
    // 获取音频列表
    actionForChooseMusicList: function () {
      this.triggerEvent('musicllist',{})
    },

    // 播放音频列表
    actionForPlayAreaMusic: function() {
      if (!this.data.areaPlayMusicItem.id) return;
      this.triggerEvent('playmusic',{item:this.data.areaPlayMusicItem,selectItem: this.data.selectItem})
    },

    // 停止播放
    actionForStopPlayMusic: function () {
      this.triggerEvent('stopmusic',{selectItem: this.data.selectItem})
    }
  }
})
