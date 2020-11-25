// pages/main/main.js

const API = require('../../utils/api.js');
const UTIL = require('../../utils/util.js');
const app = getApp()
/**
 * 登录逻辑
 * 1、wx.checkSession
 *    1.1 成功 本地用户数据是否存在
 *        1.1.1 存在 已经登录 -> 跳转相应页面
 *        1.1.2 不存在 未登录 -> 跳2
 *    1.2 失败 未登录 -> 跳2
 * 2、wx.login获取code -> 跳3
 * 3、微信授权(getPhoneNumber)
 *    3.1 确认 -> 跳4
 *    3.2 拒绝
 * 4、请求服务端登录接口
 *    4.1 成功 -> 跳5
 *    4.2 失败
 * 5、保存用户信息
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false, // 当前账号是否已登录
    type: '',
    statusHeight: 44,
    navigateHeight: 44
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ statusHeight: app.globalData.statusHeight,navigateHeight: app.globalData.navigateHeight});
    this.checkSession()
  },

  checkSession: function () {

    let user = wx.getStorageSync('user');
    if (user) {
      this.setData({
        isLogin: true
      })
    }
  },

  getPhone: async function (e) {

    // 1、获取wx.login的code
    let code = ''
    await wx.login().then((res) => {
      if (res.errMsg === 'login:ok') {
        code = res.code
      }
    })

    console.log('---- code = ' + code)
    
    let encryptedData = e.detail.encryptedData
    let type = e.currentTarget.dataset.type
    let iv = e.detail.iv

    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      let param = {
        encryptedData: encryptedData,
        code: code,
        type: type,
        iv: iv
      }
  
      this.requestFetch(param)
    }
  },

  // 地图
  locationOnTap: function () {
    wx.navigateTo({
      url: '/pages/map_module/gis_map_v2/gis_map_v2'
    })
  },

  // 设备录入
  scanOnTap: function () {
    wx.scanCode().then(res => {
      if (res.errMsg == 'scanCode:ok') {
        wx.getLocation({
          type: 'wgs84'
        }).then(location => {
          console.log("=====getLocation longitude=====" + location.longitude)
          console.log("=====getLocation latitude=====" + location.latitude)
          var newloc = UTIL.transformFromWGSToGCJ(location.latitude,location.longitude);
          console.log("=====getLocation GCJ longitude=====" + newloc.longitude.toFixed(5))
          console.log("=====getLocation GCJ latitude=====" + newloc.latitude.toFixed(5))
          let data = {
            code: res.result,
            location: {
              longitude: newloc.longitude.toFixed(5),
              latitude: newloc.latitude.toFixed(5),
            }
          }
          wx.navigateTo({
            url: '/pages/equipment/equipment?data=' + JSON.stringify(data)
          })
        })
      }
    })
  },

  // 设备列表
  listOnTap: function () {
    wx.navigateTo({
      url: '/pages/device_list/device_list'
    })
  },

  // 事件中心
  centerOnTap: function () {
    wx.navigateTo({
      url: '/pages/center/center'
    })
  },

  // 我的账号
  accountOnTap: function () {
    const temp = wx.getStorageSync('user');
    const params = {
      "userName": temp.phone,
    }
    console.log("accountOnTap:user.phone:"+temp.phone)
    API.post(API.user_info_fetch, params).then((res) => {
      if (res.rstCode === 200) {
        // 1.保存用户信息到本地
        wx.setStorageSync('user', res.info);
        wx.navigateTo({
          url: '/pages/setting/setting'
        })
      }
    }).catch(error => {
      wx.showToast({
        icon: 'none',
        title: error.data.desc
      })
    });
  },

  requestFetch: function (param) {
    const params = {
      "js_code": param.code
    };

    let self = this

    API.post(API.auth_user_mobile_wx_session_fetch, params).then((res) => {

      if (res.rstCode === 200) {

        let para = {
          encryptedSession: res.encryptedSession,
          encryptedData: param.encryptedData,
          type: param.type,
          iv: param.iv
        }

        self.requestCheck(para)
      }
    }).catch(error => {
      console.log(error)
    });
  },

  requestCheck: function (param) {
    const params = {
      "encryptedData": param.encryptedData,
      "encryptedSession": param.encryptedSession,
      "iv": param.iv
    };

    let self = this
    API.post(API.auth_user_mobile_wx_phone_check, params).then((res) => {

      if (res.rstCode === 200) {

        wx.showToast({
          icon: 'none',
          title: '登录成功'
        })

        // 1.保存用户信息到本地
        wx.setStorageSync('user', res.info);
        // 默认选中数据
        const selectItem = res.info.projectInfos.length > 0 ? res.info.projectInfos[0] : {};
        wx.setStorageSync('project', selectItem);
        self.setData({
          isLogin: true
        })

        setTimeout(() => {
          // 2.跳转页面
          switch (param.type) {
            case 'location':
              wx.navigateTo({
                url: '/pages/map_module/gis_map_v2/gis_map_v2'
              })
              break;
            case 'scan':
              wx.scanCode({
                success (res) {
                  console.log(res)
                  if (res.errMsg == 'scanCode:ok') {
                    wx.getLocation({
                      type: 'wgs84'
                    }).then(location => {
                      console.log("=====getLocation longitude=====" + location.longitude)
                      console.log("=====getLocation latitude=====" + location.latitude)
                      var newloc = UTIL.transformFromWGSToGCJ(location.latitude,location.longitude);
                      console.log("=====getLocation GCJ longitude=====" + newloc.longitude.toFixed(5))
                      console.log("=====getLocation GCJ latitude=====" + newloc.latitude.toFixed(5))
                      let data = {
                        code: res.result,
                        location: {
                          longitude: newloc.longitude.toFixed(5),
                          latitude: newloc.latitude.toFixed(5),
                        }
                      }
                      wx.navigateTo({
                        url: '/pages/equipment/equipment?data=' + JSON.stringify(data)
                      })
                    })
                  }
                },
                fail(error) {
                  console.log(error);
                },
              });
              break;
            case 'list':
              wx.navigateTo({
                url: '/pages/device_list/device_list'
              })
              break;
            case 'center':
              wx.navigateTo({
                url: '/pages/center/center'
              })
              break;
            case 'account':
              wx.navigateTo({
                url: '/pages/setting/setting'
              })
              break;
            default:
                break;
          }
        }, 1000);
      }
    }).catch(error => {

      wx.showToast({
        icon: 'none',
        title: error.data.desc
      })
    });
  }

})