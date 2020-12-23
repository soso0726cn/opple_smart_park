// pages/component_module/broadcast_module/area_broadcast_component/area_broadcast_component.js

const API = require('../../../../utils/api.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type:Boolean,
      value: false,
    },

    area: {
      type: Object,
      value: null,
    }
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
    // 点击隐藏
    actionForClose: function (e) {
      this.setData({
        status: false,
        selectStatus: false,
      });
    },

    // 选中
    actionForAreaPlayChoose: function (e) {
      const currentSelectIndex = e.currentTarget.dataset.index;
      const selectItem = this.data.lists[currentSelectIndex];
      let lights = this.data.lists.map((item,index) => {
        item['status'] = currentSelectIndex === index ;
        return item;
      });

      this.setData({
        lists: lights
      });

      // 开始网络请求
      const params = {
        areaIds: [
          this.data.area.id
        ],
        token: 'string',
        volume: selectItem.level,
      };

      API.post(API.bc_manager_area_volumeSet,params);

    },

    // 选中结果
    actionForSelect: function (e) {
      console.log(e)
      this.setData({
        selectItem: e.detail.item
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

    // 播放
    actionForPlayAreaMusic: function() {
      const item = this.data.selectItem;
      console.log(item)
      if (item == null || (item.id || "").length == 0) {
        wx.showToast({
          icon: 'none',
          title: '请选择音频',
        })
        return;
      } else {
        const params = {
          areaIds: [
            this.data.area.id,
          ],
          listId: item.id,
          mode: '5',
          "token": "string"
        };
        API.post(API.bc_manager_area_playList,params);
      }
      
      
    },

    // 停止播放
    actionForStopPlayMusic: function () {
      const params = {
        areaIds: [
          this.data.area.id
        ],
        token: "string"
      };
      API.post(API.bc_manager_area_stopPlay,params);
    },

    /**
     * ---------- 工具方法 ----------
     */
    toolsForCheckNull: function (dict) {
      return !!dict && Object.keys(dict).length != 0;
    }
  }
})
