// pages/component_module/ad_module/ad_component.js

const API = require('../../../utils/api.js');

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
          if (newVal.online === 0) {
            this.setData({
              onlineContext : '设备离线',
              openStatus: false,
              closeStatus: true
            })
          } else if (newVal.online === 1) {
            this.setData({
              onlineContext : '设备在线',
              openStatus: true,
              closeStatus: false,
            })
          } else {
            this.setData({
              onlineContext : '设备报警',
              openStatus: false,
              closeStatus: true
            })
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
    openStatus: false,
    closeStatus: false,
    onlineContext: '', // 设备状态

    adLists:[], // 广告节目列表
    selectItem:{}, // 选中节目
    selectStatus:false, // 是否显示广告列表
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * ---------- V2.0 操作 ----------
     */
    actionForClose: function () {
      this.setData({
        status: false,
        selectStatus: false,
      });
      this.triggerEvent("homePage", "close");
    },

    // 广告开
    actionForProductLightOpen: function () {

      let params = {
        "deviceId": this.data.product.id,
        "switchOn": 1,
        "token": "string"
      };

      let that = this;
      API.post(API.scn_device_ctrl_power,params).then((res) => {
        wx.showLoading({
          title: '加载中',
        })
        
        setTimeout(function () {
          wx.hideLoading()
          that.actionForRefresh();
        }, 6000)
        
        
        
      }).catch(error => {
        wx.showToast({
          icon:'none',
          title: '当前设备打开失败',
        })
      });


      
      
    },

    // 广告关
    actionForProductLightClose: function () {

      let params = {
        "deviceId": this.data.product.id,
        "switchOn": 0,
        "token": "string"
      };

      let that = this;
      
      API.post(API.scn_device_ctrl_power,params).then((res) => {
        wx.showLoading({
          title: '加载中',
        })
        
        setTimeout(function () {
          wx.hideLoading()
          that.actionForRefresh();
        }, 6000)

      }).catch(error => {
        wx.showToast({
          icon:'none',
          title: '当前设备关闭失败',
        })
      });

      
    },

    // 刷新
    actionForRefresh: function() {
      let that = this;
      const param = {
        "deviceId": that.data.product.id,
        "token": "string"
      };
      this.triggerEvent('refresh',{})
      API.post(API.scn_device_info,param).then((res) => {
        let item = res.data;
        that.setData({
          product: item,
        });
      });
    },
    // actionForRefreshForClose: function() {
    //   let that = this;
    //   const param = {
    //     "deviceId": that.data.product.id,
    //     "token": "string"
    //   };
    //   API.post(API.scn_device_info,param).then((res) => {
    //     let item = res.data;
    //     that.setData({
    //       product: item,
    //       openStatus: false,
    //       closeStatus: true
    //     });
    //   });
    // },


    // actionForRefreshForOpen: function () {
    //   const param = {
    //     "deviceId": that.data.product.id,
    //     "token": "string"
    //   };
    //   API.post(API.scn_device_info,param).then((res) => {
    //     let item = res.data;
    //     console.log('-------')
    //     console.log(item);
    //     that.setData({
    //       product: item,
    //       openStatus: true,
    //       closeStatus: false
    //     });
    //   });
    // }

    // 选中
    // actionForProductLightChoose: function (e) {

    //   if (!this.data.product.lastRec.online) {
    //     wx.showToast({
    //       icon:'none',
    //       title: '当前设备离线状态',
    //     })
    //     return;
    //   }

    //   const currentSelectIndex = e.currentTarget.dataset.index;
    //   let selectItem = this.data.lists[currentSelectIndex];
    //   let lights = this.data.lists.map((item,index) => {
    //     item['status'] = currentSelectIndex === index ;
    //     return item;
    //   });
  
    //   this.setData({
    //     lists: lights
    //   });


    //   const params = {
    //     "deviceId": this.data.product.id,
    //     "brightness": selectItem.level,
    //     "token": "string"
    //   };
    //   let that = this;
    //   let product = this.data.product;
    //   API.post(API.ls_device_control,params).then(res => {
    //     product.lastRec.level = selectItem.level;
    //     that.setData({
    //       product: product
    //     });
    //   }).catch(() => {
    //     wx.showToast({
    //       icon:'none',
    //       title: '当前设备调光失败',
    //     })
    //   });

    // },

    /**
     * --------- 点击获取节目列表 --------
     */
    actionForChooseMusicList: function (e) {

      const project = wx.getStorageSync('project');
      const projectId = project.id;
      const params = {
        "approval": 1, // 已审核
        "projectId": projectId,
        "token": "string"
      };
      let that = this;
      API.post(API.scn_program_list,params).then(res => {
        console.log(res);
        let list = res.rows;
        list.map(item => {
          item.name = item.title;
          return item;
        })
        that.setData({
          adLists: list,
          selectStatus: true,
        })
      }).catch(() => {
        wx.showToast({
          icon:'none',
          title: '网络开小差',
        })
      });
    },

    // 点击获取选中
    actionForSelect: function (e) {
      const item = e.detail.item;
      this.setData({
        selectItem: item,
      })
    },

    // 点击播放节目
    actionForPlayAreaMusic: function () {
      let selectItem = this.data.selectItem;
      let product = this.data.product;

      console.log(selectItem);
      console.log(product);
      if (!selectItem || Object.keys(selectItem).length == 0) { // 节目为空,请选择节目
        wx.showToast({
          icon:'none',
          title: '请选择节目',
        })
        return;
      }
      if (product.online != 1) {
        wx.showToast({
          icon:'none',
          title: '当前设备不在线',
        })
        return;
      }

      const params = {
        "deviceId": product.id, 
        "programId": selectItem.id,
        "token": "string"
      };
      let that = this;
      API.post(API.scn_device_ctrl_program_play,params).then(res => {
         wx.showLoading({
          title: '加载中',
        })
        
        setTimeout(function () {
          wx.hideLoading()
          that.actionForRefresh();
        }, 6000)
      }).catch(() => {
        wx.showToast({
          icon:'none',
          title: '网络开小差',
        })
      });
    }


  }
})


