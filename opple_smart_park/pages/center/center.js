// pages/center/center.js
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
    currentTab: 0,
    pageNumber: [0, 0, 0],
    pageSize: 20,
    loading: false,
    itemList: [
      [], [], []
    ],
    tabList: [
      {
        title: '未处理'
      },
      {
        title: '处理中'
      },
      {
        title: '待复核'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ statusHeight: app.globalData.statusHeight,navigateHeight: app.globalData.navigateHeight});
    this.requestData(0, true)
    
  },

  requestData: function (currentIndex, isFirst) {

    let status = 1
    if (currentIndex === 1) {
      status = 2
    } else if (currentIndex === 2) {
      status = 3
    }

    this.requestEventList(currentIndex, isFirst, status)
  },

  requestEventList: function (currentIndex, isFirst, status) {
    
    let pageNumber = this.data.pageNumber
    let itemList = this.data.itemList
    let pageSize = this.data.pageSize

    if (isFirst) {
      pageNumber[currentIndex] = 0
    }

    let offset = pageNumber[currentIndex] * pageSize
    
    const project = wx.getStorageSync('project');

    const params = {
      "offset": offset,
      "pageSize": pageSize,
      "prjId": project.id,
      "status": status,
      "token": "string"
    }

    API.post(API.event_order_list, params).then((res) => {

      if (res.rstCode === 200) {

        let newList = itemList[currentIndex]
        newList = newList.concat(res.rows)

        itemList[currentIndex] = newList

        if (res.rows.length === pageSize) {
          pageNumber[currentIndex] = pageNumber[currentIndex] + 1
        }

        this.setData({
          pageNumber: pageNumber,
          currentTab: currentIndex,
          itemList: itemList,
          loading: false
        })

      }
    }).catch(error => {
      this.setData({
        currentTab: currentIndex,
        loading: false
      })
    });
  },

  swichTab: function (e) {

    const currentTab = this.data.currentTab
    const newTab = e.currentTarget.dataset.current
    const itemList = this.data.itemList

    if (currentTab === newTab) {
      return false
    } else {

      if (itemList[newTab].length === 0) {
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
    const itemList = this.data.itemList

    if (currentTab === newTab) {
      return false
    } else {
      if (itemList[newTab].length === 0) {
        this.requestData(newTab, false)
      } else {
        this.setData({
          currentTab: newTab
        })
      }
    }
  },

  /**
   * 下拉刷新列表数据
   */
  onRefresh: function () {
    let currentIndex = this.data.currentTab
    let itemList = this.data.itemList
    itemList[currentIndex] = []

    this.setData({
      itemList: itemList
    })

    this.requestData(currentIndex, true)
  },

  /**
   *  上拉加载列表数据
   */
  onReachBottom: async function () {
    let currentIndex = this.data.currentTab
    let itemList = this.data.itemList
    let pageSize = this.data.pageSize

    if (parseInt(itemList[currentIndex].length / pageSize) >= 1 && 
    itemList[currentIndex].length % pageSize === 0) {
      this.requestData(currentIndex, false)
    }
  },

  actionForCenterDetail:function(e){
    const item = e.currentTarget.dataset.item;
    
    const project = wx.getStorageSync('project');
    const projectId = project.id;
    var handlerListParams = {
      'projectId':projectId,
      'token':"string",
    }
    var param = {
      'orderId':item.id,
      'orderStatus':item.orderStatus,
    }
    wx.showLoading({
      title: '请求中，请耐心等待..',
      mask:true
    });
    API.postNoLoading(API.handler_list,handlerListParams).then((res)=>{
      if (res.rstCode === 200) {
        var handlerJson = JSON.stringify(res.rows);
        API.postNoLoading(API.event_order_info,param).then((res)=>{
          if (res.rstCode === 200) {
            console.log(res);
            var data = JSON.stringify(res.data);
            wx.hideLoading();
            wx.navigateTo({
              url: '/pages/center_detail/center_detail?data='+data+'&handler_list='+ handlerJson
            })
          }else{
            wx.hideLoading();
          }
        });
      }else{
        wx.hideLoading();
      }
    });

   
  }

})