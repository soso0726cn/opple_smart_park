// pages/device_list/device_list.js

const API = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lightIcon: {
      normal: '/assets/device_list/icon_light_off.png',
      select: '/assets/device_list/icon_light_on.png'
    },
    videoIcon: {
      normal: '/assets/device_list/icon_play_normal.png',
      select: '/assets/device_list/icon_play_select.png'
    },
    currentTab: 0,
    pageNumber: 0,
    pageSize: 10,
    loading: false,
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
      }
    ],
    recommends: [[], [], [], []],
    recommendsRight: [[], [], [], []],
    recommendsLeft: [[], [], [], []],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  requestData: function (currentIndex, isFirst) {
    let recommends = this.data.recommends
    let pageSize = this.data.pageSize

    if (currentIndex === 1) {

      let pageNumber = this.data.pageNumber

      if (isFirst) {
        pageNumber = 0
      }

      const params = {
        "offset": pageNumber,
        "pageSize": pageSize,
        "projectId": "1",
        "token": "string"
      };

      API.post(API.ls_device_list, params).then((res) => {

        let newList = recommends[currentIndex]
        newList = newList.concat(res.rows)
        recommends[currentIndex] = newList

        if (res.total === 10) {
          pageNumber = pageNumber+1
        }

        this.refreshListData(recommends[currentIndex], pageNumber, currentIndex)
        
      }).catch(error => {
        console.log(error)
      });
    } else if (currentIndex === 2) {
      
      const params = {
        "queryConditions": {
          "projectId": 1
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
        console.log(error)
      });
    } else {
      this.setData({
        currentTab: currentIndex
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
      pageNum = pageNumber
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
  }

})