// pages/setting/setting.js

const app = getApp()
const API = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    statusHeight: 44,
    navigateHeight: 44,

    user: {}, // 读取缓存数据
    name: {
      icon: '/assets/setting/ic_setting_name.png',
      title: '姓名',
      desc: '',
      div: true,
      type: 'name'
    },
    phone: {
      icon: '/assets/setting/ic_setting_phone.png',
      title: '电话',
      desc: '',
      div: true,
      type: 'phone'
    },
    role: {
      icon: '/assets/setting/ic_setting_face.png',
      title: '角色',
      desc: '',
      type: 'role'
    },
    project: {
      icon: '/assets/setting/ic_setting_prj.png',
      title: '项目切换',
      desc: '',
      more: true,
      type: 'project'
    },
    userName: '',
    showChooseProject: false, // 显示项目切换
    chooseList:[], // 项目切换需要的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: '账号设置'
    })

    this.setData({ statusHeight: app.globalData.statusHeight,navigateHeight: app.globalData.navigateHeight});

    // 获取数据
    const user = wx.getStorageSync('user');
    
    const project = wx.getStorageSync('project');
    
    this.setData({
      user: user,
      userName: user.userName,
      name: {
        icon: '/assets/setting/ic_setting_name.png',
        title: '姓名',
        desc: user.realName || '',
        div: true,
        type: 'name'
      },
      phone: {
        icon: '/assets/setting/ic_setting_phone.png',
        title: '电话',
        desc: user.phone || '',
        div: true,
        type: 'phone'
      },
      role: {
        icon: '/assets/setting/ic_setting_face.png',
        title: '角色',
        desc: user.role || '',
        type: 'role'
      },
      project: {
        icon: '/assets/setting/ic_setting_prj.png',
        title: '项目切换',
        desc: project.name || '',
        more: true,
        type: 'project'
      }
    });

  },

  // 选中项目切换
  actionForChooseProject: function () {
    this.data.user = wx.getStorageSync('user');
    const params = {
      "userName": this.data.user.phone,
    }
    console.log("actionForChooseProject:user.phone:"+this.data.user.phone)
    API.postNoLoading(API.user_info_fetch, params).then((res) => {
      if (res.rstCode === 200) {
        // 1.保存用户信息到本地
        wx.setStorageSync('user', res.info);
        this.data.user = res.info;
        let list = this.data.user.projectInfos || [];
        if (list.length == 0) return;
        this.setData({
          showChooseProject: true,
          chooseList: list,
        });
      }
    }).catch(error => {
      wx.showToast({
        icon: 'none',
        title: error.data.desc
      })
    });
  },

  // 选中项目
  actionForSelectProject: function (e) {
    const item = e.detail.item;
    console.log(item);
    // 显示选中项目并存储数据
    this.setData({
      project: {
        icon: '/assets/setting/ic_setting_prj.png',
        title: '项目切换',
        desc: item.name || '',
        more: true,
        type: 'project'
      }
    });

    wx.setStorageSync('project', item);
  }

})