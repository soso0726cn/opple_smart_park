// pages/component_module/live_modal/live_modal.js

const API = require('../../../utils/api.js');

const ARROW_UP_SRC = '/assets/component_module/up_arrow.png';
const ARROW_UP_PRESSED_SRC = '/assets/component_module/up_arrow_pressed.png';
const ARROW_DOWN_SRC = '/assets/component_module/down_arrow.png';
const ARROW_DOWN_PRESSED_SRC = '/assets/component_module/down_arrow_pressed.png';
const ARROW_LEFT_SRC = '/assets/component_module/left_arrow.png';
const ARROW_LEFT_PRESSED_SRC = '/assets/component_module/left_arrow_pressed.png';
const ARROW_RIGHT_SRC = '/assets/component_module/right_arrow.png';
const ARROW_RIGHT_PRESSED_SRC = '/assets/component_module/right_arrow_pressed.png';



Component({
  /**
   * 组件的属性列表
   */
  properties: {
    

    product: {
      type: Object,
      value: null,
    },

    status: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    upArrowSrc:ARROW_UP_SRC,
    downArrowSrc:ARROW_DOWN_SRC,
    leftArrowSrc:ARROW_LEFT_SRC,
    rightArrowSrc:ARROW_RIGHT_SRC,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    actionForClose: function  () {
      this.setData({
        status: false,
      })
      this.triggerEvent("sendEvent", "close");
    },

    handleArrowUpTap:function (e){
      console.log("up tap");
      const params = {
        "direction": 0,
        "ipcId": this.properties.product.id,
        "speed": 1,
        "token": "string"
      };
      API.postNoLoading(API.vcr_control,params).then((res) => {
    
      });
    },

    handleArrowUpTouchStart:function (e){
      this.setData({
        upArrowSrc:ARROW_UP_PRESSED_SRC
      })
    },

    handleArrowUpTouchEnd:function (e){
      this.setData({
        upArrowSrc:ARROW_UP_SRC
      })
    },

    handleArrowDownTap:function (e){
      console.log("down tap");
      const params = {
        "direction": 1,
        "ipcId": this.properties.product.id,
        "speed": 1,
        "token": "string"
      };
      API.postNoLoading(API.vcr_control,params).then((res) => {
    
      });
    },

    handleArrowDownTouchStart:function (e){
      this.setData({
        downArrowSrc:ARROW_DOWN_PRESSED_SRC
      })
    },

    handleArrowDownTouchEnd:function (e){
      this.setData({
        downArrowSrc:ARROW_DOWN_SRC
      })
    },

    handleArrowLeftTap:function (e){
      console.log("left tap");
      const params = {
        "direction": 2,
        "ipcId": this.properties.product.id,
        "speed": 1,
        "token": "string"
      };
      API.postNoLoading(API.vcr_control,params).then((res) => {
    
      });
    },

    handleArrowLeftTouchStart:function (e){
      this.setData({
        leftArrowSrc:ARROW_LEFT_PRESSED_SRC
      })
    },

    handleArrowLeftTouchEnd:function (e){
      this.setData({
        leftArrowSrc:ARROW_LEFT_SRC
      })
    },

    handleArrowRightTap:function (e){
      console.log("right tap");
      console.log("left tap");
      const params = {
        "direction": 3,
        "ipcId": this.properties.product.id,
        "speed": 1,
        "token": "string"
      };
      API.postNoLoading(API.vcr_control,params).then((res) => {
    
      });
    },

    handleArrowRightTouchStart:function (e){
      this.setData({
        rightArrowSrc:ARROW_RIGHT_PRESSED_SRC
      })
    },

    handleArrowRightTouchEnd:function (e){
      this.setData({
        rightArrowSrc:ARROW_RIGHT_SRC
      })
    },

  },


})
