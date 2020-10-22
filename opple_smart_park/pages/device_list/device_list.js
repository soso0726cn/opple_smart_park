// pages/device_list/device_list.js

const API = require('../../utils/api.js');
const PROJECT = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    statusHeight: 44,
    navigateHeight: 44,
    onTap:['', 'detailOnTap', 'broadcastOnTap', 'adOnTap', 'sensorOnTap'],
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
      select: '/assets/device_list/icon_play_select.png',
      idle: '/assets/device_list/icon_play_idle.png'
    },

    adStatus: false,
    adProduct: {},

    sensorStatus: false,
    sensorItem: {},

    signalLightStatus: false,
    signalLight: {},

    signalBroadcastStatus: false,
    signalBroadcast: {},

    liveProduct: {},
    liveStatus: false,

    changeAreaStatus: false,
    areaList: {},

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
    pageNumber: [0, 0, 0, 0, 0],
    listHeight: [280, 230, 230, 280, 260],
    pageSize: 20,
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
      {
        title: '广告屏幕'
      },
      {
        title: '环境检测'
      }
    ],
    recommends: [[], [], [], [], []],
    recommendsRight: [[], [], [], [], []],
    recommendsLeft: [[], [], [], [], []],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({ statusHeight: app.globalData.statusHeight,navigateHeight: app.globalData.navigateHeight});
    // let area = JSON.parse(options.area)

    // this.setData({
    //   area: area,
    //   areaId: area.selectArea.id
    // })

    // let currentIndex = this.data.currentTab
    // this.requestData(currentIndex, true)

    this.netWorkForAreaList()
  },

  netWorkForAreaList: function() {

    const project = wx.getStorageSync('project');
    const projectId = project.id;

    API.post(API.mc_area_list,{projectId: projectId, token: 'string'}).then((res) => {
      console.log(res);
      let area = {
        selectArea: res.items.length > 0 ? res.items[0] : null,
        areaList: res.items
      }
      this.setData({
        area: area,
        areaId: area.selectArea.id
      });

      let currentIndex = this.data.currentTab
      this.requestData(currentIndex, true)

    }).catch(error => {
      console.log(error)
    });
  },

  requestData: function (currentIndex, isFirst) {
    let recommends = this.data.recommends
    let pageSize = this.data.pageSize

    const project = wx.getStorageSync('project');
    const projectId = project.id;

    if (currentIndex === 0) {

      let pageNumber = this.data.pageNumber[currentIndex]

      if (isFirst) {
        pageNumber = 0
      }

      let offset = pageNumber /* pageSize*/

      const params = {
        "offset": offset,
        "pageSize": pageSize,
        "queryConditions": {
          "areaId": this.data.areaId,
          "projectId": projectId
        },
        "token": "string"
      }

      API.post(API.vcr_ipc_page, params).then((res) => {

        if (res.rstCode === 200) {

          let newList = recommends[currentIndex]
          newList = newList.concat(res.rows)

          recommends[currentIndex] = newList

          if (res.rows.length === pageSize) {
            pageNumber = pageNumber + 1
          }

          this.refreshListData(recommends[currentIndex], pageNumber, currentIndex)
        }
      }).catch(error => {
        this.setData({
          currentTab: currentIndex
        })
      });
    } else if (currentIndex === 1) {

      let pageNumber = this.data.pageNumber[currentIndex]

      if (isFirst) {
        pageNumber = 0
      }

      let offset = pageNumber * pageSize

      const params = {
        "offset": offset,
        "pageSize": pageSize,
        "projectId": projectId,
        // "areaId": this.data.areaId,
        "token": "string"
      };

      API.post(API.ls_device_list, params).then((res) => {

        let newList = recommends[currentIndex]
        newList = newList.concat(res.rows)

        newList.filter(item => {
          if (item.online === 0) {
            item.onlineContext = '设备离线'
          } else if (item.online === 1) {
            item.onlineContext = '设备在线'
          } else {
            item.onlineContext = '设备报警'
          }
        })
        recommends[currentIndex] = newList

        if (res.rows.length === pageSize) {
          pageNumber = pageNumber + 1
        }

        this.refreshListData(recommends[currentIndex], pageNumber, currentIndex)
        
      }).catch(error => {
        this.setData({
          currentTab: currentIndex
        })
      });
    } else if (currentIndex === 2) {

      let pageNumber = this.data.pageNumber[currentIndex]

      if (isFirst) {
        pageNumber = 0
      }

      let offset = pageNumber /* pageSize*/
      
      const params = {
        "offset": offset,
        "pageSize": pageSize,
        "queryConditions": {
          "areaId": this.data.areaId,
          "projectId": projectId,
        },
        "token": "string"
      };

      API.post(API.bc_device_page, params).then((res) => {

        res.rows.filter((item) => {
          let status = item.status

          item.showStatus = (item.status == 'idle' ? '空闲' : (item.status == 'offline' ? '离线' : (item.status == 'play' ? '正在播放' : (item.status == 'warning' ? '报警' : '空闲'))))

          switch (status) {
            case 'offline': 
              {
                item.playImage = this.data.videoIcon.normal,
                item.statusContext = '状态：离线'
              }
              break;
            case 'idle': 
              {
                item.playImage = this.data.videoIcon.idle,
                item.statusContext = '状态：空闲'
              }
              break;
            case 'play': 
              {
                item.playImage = this.data.videoIcon.select,
                item.statusContext = '正在播放'
              }
              break;
            case 'warning': 
              {
                item.playImage = this.data.videoIcon.select,
                item.statusContext = '状态：报警'
              }
              break;

            default:
              break;

          }
        })

        let newList = recommends[currentIndex]
        newList = newList.concat(res.rows)

        recommends[currentIndex] = newList

        if (res.rows.length === pageSize) {
          pageNumber = pageNumber + 1
        }

        this.refreshListData(recommends[currentIndex], pageNumber, currentIndex)
        
      }).catch(error => {
        this.setData({
          currentTab: currentIndex
        })
      });
    } else if (currentIndex == 3) {
      let pageNumber = this.data.pageNumber[currentIndex]

      if (isFirst) {
        pageNumber = 0
      }

      let offset = pageNumber * pageSize

      const params = {
        "offset": offset,
        "pageSize": pageSize,
        "projectId": projectId,
        "areaId": this.data.areaId,
        "areaPath": this.data.area.selectArea.path,
        "screenshot": 1,
        "token": "string"
      };

      API.post(API.scn_device_list, params).then((res) => {

        let newList = recommends[currentIndex]
        newList = newList.concat(res.rows)

        newList.filter(item => {
          if (item.online === 0) {
            item.onlineContext = '设备离线'
          } else if (item.online === 1) {
            item.onlineContext = '设备在线'
          } else {
            item.onlineContext = '设备报警'
          }
        })
        recommends[currentIndex] = newList

        if (res.rows.length === pageSize) {
          pageNumber = pageNumber + 1
        }

        this.refreshListData(recommends[currentIndex], pageNumber, currentIndex)
        
      }).catch(error => {
        this.setData({
          currentTab: currentIndex
        })
      });
    } else if (currentIndex == 4) {

      const params = {
        "queryConditions": {
          "manufactureId": 1,
          "modelId": 1,
          "projectId": projectId
        },
        "token": "string"
      };

      API.post(API.sensor_weather_device_list, params).then((res) => {

        let newList = res.items

        newList.filter(item => {
          if (item.online === 0) {
            item.onlineContext = '设备离线'
          } else if (item.online === 1) {
            item.onlineContext = '设备在线'
          } else {
            item.onlineContext = '设备报警'
          }
        })
        recommends[currentIndex] = newList

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

  refreshListData: function (recommends, pageNum, currentIndex) {
    var left = new Array()
    var right = new Array()

    let recommendsRight = this.data.recommendsRight
    let recommendsLeft = this.data.recommendsLeft
    let pageNumber = this.data.pageNumber
    pageNumber[currentIndex] = pageNum
  

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
      pageNumber: pageNumber,
      currentTab: currentIndex,
      loading: false
    })
  },

  /**
   * 下拉刷新列表数据
   */
  onRefresh: function () {
    let currentIndex = this.data.currentTab
    let recommends = this.data.recommends
    recommends[currentIndex] = []

    this.setData({
      recommends: recommends
    })

    this.requestData(currentIndex, true)
  },


  actionForRefreshAdView : function () {
    this.onRefresh();
  },
  /**
   *  上拉加载列表数据
   */
  onReachBottom: async function () {
    let currentIndex = this.data.currentTab
    let recommends = this.data.recommends
    let pageSize = this.data.pageSize

    if (parseInt(recommends[currentIndex].length / pageSize) >= 1 && 
    recommends[currentIndex].length % pageSize === 0) {
      this.requestData(currentIndex, false)
    }
  },

  /**
   * ---------- 区域选择 ----------
   */
  actionForChangeArea : function () {
    this.setData({
      changeAreaStatus: true
    })
  },

  // 选中区域
  actionForChooseArea: function (e) {
    let select = e.detail.item;
    this.netWorkForAreaList(select);
  },

  // 区域点击
  changeAreaOnTap: function () {
    let areaPlayList = this.data.area.areaList
    this.setData({
      changeAreaStatus: true,
      areaList: areaPlayList
    })
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
    } else {
      let recommends = this.data.recommendsRight
      if (recommends[0][index].rtmp === null || recommends[0][index].rtmp === '') {
        return
      }
    }

    this.setData({
      liveStatus: true,
      liveProduct: data
    })
  },

  // 照明详情
  detailOnTap: function (e) {
    // let index = e.currentTarget.dataset.index
    // let type = e.currentTarget.dataset.type
    let item = e.currentTarget.dataset.item

    this.setData({
      signalLight: item,
      signalLightStatus: true,
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
      signalBroadcastStatus: true,
      signalBroadcast: item,
      controlBroadcastItem: item,
      controlBroadcastSetting: {
        controlStatus: true, // 默认不显示
      },
    })
  },

  // 广告详情
  adOnTap: function (e) {

    let item = e.currentTarget.dataset.item

    this.setData({
      adStatus: true,
      adProduct: item,
    })
  },

  // 广告开关
  adSwitchOnTap: function(e) {
    // let index = e.currentTarget.dataset.index
    // let type = e.currentTarget.dataset.type
    let data = e.currentTarget.dataset.data

    let params = {
      "deviceId": data.id,
      "switchOn": data.online == 1 ? 0 : 1,
      "token": "string"
    };

    let that = this;
    API.post(API.scn_device_ctrl_power,params).then((res) => {
      that.setData({
        openStatus: true,
        closeStatus: false
      });

      wx.showLoading({
        title: '加载中',
      })
      // 重拉数据
      setTimeout(() => {
        wx.hideLoading()
        that.onRefresh()
      }, 6000);
      
    }).catch(error => {
      wx.showToast({
        icon:'none',
        title: '当前设备打开失败',
      })
    });
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

  // 环境检测详情
  sensorOnTap: function (e) {

    let item = e.currentTarget.dataset.item.values
    let name = e.currentTarget.dataset.item.name

    this.setData({
      sensorStatus: true,
      sensorItem: item,
      sensorName: name
    })
  }

})