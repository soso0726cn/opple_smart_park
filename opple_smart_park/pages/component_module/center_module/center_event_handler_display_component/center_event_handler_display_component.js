// pages/component_module/center_module/center_event_info_display_component/center_event_info_display_component.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      param:{
        type:Object,
        value:null,
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

  },

  ready:function(){
    var list = this.data.param.recordInfos;
    var currentRecordInfo = list[0];
    for(var i=0;i<list.length;i++){
      var recordInfo = list[i];
      if(recordInfo.orderStatus == 3){
        currentRecordInfo = recordInfo;
        if(currentRecordInfo.description ==null||currentRecordInfo.description==""){
          currentRecordInfo.description = "无";
        }
        break;
      }
    }
    this.setData({
      item:currentRecordInfo,
    })
  },



})
