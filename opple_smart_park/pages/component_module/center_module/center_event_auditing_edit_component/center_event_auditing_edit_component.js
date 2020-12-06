// pages/component_module/center_module/center_event_display_component/center_event_display_component.js
const API = require('../../../../utils/api.js');
const UTIL = require('../../../../utils/util.js');
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
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

    actionForInputTag:function(e){
      this.triggerEvent("center_detail", {'action':'tag','value':e.detail.value});
    },

    
    radioChange:function(e){
      console.log(e);
      if(e.detail.value=='同意'){
        this.triggerEvent("center_detail", {'action':'auditing','value':true});
      }
      if(e.detail.value=='拒绝'){
        this.triggerEvent("center_detail", {'action':'auditing','value':false});
      }
    }

  }

})
