// pages/component_module/broadcast_module/signal_broadcast_component/signal_broadcast_component.js
const API = require('../../../../utils/api.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  是否显示区域调光
    status: {
      type:Boolean,
      value: false,
    },

    product: {
      type: Object,
      value: null,
      observer: function (newVal) {
        if ( Object.keys(newVal).length != 0) {
          let volume = newVal.volume;
          if (volume == 0) {
            this.toolsForBroadcast(0);
          }else if (volume > 0 && volume <= 25) {
            this.toolsForBroadcast(1);
          } else if (volume > 25 && volume <= 50) {
            this.toolsForBroadcast(2);
          } else if (volume > 50 && volume <= 75) {
            this.toolsForBroadcast(3);
          } else {
            this.toolsForBroadcast(4);
          }
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    lists:[
      {show: '0', status: true,level:"0"},
      {show: '25', status: false,level:"25"},
      {show: '50', status: false,level:"50"},
      {show: '75', status: false,level:"75"},
      {show: '100', status: false,level:"100"},
    ],
    selectLists:[],
    selectStatus: false,
    selectItem: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    actionForClose: function () {
      this.setData({
        status: false,
        selectStatus: false,
      });
      this.triggerEvent("homePage", "close");
    },


    // 选中
    actionForProductVolumeChoose: function (e) {

      if (this.data.product.showStatus == '离线') {
        wx.showToast({
          icon:'none',
          title: '当前设备离线',
        })
        return;
      }
      const currentSelectIndex = e.currentTarget.dataset.index;
      const selectItem = this.data.lists[currentSelectIndex];
      let volumes = this.data.lists.map((item, index) => {
        item['status'] = currentSelectIndex === index
        return item
      })
  
      this.setData({
        lists: volumes
      });

      const params = {
        deviceIds: [
          this.data.product.id
        ],
        token: 'string',
        volume: selectItem.level,
      };

      let that = this;
      let product = this.data.product;
      API.post(API.bc_manager_device_volumeSet,params).then(() => {
        product.volume = selectItem.level;
        that.setData({
          product: product,
        });
      }).catch(() => {
        wx.showToast({
          icon:'none',
          title: '音量调节失败',
        })
      });
      

    },
    
  
    // 获取音频列表
    actionForChooseMusicList: function () {
      
      const project = wx.getStorageSync('project');
      const projectId = project.id;

      const params = {
        "projectId": projectId,
        "token": "string"
      };
  
      API.post(API.bc_media_type_list,params).then((res) => {
        this.setData({
          selectLists:res.items,
          selectStatus: true
        });
      }).catch(() => {
        wx.showToast({
          icon: 'none',
          title: '播放列表获取失败'
        })
      });
    },

    // 选中结果
    actionForSelect: function (e) {
      console.log(e)
      this.setData({
        selectItem: e.detail.item
      });
    },

    // 播放音频列表
    actionForPlayAreaMusic: function() {
      const item = this.data.selectItem;
      console.log(item)
      if (this.data.product.showStatus == '离线') {
        wx.showToast({
          icon:'none',
          title: '当前设备离线',
        })
        return;
      }

      if (item == null || (item.id || "").length == 0) {
        wx.showToast({
          icon: 'none',
          title: '请选择音频',
        })
        return;
      } else {
        const params = {
          "deviceIds": [
            this.data.product.id
          ],
          listId: item.id,
          mode: '5',
          "token": "string"
        };
        let that = this;
        let product = this.data.product;
        API.post(API.bc_manager_device_playList,params).then((res) => {
          product.showStatus = '广播';
          product.status == 'play'
          that.setData({
            product: product,
          });
        }).catch(error => {
          wx.showToast({
            icon: 'none',
            title: '播放音频失败',
          })
        });
      }
      
    },

    // 停止播放
    actionForStopPlayMusic: function () {
      
      if (this.data.product.showStatus == '离线') {
        wx.showToast({
          icon:'none',
          title: '当前设备离线',
        })
        return;
      }

      const params = {
        deviceIds: [
          this.data.product.id
        ],
        token: "string"
      };

      let that = this;
      let product = this.data.product;
      API.post(API.bc_manager_device_stopPlay,params).then((res) => {
        product.showStatus = '空闲';
        product.status == 'idle'
        that.setData({
          product: product,
        });
      }).catch(error => {
        wx.showToast({
          icon: 'none',
          title: '停止播放音频失败',
        })
      });
    },

    // 不用实现
    actionForIdle: function () {

    },
    /**
     * ---------- 设置调光状态 ----------
     */
    toolsForBroadcast: function (selectIndex) {
      let lights = this.data.lists.map((item,index) => {
        item['status'] = selectIndex === index ;
        return item;
      });
      this.setData({
        lists: lights
      });
    }
  }
})
