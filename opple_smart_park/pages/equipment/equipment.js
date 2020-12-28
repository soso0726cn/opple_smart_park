// pages/equipment/equipment.js
const API = require('../../utils/api.js');
const { ls_device_list } = require('../../utils/api.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    statusHeight: 44,
    navigateHeight: 44,

    // 弹窗选择
    toast: {
      type: 1,  //  type 1:灯具型号 2:灯具区域 3:灯杆型号 4:灯杆区域
      selectStatus: false,
      selectLists: [],
    },



    config: {
      normal: '/assets/component_module/scan_module/unselect.png',
      select: '/assets/component_module/scan_module/selected.png',
      open: true
    },

    scanData: null, // 扫码获取数据
    lightProduct: {}, // 灯具数据
    roleProduct:{}, // 灯杆数据

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({ statusHeight: app.globalData.statusHeight,navigateHeight: app.globalData.navigateHeight});

    let data = JSON.parse(options.data)
    
    // 获取灯杆数据
    let lightProduct = {
      code: data.code || '',
      location: {
        longitude: data.location.longitude || '',
        latitude: data.location.latitude || '',
      }
    };

    // 灯杆数据
    let roleProduct = {
      ...lightProduct,
    };

    if (typeof(data) !== 'undefined') {
      this.setData({
        scanData: data,
        lightProduct: lightProduct,
        roleProduct: roleProduct,
      })

      this.networkForDefaultRole();
    }


  },

  /**
   * ---------- 点击灯具组件操作 ---------
   */
  // 点击灯具型号
  actionForToastLight: function (e) {
    const type = e.detail.type;
    const lists = e.detail.lists;
    this.setData({
      toast: {
        type: type,
        selectStatus: true,
        selectLists: lists,
      }
    })
  },

  // 点击灯具所属区域
  actionForToastArea: function (e) {
    const type = e.detail.type;
    const lists = e.detail.lists;
    this.setData({
      toast: {
        type: type,
        selectStatus: true,
        selectLists: lists,
      }
    })
  },

  // 数据灯具名称
  actionForLightName: function (e) {
    const name = e.detail.name;
    let lightProduct = this.data.lightProduct;
    lightProduct.name = name;
    this.setData({
      lightProduct: lightProduct
    })
  },

  // 灯杆编号
  actionForLightCode: function (e) {
    const code = e.detail.code;
    console.log('code1111111111:'+code);
    let lightProduct = this.data.lightProduct;
    lightProduct.code = code;
    this.setData({
      lightProduct: lightProduct
    })
  },

  // 备注
  actionForLightRemark: function (e) {
    const remark = e.detail.remark;
    let lightProduct = this.data.lightProduct;
    lightProduct.remark = remark;
    this.setData({
      lightProduct: lightProduct
    })
  },

  /**
   * ---------- 点击灯杆操作 ----------
   */
  // 选中灯杆型号
  actionForToastRole: function (e) {
    const type = e.detail.type;
    const lists = e.detail.lists;
    this.setData({
      toast: {
        type: type,
        selectStatus: true,
        selectLists: lists,
      }
    })
  },

  // 灯杆名称
  actionForRoleName: function (e) {
    const name = e.detail.name;
    let roleProduct = this.data.roleProduct;
    roleProduct.name = name;
    this.setData({
      roleProduct: roleProduct
    })
  },

  // 灯杆编号
  actionForRoleCode: function (e) {
    console.log("333333333333333333");
    var code = e.detail.code;
    var temp = code.split('/');
    if(temp.length > 1&& temp[0] == ''){
      code = temp[1] ;
    }
    let roleProduct = this.data.roleProduct;
    roleProduct.code = code;
    this.setData({
      roleProduct: roleProduct
    })
  },

  // 灯杆备注
  actionForRoleRemark: function (e){
    const remark = e.detail.remark;
    let roleProduct = this.data.roleProduct;
    roleProduct.remark = remark;
    this.setData({
      roleProduct: roleProduct
    })
  },
  /**
   * ---------- 点击弹出框 ----------
   */
  actionForSelect: function (e) {
    
    const item = e.detail.item;
    if (this.data.toast.type == 1) { // 灯具型号
      let lightProduct = this.data.lightProduct;
      lightProduct.model = item;
      this.setData({
        lightProduct: lightProduct
      })
    } else if (this.data.toast.type == 2) { // 灯具区域
      let lightProduct = this.data.lightProduct;
      lightProduct.area = item;
      this.setData({
        lightProduct: lightProduct
      })
    } else if (this.data.toast.type == 3) { // 灯杆型号
      let roleProduct = this.data.roleProduct;
      roleProduct.model = item;
      this.setData({
        roleProduct: roleProduct
      })
    } else if (this.data.toast.type == 4) { // 灯杆区域
      let roleProduct = this.data.roleProduct;
      roleProduct.area = item;
      this.setData({
        roleProduct: roleProduct
      })
    }
  },

  /**
   * ---------- 点击是否默认灯杆 ---------
   */
  actionForSwitch: function () {
    let config = this.data.config
    config.open = !this.data.config.open
    this.setData({
      config: config
    })


    if (!this.data.config.open) { // 如果是取消选中,需要将灯具的数据默认赋值给灯杆
      this.toolsForUpdataRoleData();
    }
  },

  // 同步灯杆数据
  toolsForUpdataRoleData: function () {

    let lightProduct = this.data.lightProduct;
      let roleProduct = this.data.roleProduct;
      const roleModel = roleProduct.model;
      roleProduct = {
        ...lightProduct
      }
      roleProduct.model = roleModel;
      // 重新赋值
      this.setData({
        roleProduct: roleProduct
      })
  },


  /**
   * ---------- 网络请求 ----------
   */
  // 获取默认灯杆配置
  networkForDefaultRole: function (){
    const params = {
      "manufactureId": 1,
      "token": "string"
    }

    let that = this;
    let roleProduct = this.data.roleProduct;
    API.postNoLoading(API.mc_product_model_list, params).then((res) => {
      // 获取默认灯杆配置
      let list = res.items || [];
      if (list.length) {
        const model = list[0];
        roleProduct.model = model;
      }
      that.setData({
        roleProduct: roleProduct,
      })
    });
  },

  /**
   * --------- 点击确认 ----------
   */
  // 确认
  actionForSure: function () {

    // 首先判断灯具设备
    let light = this.data.lightProduct;
    if (light.name.length == 0) {
      wx.showToast({
        icon:'none',
        title: '请输入灯具名称'
      })
      return;
    }

    if (light.code.length == 0) {
      wx.showToast({
        icon:'none',
        title: '请输入灯具编号'
      })
      return;
    }

    if (!light.model) {
      wx.showToast({
        icon:'none',
        title: '请选择灯具型号'
      })
      return;
    }

    if (!light.area) {
      wx.showToast({
        icon:'none',
        title: '请选择灯具所属区域'
      })
      return;
    }

    let role = this.data.roleProduct;
    let open = this.data.config.open;

    if (!open && role.name.length == 0) {
      wx.showToast({
        icon:'none',
        title: '请输入灯杆名称'
      })
      return;
    }

    if (!open && role.code.length == 0) {
      wx.showToast({
        icon:'none',
        title: '请输入灯杆编号'
      })
      return;
    }

    if (!open && !role.model) {
      wx.showToast({
        icon:'none',
        title: '请选择灯杆型号'
      })
      return;
    }

    if (!open && !role.area) {
      wx.showToast({
        icon:'none',
        title: '请选择灯杆所属区域'
      })
      return;
    }

    if (open) { // 如果是默认,则同步数据
      this.toolsForUpdataRoleData();
    }

    this.networkForAddLight();
  },

  // 添加灯具网络接口
  networkForAddLight : function (){
    let light = this.data.lightProduct;

    var temp = light.code.split('/');
    if(temp.length > 1&& temp[0] == ''){
      light.code = temp[1] ;
    }

    const params = {
      'name': light.name,
      'macAddress': light.code,
      'areaId': light.area.id,
      'areaName': light.area.name,
      'areaPath': light.area.path,
      'description': light.remark || '',
      'devicePlatId': light.model.id,
      'lat': light.location.latitude,
      'lng': light.location.longitude,
      'current': '0',
      'currentPer': '0-0',
      'expiryDate': '2030-01-01',
      'innerTemp': '0',
      'innerTempPer': '0-0',
      'loopGatewayId': '0',
      'manufacture': '未知',
      'outerTemp': '0',
      'outerTempPer': '0-0',
      'picUrl': 'string',
      'poleId': '0',
      'poleName': 'string',
      'token': 'string',
      'voltage': '0',
      'voltagePer': '0-0',
      'watt': '0'
    }

    console.log(params);

    let that = this;
    API.postNoLoading(API.ls_device_add, params).then((res) => {
      const lightId = res.id;
      that.networkForAddRole(lightId);
    }).catch(error => {
      wx.showToast({
        icon:'none',
        title: '添加灯具失败'
      })
    })
  },

  // 添加灯杆
  networkForAddRole: function (lightId) {

    let role = this.data.roleProduct;
    const params = {
      'name': role.name,
      'areaId': role.area.id,
      'lat': role.location.latitude,
      'lng': role.location.longitude,
      'productModelId': 1,
      'installer': '',
      'remarks': '未知',
      'serialNo': '1',
      'token': 'string'
    }

    API.postNoLoading(API.mc_product_add, params).then((res) => {
      const roleId = res.id;
      this.networkForBind(lightId, roleId)
    }).catch(error => {
      wx.showToast({
        icon:'none',
        title: '添加灯杆失败'
      })
    })
  },

  // 绑定
  networkForBind: function (lightId,roleId) {
    let light = this.data.lightProduct;

    var temp = light.code.split('/');
    if(temp.length > 1&& temp[0] == ''){
      light.code = temp[1] ;
    }

    const params = {
      'deviceIds': [
        {
          'deviceId': lightId,
          'macAddress': light.code,
          'name': light.name,
          'type': 'lighting'
        }
      ],
      'productId': roleId,
      'token': 'string'
    }


    API.postNoLoading(API.mc_product_device_add, params).then((res) => {
      wx.showToast({
        icon:'none',
        title: '添加灯具成功'
      })

      setTimeout(() => {
        wx.navigateBack({})
      }, 2000)
    }).catch(error => {
      wx.showToast({
        icon:'none',
        title: '添加灯具失败'
      })
    })
  },

})