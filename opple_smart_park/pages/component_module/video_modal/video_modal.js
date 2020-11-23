// pages/component_module/videoModal/videoModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    product: {
      type: Object,
      value: {}
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
    liveProduct: null,
    liveStatus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    actionForClose: function() {
      this.setData({
        status: false,
        liveStatus: false,
      })
      this.triggerEvent("homePage", "close");
    },

    liveOnTap (e) {
      console.log("this.data.product.picUrl:"+this.data.product.picUrl);
      if(this.data.product.status == 0){
        return;
      }
      wx.showLoading({
        title: '请求中，请耐心等待..',
        mask:true
      });
      var that = this;
      setTimeout(function () {
        that.setData({
          liveProduct: that.data.product,
          liveStatus: true
        })
        wx.hideLoading();
       }, 500)
      
      // if(this.data.product.picUrl != null&&this.data.product.picUrl!=""){
      //   this.setData({
      //     liveProduct: this.data.product,
      //     liveStatus: true
      //   })
      // }

    },

    receiveValue:function(res){
      if(res.detail == 'close'){
        this.setData({
          liveProduct: null,
          liveStatus: false,
          status:false,
        })
        this.triggerEvent("homePage", "close");
      }
    }
  }
})
