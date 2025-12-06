Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    back: {
      type: Boolean,
      value: false
    },
    show: {
      type: Boolean,
      value: true,
      observer: '_showChange'
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    displayStyle: ''
  },
  lifetimes: {
    attached() {
      // 获取系统信息，设置安全区域顶部高度
      const systemInfo = wx.getWindowInfo();
      const safeAreaTop = systemInfo.statusBarHeight;
      
      this.setData({
        ios: true,
        innerPaddingRight: 'padding-right: 90px',
        leftWidth: 'width: 90px',
        safeAreaTop: safeAreaTop + 'px'
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _showChange(show) {
      this.setData({
        displayStyle: show ? '' : 'display: none;'
      })
    }
  },
})
