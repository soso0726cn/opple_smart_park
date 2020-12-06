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
    imageUrl:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imageRequestError:function(e){
      this.setData(
        {
          imageUrl:null
        }
      )
    }
  },

  ready:function(){
    var picUrl = this.data.param.picUrl;
    var imageUrl = null;
    if(picUrl != null){
      var pics = JSON.parse(picUrl);
      imageUrl = pics[0];
      console.log(pics);
      console.log("imageUrl:"+imageUrl);
    }
    this.setData({
      item:this.data.param,
      imageUrl:imageUrl,
    })
  },



})
