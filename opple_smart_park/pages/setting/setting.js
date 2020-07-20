// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

    // 获取数据
    const user = wx.getStorageSync('user');
    const project = user.projectInfos.length > 0 ? user.projectInfos[0] : {name: ''};
    console.log(user);
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
    let list = this.data.user.projectInfos || [];
    if (list.length == 0) return;
    this.setData({
      showChooseProject: true,
      chooseList: list,
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