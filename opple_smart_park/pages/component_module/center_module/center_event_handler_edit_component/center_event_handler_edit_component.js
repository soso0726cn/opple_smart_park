// pages/component_module/center_module/center_event_display_component/center_event_display_component.js
const API = require('../../../../utils/api.js');
const UTIL = require('../../../../utils/util.js');
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      handler:{
        type:Object,
        value:null,
      },
      level:{
        type:Object,
        value:null,
      },
      orderStatus:{
        type:String,
        value:null,
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

    // currentHandler:{},
    // currentLevel:{},

  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectHandler:function(e){
      console.log('selectHandler');
      this.triggerEvent("center_detail", {'action':'selectHandler'});
    },
    selectLevel:function(e){
      console.log('selectLevel');
      this.triggerEvent("center_detail", {'action':'selectLevel'});
    },

    actionForInputTag:function(e){
      this.triggerEvent("center_detail", {'action':'tag','value':e.detail.value});
    }
  },

  // ready:function(){
  //   this.setData({
  //     currentHandler:this.data.handler,
  //     currentLevel:this.data.level,
  //   })
  // },



})
