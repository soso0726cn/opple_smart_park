// pages/component_module/select_module/multiple_select_component/multiple_select_component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lists: {
      type:Array,
      value:[],
      observer: function (newVal,oldVal) {
        if (!!newVal && newVal.length != 0) {
          this.toolsForChangeListToShowList(newVal);
        }
      }
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
    showLists: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击取消
    actionForClose: function () {
      this.innerForLists();
      this.innerForClose();
    },

    // 占位
    actionForHolder: function() {},
    // 隐藏界面
    innerForClose: function () {
      this.setData({
        status: false
      });
    },

    // 恢复未选中之前数据
    innerForLists: function () {
      // 未操作之前原始数据
      this.toolsForChangeListToShowList(this.data.lists);
    },

    // 点击选中
    // 全选
    actionForChoose: function (e) {
      let selectIndex = e.currentTarget.dataset.index;
      let selectItem = this.data.showLists[selectIndex];

      let showLists = this.data.showLists;

      if (selectItem.id == 'all') { // 如果选择全部
        showLists = showLists.map((item,index) => {
          item.status = !selectItem.status;
          return item;
        })
      } else {
        showLists = showLists.map((item,index) => {
          
          if (index == selectIndex) {
            item.status = true
          } else {
            item.status = false;
          }
          return item;
        })
      }
      this.setData({
        showLists: showLists,
      })

    },

    // actionForChoose: function (e) {
    //   let selectIndex = e.currentTarget.dataset.index;

    //   let lists = [];
    //   let showLists = this.data.lists;

    //   lists = showLists.map((item,index) => {
        
    //     if (index == selectIndex) {
    //       item.status = !item.status
    //     } else {
    //       item.status = false;
    //     }
    //     return item;
    //   })
      

    //   this.setData({
    //     lists: lists
    //   })

    // },

    // 点击确定
    actionForSure: function () {
      let status = this.data.showLists.some((item) => {
        return item.status;
      })

      let lists = this.data.showLists.filter(item => {
        return item.id != 'all'
      })

      if (!status) {
        wx.showToast({
          icon: 'none',
          title: '请选择内容',
        })
        return;
      } else {
        this.innerForClose();

        this.setData({
          lists: lists
        })

        this.triggerEvent('select',{selects: this.data.lists}) 
      }
      
    },

    /**
     * --------- 工具方法 ----------
     */

    //  全选
    toolsForChangeListToShowList: function (lists) {
      // let originalLists = lists.slice();
      let originalLists = JSON.parse(JSON.stringify(lists))
      

      let status = originalLists.some((item) => {
        return item.status == false
      });

      let all = originalLists.some(item => {
        return item.id == 'all'
      })

      const allItem = {
        status: !status,
        name: '全部',
        id: 'all'
      };

      if (!all) {
        originalLists.push(allItem);
      }
      
      this.setData({
        showLists: originalLists
      });
    }

    // 单选
    // toolsForChangeListToShowList: function (lists) {
    //   let originalLists = lists;
    //   originalLists = originalLists.map((item) => {
    //     item.status = false;
    //     return item;
    //   });

    //   this.setData({
    //     showLists: originalLists
    //   });
    // }
  }
})
