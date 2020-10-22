//app.js

const DEFAULT_ANDROID_HEIGHT = '48';
const DEFAULT_APPLE_HEIGHT = '44';

App({
  onLaunch: function () {
    let that = this;
    wx.getSystemInfo({
      success (res) {
        let titleHeight = DEFAULT_ANDROID_HEIGHT;
        let statusBarHeight = res.statusBarHeight;
        if (that.isApplePhone(res.model)) {
          titleHeight = DEFAULT_APPLE_HEIGHT;
        }
        that.globalData.statusHeight = Number.parseInt(statusBarHeight);
        that.globalData.navigateHeight = Number.parseInt(titleHeight);
      }
    })
  },

  isApplePhone: function(model) {
    return model.includes('iPhone');
  },
  globalData: {
    userInfo: null,
    statusHeight: 44, // 状态栏高度
    navigateHeight: 44, // 导航栏高度
  }
})