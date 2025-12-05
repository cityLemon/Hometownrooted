// health-card.js - 健康卡片组件
Component({
  // 组件的属性列表
  properties: {
    // 健康数据类型：bloodPressure, heartRate, bloodGlucose, temperature
    dataType: {
      type: String,
      value: 'bloodPressure'
    },
    // 健康数据
    data: {
      type: Object,
      value: {
        value: '',
        unit: '',
        status: 'normal' // normal, warning, danger
      }
    },
    // 卡片尺寸：small, medium, large
    size: {
      type: String,
      value: 'medium'
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      value: false
    },
    // 是否显示标签
    showLabel: {
      type: Boolean,
      value: true
    }
  },

  // 组件的初始数据
  data: {
    // 数据类型对应的标签
    typeLabels: {
      bloodPressure: '血压',
      heartRate: '心率',
      bloodGlucose: '血糖',
      temperature: '体温'
    }
  },

  // 组件的方法列表
  methods: {
    // 卡片点击事件
    onCardClick() {
      if (this.properties.clickable) {
        this.triggerEvent('click', {
          dataType: this.properties.dataType,
          data: this.properties.data
        })
      }
    },
    // 获取状态颜色
    getStatusColor(status) {
      switch (status) {
        case 'normal':
          return '#52c41a' // 绿色
        case 'warning':
          return '#faad14' // 黄色
        case 'danger':
          return '#f5222d' // 红色
        default:
          return '#1890ff' // 蓝色
      }
    },
    // 获取状态文本
    getStatusText(status) {
      switch (status) {
        case 'normal':
          return '正常'
        case 'warning':
          return '警告'
        case 'danger':
          return '危险'
        default:
          return '未知'
      }
    }
  },

  // 组件生命周期
  lifetimes: {
    attached() {
      // 组件挂载时执行
      console.log('Health card component attached')
    },
    detached() {
      // 组件卸载时执行
      console.log('Health card component detached')
    }
  }
})
