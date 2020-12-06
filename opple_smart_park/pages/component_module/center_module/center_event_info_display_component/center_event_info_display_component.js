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
    },
    tapImage:function(){
      wx.previewImage({
        current: this.data.imageUrl, // 当前显示图片的http链接
        urls: [this.data.imageUrl] // 需要预览的图片http链接列表
      });
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
