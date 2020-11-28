// pages/component_module/scan_module/scan_component.js
const API = require('../../../utils/api.js');
const UTIL = require('../../../utils/util.js');
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    product: {
      type: Object,
      value: null,
      observer: function (item) {
        if (!!item) {
          if(item.code!=null){
            var temp = item.code.split('/');
            if(temp.length > 1&& temp[0] == ''){
              item.code = temp[1] ;
            }
          }
          item.mapLocation = item.location;
          // item.marks =[
          //   {

          //     "iconPath": "/assets/map_view/map_mark.png",
          //     "latitude": item.mapLocation.latitude,
          //     "longitude":item.mapLocation.longitude,
          //     "width":35,
          //     "height":50,
          //   }
          // ] 
          this.setData({item: item})
        }
      }
    },

    // 0: 灯具配置  1:灯杆配置
    deviceType: {
      type: Number,
      value: 0
    },

    deviceNumber: {
      type: String,
      value: ''
    },
    location: {
      type: Object,
      value: {
        longitude: '0.0',
        latitude: '0.0'
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

    // 显示数据
    item: {},
  },

  
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * --------- 点击界面 --------
     */
    // 点击灯具型号/灯杆名称
    actionForProductType: function () {
      if (this.data.deviceType == 0) { // 灯具型号
        console.log("请求灯具型号")
        this.networkForLightType();
      } else { // 灯杆编号
        console.log("请求灯杆型号")
        this.networkForRoleType();
      }
    },

    getLocation:function(){
      wx.getLocation({
        type:'wgs84'
      }).then(location =>{
        console.log("=====getLocation longitude=====" + location.longitude)
        console.log("=====getLocation latitude=====" + location.latitude)
        var newloc = UTIL.transformFromWGSToGCJ(location.latitude,location.longitude);
        console.log("=====getLocation GCJ longitude=====" + newloc.longitude.toFixed(5))
        console.log("=====getLocation GCJ latitude=====" + newloc.latitude.toFixed(5))
        this.setData(
          {
            ['item.location']:{
              longitude:newloc.longitude.toFixed(5),
              latitude:newloc.latitude.toFixed(5),
            },
            ['item.mapLocation']:{
              longitude:newloc.longitude.toFixed(5),
              latitude:newloc.latitude.toFixed(5),
            },
            // ['item.marks']:[
            //   {
            //     "iconPath": "/assets/map_view/map_mark.png",
            //     "latitude": newloc.latitude.toFixed(5),
            //     "longitude":newloc.longitude.toFixed(5),
            //     "width":35,
            //     "height":50,
            //   }
            // ] 
          }
        )
      })
    },

    // 地图
    actionForChange: function (e){
        if(e.type == 'end'){
        console.log(e);
        let that = this;
        this.mapCtx = wx.createMapContext("map",this)
        this.mapCtx.getCenterLocation({
          success:function(res){
          console.log('移动中心的lat:'+res.latitude);
          console.log('移动中心的lng:'+res.longitude);
          that.setData(
            {
              ['item.location']:{
                longitude:res.longitude.toFixed(5),
                latitude:res.latitude.toFixed(5),
              },
              // ['item.marks']:[
              //   {
              //     "iconPath": "/assets/map_view/map_mark.png",
              //     "latitude": res.latitude.toFixed(5),
              //     "longitude":res.longitude.toFixed(5),
              //     "width":35,
              //     "height":50,
              //   }
              // ] 
            }
          )


        },fail:function(error){
          console.log('error:'+error);
        },complete:function(msg){
          console.log('complete:'+msg);
        }})
      }
    },

    // 点击区域
    actionForArea: function () {
      if (this.data.deviceType == 0) { // 灯具型号
        console.log("请求灯具区域")
        this.networkForArea(2);
      } else { // 灯杆编号
        console.log("请求灯杆区域")
        this.networkForArea(4);
      }
      
    },

    // 点击输入灯具名称
    actionForNameInput: function (e) {
      const inputString = e.detail.value;
      if (this.data.deviceType == 0) { // 灯具
        this.triggerEvent('lightname',{name: inputString})
      } else { // 灯杆
        this.triggerEvent('rolename',{name: inputString})
      }
      
    },

    // 输入编号
    actionForCodeInput: function (e) {
      const inputString = e.detail.value;
      if (this.data.deviceType == 0) { // 灯具
        this.triggerEvent('lightcode',{code: inputString})
      } else { // 灯杆
        this.triggerEvent('rolecode',{code: inputString})
      }
    },

    //  输入备注
    actionForRemark: function (e) {
      const inputString = e.detail.value;
      if (this.data.deviceType == 0) { // 灯具
        this.triggerEvent('lightremark',{remark: inputString})
      } else { // 灯杆
        this.triggerEvent('roleremark',{remark: inputString})
      }
    },


    /**
     * ---------- 网络请求 ----------
     */
    // 请求灯具型号
    networkForLightType: function () {
      const project = wx.getStorageSync('project');
      const projectId = project.id;

      const params = {
        "offset": 0,
        "pageSize": 10,
        "token": "string"
      }

      let that = this;
      API.post(API.ls_device_platform_list, params).then((res) => {
        console.log(res)
        if (res.rows.length) {
          // 传递灯杆数据 type 1:灯具型号 2:灯具区域 3:灯杆型号 4:灯杆区域
          this.triggerEvent('toastlight',{lists: res.rows,type: 1})
        } else {
          wx.showToast({
            icon:'none',
            title: '无可用灯具型号'
          })
        }
      }).catch(error => {
        wx.showToast({
          icon:'none',
          title: '无可用灯具型号'
        })
      });
    },

    // 请求灯杆型号
    networkForRoleType: function () {
      const params = {
        "manufactureId": 1,
        "token": "string"
      }

      API.post(API.mc_product_model_list, params).then((res) => {
        if (res.items.length) {
          // 传递灯杆数据 type 1:灯具型号 2:灯具区域 3:灯杆型号 4:灯杆区域
          this.triggerEvent('toastrole',{lists: res.items,type: 3})
        } else {
          wx.showToast({
            icon:'none',
            title: '无可用灯杆型号'
          })
        }
      }).catch(error => {
        wx.showToast({
          icon:'none',
          title: '无可用灯杆型号'
        })
      });
    },

    // 所属区域网络请求
    networkForArea: function (type) {
      const project = wx.getStorageSync('project');
      const projectId = project.id;

      let that = this;
      API.post(API.mc_area_list,{projectId: projectId, token: 'string'}).then((res) => {
        if (res.items.length) {
          that.triggerEvent('toastarea',{lists: res.items,type: type})
        } else {
          wx.showToast({
            icon:'none',
            title: '无可选择区域'
          })
        }
      }).catch(error => {
        wx.showToast({
          icon:'none',
          title: '无可选择区域'
        })
      })
    },
  }

})
