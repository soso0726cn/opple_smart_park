// pages/center_detail/center_detail.js

const API = require('../../utils/api.js');

Page({

  

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    handlerList:{},
    levelList:[],
    displayHandlerList:[],
    currentHandler:{},
    currentLevel:{},
    showHandlerSelect:false,
    showLevelSelect:false,
    tag:'',
    auditing:false,
    user:{},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.data);
      var levelList=[
        {'id':0,'name':'一般'},
        {'id':1,'name':'优先'},
        {'id':2,'name':'紧急'},
      ];
      var item = JSON.parse(options.data)
      var handlerList = JSON.parse(options.handler_list);
      var displayHandlerList = [];
      for(var i=0;i<handlerList.length;i++){
        displayHandlerList[i] = {
          'name':handlerList[i].userName+":"+handlerList[i].realName
        };
      }
      var currentHandler;
      var currentLevel;
      if(item.orderStatus == 1){
        currentHandler = handlerList[0];
        currentLevel = levelList[0];
      }
      if(item.orderStatus == 2){
        currentHandler = handlerList[0];
        // var recordInfos = item.recordInfos;
        // var currentRecordInfo = recordInfos[0];
        // for(var i=0;i<recordInfos.length;i++){
        //   var recordInfo = recordInfos[i];
        //   if(recordInfo.orderStatus == 2){
        //     currentRecordInfo = recordInfo;
        //     if(currentRecordInfo.description ==null||currentRecordInfo.description==""){
        //       currentRecordInfo.description = "无";
        //     }
        //     break;
        //   }
        // }
        // for(var i=0;i<handlerList.length;i++){
        //   var handlerTemp = handlerList[i];
        //   console.log('handlerTemp.userName:'+handlerTemp.userName);
        //   if(handlerTemp.userName == currentRecordInfo.handleUserID){
        //     currentHandler = handlerTemp;
        //     break;
        //   }
        // }
      }
      if(item.orderStatus == 3){
        
      }
      var currentUser = wx.getStorageSync('user');
      console.log(currentUser);
      this.setData({
        item:item,
        handlerList:handlerList,
        displayHandlerList:displayHandlerList,
        currentHandler:currentHandler,
        currentLevel:currentLevel,
        levelList:levelList,
        user:currentUser,
      })
  },

  receiveValue:function(res){
    console.log(res);
    var flag = res.detail.action;
    if(flag == 'selectHandler'){
      if(this.data.item.orderStatus == 1||this.data.item.orderStatus== 2){
        this.setData({
          showHandlerSelect:true,
        })
      }
    }
    if(flag == 'selectLevel'){
      if(this.data.item.orderStatus == 1){
        this.setData({
          showLevelSelect:true,
        })
      }
    }
    if(flag == 'tag'){
      var tag = res.detail.value;
        console.log('tag:'+tag);
        this.setData({
          tag:tag,
        })
    }
    if(flag == 'auditing'){
      if(this.data.item.orderStatus == 3){
        var auditing = res.detail.value;
        console.log('auditing:'+auditing);
        this.setData({
          auditing:auditing,
        })
      }
    }
  },

  actionForSelectHandler:function(res){
    var temp = res.detail.item;
    if(this.data.item.orderStatus == 1||this.data.item.orderStatus == 2){
      var array = temp.name.split(":");
      var currentHandler = this.data.currentHandler;
      for(var i=0;i<this.data.handlerList.length;i++){
        if(array[0] == this.data.handlerList[i].userName&&
          array[1] == this.data.handlerList[i].realName){
            currentHandler = this.data.handlerList[i];
            break;
          }
      }
      console.log(currentHandler);
      this.setData({
        currentHandler:currentHandler
      })
    }
  },

  actionForSelectLevel:function(res){
    var temp = res.detail.item;
    if(this.data.item.orderStatus == 1){
      var currentLevel = this.data.currentLevel;
      for(var i=0;i<this.data.levelList.length;i++){
        if(temp.name == this.data.levelList[i].name){
            currentLevel = this.data.levelList[i];
            break;
          }
      }
      this.setData({
        currentLevel:currentLevel
      })
    }
  },

  actionForSelectHandlerClose:function(res){
    var flag = res.detail;
    if(flag == 'selectClose'){
      this.setData({
        
      })
    }
  },

  actionForSelectLevelClose:function(res){
    var flag = res.detail;
    if(flag == 'selectClose'){
      this.setData({
        showLevelSelect:false,
      })
    }
  },

  actionForSure:function(res){
    var checkState = -1;
    var content = this.data.tag;
    var handleUserId = '';
    var handleUserName = '';
    var orderId = this.data.item.id;
    var orderLevel = this.data.item.orderLevel;
    var orderStatus = this.data.item.orderStatus;
    var token = 'string';
    var userId = this.data.user.userName;
    if(this.data.item.orderStatus == 1){
      handleUserId = this.data.currentHandler.userName;
      handleUserName = this.data.currentHandler.realName;
      orderLevel = this.data.currentLevel.id;
      orderStatus = 1;
    }
    if(this.data.item.orderStatus == 2){
      handleUserId = this.data.currentHandler.userName;
      handleUserName = this.data.currentHandler.realName;
      orderStatus = 2;
    }
    if(this.data.item.orderStatus == 3){
      checkState = this.data.auditing?1:0;
      orderStatus = 3;
    }

    var param = {
      'checkState':checkState,
      'content':content,
      'handleUserId':handleUserId,
      'handleUserName':handleUserName,
      'orderId':orderId,
      'orderLevel':orderLevel,
      'orderStatus':orderStatus,
      'token':token,
      'userId':userId,
    };
    API.postNoLoading(API.event_order_submit,param).then((res)=>{
      wx.showToast({
        title: '保存成功',
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
    });
   
  },

  actionForIgnore:function(res){
    if(this.data.item.orderStatus == 1){
      var param = {
        'orderId':this.data.item.id,
        'token':'string',
      };
      wx.showModal({
        title: '提示',
        content: '确认是否要忽略?',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            API.postNoLoading(API.event_order_ignore,param).then((res)=>{
              wx.showToast({
                title: '忽略成功',
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })  
    }

  },







  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})