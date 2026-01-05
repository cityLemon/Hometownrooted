const auth = require('../../../utils/auth.js')

Page({
  data: {
    healthData: {
      realTime: {
        bloodPressure: {
          systolic: 120,
          diastolic: 80,
          unit: 'mmHg',
          status: 'normal'
        },
        heartRate: {
          value: 72,
          unit: 'bpm',
          status: 'normal'
        },
        bloodGlucose: {
          value: 5.6,
          unit: 'mmol/L',
          status: 'normal'
        },
        temperature: {
          value: 36.5,
          unit: '°C',
          status: 'normal'
        }
      },
      history: {
        bloodPressure: [
          { date: '2024-01-01', systolic: 120, diastolic: 80, status: 'normal' },
          { date: '2024-01-02', systolic: 125, diastolic: 85, status: 'normal' },
          { date: '2024-01-03', systolic: 130, diastolic: 90, status: 'warning' },
          { date: '2024-01-04', systolic: 122, diastolic: 82, status: 'normal' },
          { date: '2024-01-05', systolic: 118, diastolic: 78, status: 'normal' }
        ],
        heartRate: [
          { date: '2024-01-01', value: 72, status: 'normal' },
          { date: '2024-01-02', value: 75, status: 'normal' },
          { date: '2024-01-03', value: 80, status: 'normal' },
          { date: '2024-01-04', value: 78, status: 'normal' },
          { date: '2024-01-05', value: 70, status: 'normal' }
        ],
        bloodGlucose: [
          { date: '2024-01-01', value: 5.6, status: 'normal' },
          { date: '2024-01-02', value: 6.1, status: 'warning' },
          { date: '2024-01-03', value: 5.8, status: 'normal' },
          { date: '2024-01-04', value: 5.9, status: 'normal' },
          { date: '2024-01-05', value: 5.5, status: 'normal' }
        ]
      },
      deviceStatus: {
        connected: true,
        lastSyncTime: '2024-01-05 14:30:00',
        battery: 85
      }
    },
    selectedDataType: 'bloodPressure',
    timeRange: 'week'
  },

  onLoad() {
    console.log('Health monitoring page loaded')
    if (!auth.checkLogin()) {
      return
    }
    this.loadHealthData()
  },

  onReady() {
    console.log('Health monitoring page ready')
  },

  loadHealthData() {
    wx.showLoading({
      title: '加载中...'
    })
    
    const app = getApp()
    const userId = app.globalData.userInfo?.id
    
    wx.request({
      url: `${app.globalData.baseUrl}/api/health/monitoring/${userId}`,
      method: 'GET',
      header: auth.getAuthHeader(),
      data: {
        timeRange: this.data.timeRange
      },
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200 && res.data.success) {
          const healthData = res.data.data || this.data.healthData
          this.setData({
            healthData
          })
        } else {
          wx.showToast({
            title: '使用演示数据',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: (error) => {
        wx.hideLoading()
        if (!auth.handleAuthError(error)) {
          wx.showToast({
            title: '使用演示数据',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },

  // 切换数据类型
  switchDataType(e) {
    const dataType = e.currentTarget.dataset.type
    this.setData({
      selectedDataType: dataType
    })
  },

  // 切换时间范围
  switchTimeRange(e) {
    const timeRange = e.currentTarget.dataset.range
    this.setData({
      timeRange
    })
    // 根据时间范围重新加载数据
    this.loadHealthData()
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
  },

  // 刷新数据
  refreshData() {
    wx.showLoading({
      title: '刷新中...'
    })
    // 模拟刷新数据
    setTimeout(() => {
      this.loadHealthData()
      wx.hideLoading()
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      })
    }, 1000)
  },

  // 查看详细数据
  viewDetailData() {
    wx.navigateTo({
      url: '/pages/health/monitoring/detail/detail'
    })
  },

  // 导出数据
  exportData() {
    wx.showToast({
      title: '数据导出功能开发中',
      icon: 'none'
    })
  }
})
