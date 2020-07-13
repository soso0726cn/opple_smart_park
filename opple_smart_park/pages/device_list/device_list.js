// pages/device_list/device_list.js

const API = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    onTap:['', 'detailOnTap', 'broadcastOnTap'],
    area: {},
    areaId: '',
    // 区域音频列表
    areaPlayList:[],
    areaPlayListStatus: false,
    // 选中显示类型
    showType: 1, // 默认为选中音乐播放列表 1:默认，2:区域列表
    // 选中音频
    selectAreaPlay:{},
    lightIcon: {
      normal: '/assets/device_list/icon_light_off.png',
      select: '/assets/device_list/icon_light_on.png'
    },
    videoIcon: {
      normal: '/assets/device_list/icon_play_normal.png',
      select: '/assets/device_list/icon_play_select.png'
    },

    // 当前选中产品设置
    productSetting:{
      productStatus: false, // 默认不显示
      openStatus: false,
      closeStatus: false
    },
    // 产品控制
    controlLightItem: {}, // 当前点击请求产品信息

    // 广播控制
    controlBroadcastItem: {},
    controlBroadcastSetting: {
      controlStatus: false, // 默认不显示
    },

    currentTab: 0,
    pageNumber: 0,
    pageSize: 8,
    loading: false,
    controlVideoItem: {},
    tabList: [
      {
        title: '视频监控'
      },
      {
        title: '照明设备'
      },
      {
        title: '广播设备'
      },
      // {
      //   title: '广告屏幕'
      // }
    ],
    recommends: [[], [], [], []],
    recommendsRight: [[], [], [], []],
    recommendsLeft: [[], [], [], []],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let area = JSON.parse(options.area)

    this.setData({
      area: area,
      areaId: area.selectArea.id
    })

    let currentIndex = this.data.currentTab
    this.requestData(currentIndex, true)
  },

  requestData: function (currentIndex, isFirst) {
    let recommends = this.data.recommends
    let pageSize = this.data.pageSize

    if (currentIndex === 0) {

      const params = {
        "queryConditions": {
          "projectId": 1,
          "areaId": this.data.areaId
        },
        "token": "string"
      };

      API.post(API.vcr_ipc_list, params).then((res) => {

        if (res.rstCode === 200) {

          recommends[currentIndex] = res.items

          this.refreshListData(recommends[currentIndex], 0, currentIndex)
        }
      }).catch(error => {
        this.setData({
          currentTab: currentIndex
        })
      });
    } else if (currentIndex === 1) {

      let pageNumber = this.data.pageNumber

      if (isFirst) {
        pageNumber = 0
      }

      let offset = pageNumber * pageSize

      const params = {
        "offset": offset,
        "pageSize": pageSize,
        "projectId": "1",
        // "areaId": this.data.areaId,
        "token": "string"
      };

      API.post(API.ls_device_list, params).then((res) => {

        let newList = recommends[currentIndex]
        newList = newList.concat(res.rows)
        recommends[currentIndex] = newList

        if (res.total === 10) {
          pageNumber = pageNumber + 1
        }

        this.refreshListData(recommends[currentIndex], pageNumber, currentIndex)
        
      }).catch(error => {
        this.setData({
          currentTab: currentIndex
        })
      });
    } else if (currentIndex === 2) {
      
      const params = {
        "queryConditions": {
          "projectId": 1,
          "areaId": this.data.areaId
        },
        "token": "string"
      };

      API.post(API.bc_device_list, params).then((res) => {

        res.items.filter((item) => {
          let status = item.status

          switch (status) {
            case 'offline': 
              {
                item.statusContext = '状态：离线'
              }
              break;
            case 'idle': 
              {
                item.statusContext = '状态：空闲'
              }
              break;
            case 'play': 
              {
                item.statusContext = '正在播放'
              }
              break;
            case 'warning': 
              {
                item.statusContext = '状态：报警'
              }
              break;

            default:
              break;

          }
        })
        
        recommends[currentIndex] = res.items

        this.refreshListData(recommends[currentIndex], 0, currentIndex)
        
      }).catch(error => {
        this.setData({
          currentTab: currentIndex
        })
      });
    } else {
      this.setData({
        currentTab: currentIndex
      })
    }
  },

  swichTab: function (e) {

    const currentTab = this.data.currentTab
    const newTab = e.currentTarget.dataset.current
    const recommends = this.data.recommends

    if (currentTab === newTab) {
      return false
    } else {

      if (recommends[newTab].length === 0) {
        this.requestData(newTab, false)
      } else {
        this.setData({
          currentTab: newTab
        })
      }
    }
  },

  /**
   * 滑动切换tab
   */
  bindTabChange: function (e) {

    const currentTab = this.data.currentTab
    const newTab = e.detail.current
    const recommends = this.data.recommends

    if (currentTab === newTab) {
      return false
    } else {
      if (recommends[newTab].length === 0) {
        this.requestData(newTab, false)
      } else {
        this.setData({
          currentTab: newTab
        })
      }
    }
  },

  refreshListData: function (recommends, pageNumber, currentIndex) {
    var left = new Array()
    var right = new Array()

    let recommendsRight = this.data.recommendsRight
    let recommendsLeft = this.data.recommendsLeft
    let pageNum = this.data.pageNumber
  
    if (currentIndex === 1) {
      pageNum = pageNumber + 1
    }

    for (let i = 0; i < recommends.length; ++i) {
      if (i % 2 === 0) {
        left.push(recommends[i])
      } else {
        right.push(recommends[i])
      }
    }

    recommendsRight[currentIndex] = right
    recommendsLeft[currentIndex] = left


    this.setData({
      recommendsRight: recommendsRight,
      recommendsLeft: recommendsLeft,
      pageNumber: pageNum,
      currentTab: currentIndex,
      loading: false
    })
  },

  /**
   * 下拉刷新列表数据
   */
  onRefresh: function () {
    let currentIndex = this.data.currentTab

    this.requestData(currentIndex, true)
  },

  /**
   *  上拉加载列表数据
   */
  onReachBottom: async function () {
    let currentIndex = this.data.currentTab
    let recommends = this.data.recommends
    let pageSize = this.data.pageSize

    if (currentIndex === 1 && parseInt(recommends[currentIndex].length / pageSize) >= 1 && 
    recommends[currentIndex].length % pageSize === 0) {
      this.requestData(currentIndex, false)
    }
  },

  // 区域点击
  changeAreaOnTap: function () {
    let areaPlayList = this.data.area.areaList
    this.setData({
      areaPlayList: areaPlayList,
      areaPlayListStatus: true,
      showType: '2'
    })
  },

  // 区域选择
  actionForChooseAera: function (e) {

    let currentIndex = this.data.currentTab
    let selectArea = e.detail.item
    let area = this.data.area
    area.selectArea = selectArea

    this.setData({
      area: area,
      areaId: selectArea.id
    })

    this.requestData(currentIndex, false)
  },

  // 视频监控
  liveOnTap: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let data = e.currentTarget.dataset.data

    if (type === 'left') {
      let recommends = this.data.recommendsLeft

      if (recommends[0][index].rtmp === null || recommends[0][index].rtmp === '') {
        return
      }

      this.setData({
        controlVideoItem: data
      })

      this.selectComponent("#live_modal").showLiveModal()

    } else {
      let recommends = this.data.recommendsRight

      if (recommends[0][index].rtmp === null || recommends[0][index].rtmp === '') {
        return
      }

      this.setData({
        controlVideoItem: data
      })

      this.selectComponent("#live_modal").showLiveModal()
    }
  },

  // 照明详情
  detailOnTap: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let item = e.currentTarget.dataset.item

    // if (type === 'left') {

    // } else {

    // }

    this.setData({
      controlLightItem: item,
      productSetting:{
        productStatus: true, // 默认不显示
        openStatus: false,
        closeStatus: false
      },
    })
  },

  broadcastOnTap: function (e) {
    console.log('---- ')
    let item = e.currentTarget.dataset.item

    item.status = (item.status == 'idle' ? '空闲' : (item.status == 'offline' ? '离线' : (item.status == 'play' ? '广播' : (item.status == 'warning' ? '报警' : '空闲'))))

    this.setData({
      controlBroadcastItem: item,
      controlBroadcastSetting: {
        controlStatus: true, // 默认不显示
      },
    })
  },

  // 照明开关灯
  lightOnTap: function (e) {

    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let data = e.currentTarget.dataset.data

    if (type === 'left') {
      // 请求开关灯接口
      let recommends = this.data.recommendsLeft

      if (recommends[1][index].online !== 0) {
        return
      }

      let params = {
        "deviceId": data.id,
        "switchStatus": data.switchOn ? 0 : 1,
        "token": "string"
      };
  
      API.post(API.ls_device_switch,params).then((res) => {
        if (res.rstCode === 200) {

          recommends[1][index].switchOn = !recommends[1][index].switchOn
          this.setData({
           recommendsLeft: recommends
          })
        }
      }).catch(error => {
        console.log(error)
      });
    } else {
      let recommends = this.data.recommendsRight

      if (recommends[1][index].online !== 0) {
        return
      }

      let params = {
        "deviceId": data.id,
        "switchStatus": data.switchOn ? 0 : 1,
        "token": "string"
      };
  
      API.post(API.ls_device_switch,params).then((res) => {
        if (res.rstCode === 200) {
          recommends[1][index].switchOn = !recommends[1][index].switchOn
          this.setData({
           recommendsRight: recommends
          })
        }
      }).catch(error => {
        console.log(error)
      });
    }
  },

  playOnTap: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let data = e.currentTarget.dataset.data

    if (type === 'left') {
      // 请求开关灯接口
      let recommends = this.data.recommendsLeft

      if (recommends[2][index].status === 'offline' || recommends[2][index].status === 'warning') {
        return
      }

      if (recommends[2][index].status === 'play') {
        this.pause(data.id, 'left', index)
      } else {
        this.play(data.id, 'left')
      }
    } else {
      let recommends = this.data.recommendsRight

      if (recommends[2][index].status === 'offline' || recommends[2][index].status === 'warning') {
        return
      }

      if (recommends[2][index].status === 'play') {
        this.pause(data.id, 'right', index)
      } else {
        this.play(data.id, 'right', index)
      }
    }
  },

  play: function (deviceId, type, index) {
    let recommendsRight = this.data.recommendsRight
    let recommendsLeft = this.data.recommendsLeft

    const params = {
      "deviceIds": [
        deviceId
      ],
      "token": "string"
    };
    API.post(API.bc_manager_device_playList,params).then((res) => {

      if (res.rstCode === 200) {
        if (type === 'left') {
          recommendsLeft[2][index].status = recommendsLeft[2][index].status == 'play' ? 'idle' : 'play'
        } else {
          recommendsRight[2][index].status = recommendsRight[2][index].status == 'play' ? 'idle' : 'play'
        }

        this.setData({
          recommendsRight: recommendsRight,
          recommendsLeft: recommendsLeft
        })
      }
    }).catch(error => {
      console.log(error)
    });
  },

  pause: function (deviceId, type, index) {
    let recommendsRight = this.data.recommendsRight
    let recommendsLeft = this.data.recommendsLeft

    const params = {
      deviceIds: [
        deviceId
      ],
      token: "string"
    };
    API.post(API.bc_manager_device_stopPlay,params).then((res) => {

      if (res.rstCode === 200) {
        if (type === 'left') {
          recommendsLeft[2][index].status = recommendsLeft[2][index].status == 'play' ? 'idle' : 'play'
        } else {
          recommendsRight[2][index].status = recommendsRight[2][index].status == 'play' ? 'idle' : 'play'
        }

        this.setData({
          recommendsRight: recommendsRight,
          recommendsLeft: recommendsLeft
        })
      }
    }).catch(error => {
      console.log(error)
    });
  },


  /**
   * ---------- 单个产品调光部分 ----------
   */
  // 单个照明部分 状态
  actionForProductLightStatus: function (e) {

    let params = {
      "deviceId": this.data.controlLightItem.id,
      "switchStatus": e.detail.status ? 1 : 0,
      "token": "string"
    };

    API.post(API.ls_device_switch,params).then((res) => {
      let item = this.data.controlLightItem;
      item.lastRec.online = e.detail.status ? true : false;
      console.log(item)
      this.setData({
        productSetting:{
          productStatus: this.data.productSetting.productStatus, // 默认不显示
          openStatus: e.detail.status,
          closeStatus: !e.detail.status
        },
        controlLightItem: item,
      });
    }).catch(error => {
      console.log(error)
    });
  },

  // 单个调光部分
  actionForProductLightChange: function (e) {
    console.log(e.detail.item);

    const params = {
      "deviceId": this.data.controlLightItem.id,
      "brightness": e.detail.item.brightness,
      "token": "string"
    };

    API.post(API.ls_device_control,params).then((res) => {
      console.log(res);
      let item = this.data.controlLightItem;
      item.lastRec.level = e.detail.item.brightness;
      this.setData({
        controlLightItem: item
      })
    }).catch(error => {
      console.log(error)
    });
  },

  // 关闭区域广播
  actionForClose: function () {
    this.setData({
      controlLightItem: {},
      productSetting:{
        productStatus: false, // 默认不显示
        openStatus: false,
        closeStatus: false
      },
    })
  },



  /**
   * ---------- 单个灯杆 控制广播 ---------- 
   */
  // 播放单个音频
  actionForProductPlayMusic: function (e) {
    const item = e.detail.item;
    const selectItem = e.detail.selectItem;
    console.log(item);
    const params = {
      "deviceIds": [
        selectItem.id
      ],
      listId: item.id,
      mode: '1',
      "token": "string"
    };
    API.post(API.bc_manager_device_playList,params).then((res) => {
      let controlBroadcastItem = this.data.controlBroadcastItem;
      controlBroadcastItem.status = '广播';
      this.setData({
        controlBroadcastItem: controlBroadcastItem,
      });
    }).catch(error => {
      console.log(error)
    });
  },

  // 停止播放单个
  actionForProductStopMusic: function (e) {
    const selectItem = e.detail.selectItem;
    const params = {
      deviceIds: [
        selectItem.id
      ],
      token: "string"
    };
    API.post(API.bc_manager_device_stopPlay,params).then((res) => {
      let controlBroadcastItem = this.data.controlBroadcastItem;
      controlBroadcastItem.status = '离线';
      this.setData({
        controlBroadcastItem: controlBroadcastItem,
      });
    }).catch(error => {
      console.log(error)
    });
  },

  // 单个调音量
  actionForProductPlayVoice: function (e) {
    const item = e.detail.item;
    const selectItem = e.detail.selectItem;
    console.log(item)
    const params = {
      deviceIds: [
        selectItem.id
      ],
      token: 'string',
      volume: item.brightness,
    };
    API.post(API.bc_manager_device_volumeSet,params).then((res) => {
      console.log(res);
      let controlBroadcastItem = this.data.controlBroadcastItem;
      controlBroadcastItem.volume = item.brightness;
      this.setData({
        controlBroadcastItem: controlBroadcastItem,
      });
    }).catch(error => {
      console.log(error)
    });
  },

  // 区域音频列表
  actionForAreaMusicList: function () {
    const params = {
      "projectId": 1,
      "token": "string"
    };

    API.post(API.bc_media_type_list,params).then((res) => {
      this.setData({
        areaPlayList: res.items,
        areaPlayListStatus: true,
      });
    }).catch(error => {
      console.log(error)
    });
  },

  // 选中音频
  actionForChooseMusic: function (e) {
    const item = e.detail.item;
    console.log(item);
    this.setData({
      selectAreaPlay: item,
      areaPlayListStatus: false, // 默认不显示
    })
  },

})