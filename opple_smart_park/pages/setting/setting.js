// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: {
      icon: '/assets/setting/ic_setting_name.png',
      title: '姓名',
      desc: '关东煮',
      div: true,
    },
    phone: {
      icon: '/assets/setting/ic_setting_phone.png',
      title: '电话',
      desc: '15672819900',
      div: true,
    },
    role: {
      icon: '/assets/setting/ic_setting_face.png',
      title: '角色',
      desc: '系统管理员',
    },
    project: {
      icon: '/assets/setting/ic_setting_prj.png',
      title: '项目切换',
      desc: '欧普园区',
      more: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: '账号设置'
    })

  },

})