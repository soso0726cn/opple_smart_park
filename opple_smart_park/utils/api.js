const HOST = {
  'host'  : 'https://www.shcyytech.cn:444'
}


const API = {
  // 项目管理，项目列表
  'mc_project_list' : '/mc/project/list',
  // 区域列表
  'mc_area_list': '/mc/area/list',
  // 产品列表
  'mc_product_list': '/mc/product/list',

  // 灯光单设备信息
  'ls_device_info': '/ls/device/info',
  // 广播设备信息
  'bc_device_infor' : '/bc/device/infor',

  // 区域开关灯
  'ls_device_area_switch': '/ls/device/area/switch',
  // 区域调光
  'ls_device_area_control' : '/ls/device/area/control',

  // 单个设备开关灯
  'ls_device_switch': '/ls/device/switch',
  // 单个设备调光
  'ls_device_control' : '/ls/device/control',

  // 获取媒体列表
  'bc_media_type_list' : '/bc/media/type/list',
  // 区域媒体列表播放
  'bc_manager_area_playList' : '/bc/manager/area/playList',
  // 区域停止播放音频
  'bc_manager_area_stopPlay': '/bc/manager/area/stopPlay',
  // 区域音量调节
  'bc_manager_area_volumeSet': '/bc/manager/area/volumeSet',

  // 单个媒体播放
  'bc_manager_device_playList': '/bc/manager/device/playList',
  // 单个停止播放
  'bc_manager_device_stopPlay': '/bc/manager/device/stopPlay',
  // 单个音量调节
  'bc_manager_device_volumeSet': '/bc/manager/device/volumeSet',
  // 单个视频监控
  'vcr_ipc_infor': '/vcr/ipc/infor',

  // 设备列表
  // 照明列表
  'ls_device_list': '/ls/device/list',
  // 广播列表
  'bc_device_list': '/bc/device/list',
  // 监控列表
  'vcr_ipc_list': '/vcr/ipc/list',

  // 登录相关
  'auth_user_mobile_wx_session_fetch': '/auth/user/mobile/wx/session/fetch',
  'auth_user_mobile_wx_phone_check': '/auth/user/mobile/wx/phone/check'
}

const http = ({ url = '', param = {}, ...other } = {}) => {
  console.log('----------网络开始----------')
  console.log(url)
  console.log(param)
  wx.showLoading({
      title: '请求中，请耐心等待..'
  });
  // let timeStart = Date.now();
  return new Promise((resolve, reject) => {
      wx.request({
          url: url,
          data: param,
          header: {
              'content-type': 'application/json' // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
          },
          timeout: 50000,
          ...other,
          complete: (res) => {
              wx.hideLoading();
              // console.log(`耗时${Date.now() - timeStart}`);
              console.log(res)
              console.log('----------网络结束----------')
              if (res.statusCode >= 200 && res.statusCode < 300 && res.data.rstCode == 200) {
                  resolve(res.data)
              } else {
                if (res.errMsg === 'request:fail timeout') {
                  wx.showToast({
                    title: '网络超时',
                    icon: 'none'
                  })
                } else {
                  reject(res)
                }
              }
          }
      })
  })
}


// get方法
const get = (url, param = {}) => {
  return http({
      url,
      param
  })
}

const post = (url, param = {}) => {
  return http({
      url,
      param,
      method: 'post'
  })
}

module.exports = {
  mc_project_list: HOST.host + API.mc_project_list,
  mc_area_list: HOST.host + API.mc_area_list,
  mc_product_list: HOST.host + API.mc_product_list,
  ls_device_info: HOST.host + API.ls_device_info,
  bc_device_infor: HOST.host + API.bc_device_infor,
  ls_device_area_switch: HOST.host + API.ls_device_area_switch,
  ls_device_area_control: HOST.host + API.ls_device_area_control,
  ls_device_switch: HOST.host + API.ls_device_switch,
  ls_device_control: HOST.host + API.ls_device_control,
  bc_media_type_list: HOST.host + API.bc_media_type_list,
  bc_manager_area_playList: HOST.host + API.bc_manager_area_playList,
  bc_manager_area_stopPlay: HOST.host + API.bc_manager_area_stopPlay,
  bc_manager_area_volumeSet: HOST.host + API.bc_manager_area_volumeSet,
  bc_manager_device_playList: HOST.host + API.bc_manager_device_playList,
  bc_manager_device_stopPlay: HOST.host + API.bc_manager_device_stopPlay,
  bc_manager_device_volumeSet: HOST.host + API.bc_manager_device_volumeSet,
  vcr_ipc_infor: HOST.host + API.vcr_ipc_infor,
  ls_device_list: HOST.host + API.ls_device_list,
  bc_device_list: HOST.host + API.bc_device_list,
  vcr_ipc_list: HOST.host + API.vcr_ipc_list,
  auth_user_mobile_wx_session_fetch: HOST.host + API.auth_user_mobile_wx_session_fetch,
  auth_user_mobile_wx_phone_check: HOST.host + API.auth_user_mobile_wx_phone_check,
  get,
  post,
}
