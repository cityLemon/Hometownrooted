// service-manage.js - 服务管理
Page({
  data: {
    // 服务预约列表
    serviceBookings: [
      {
        id: 1,
        serviceName: '水电缴费',
        userName: '王奶奶',
        userPhone: '13800138000',
        bookingTime: '2024-01-05 14:30:00',
        status: 'pending', // pending, processing, completed, cancelled
        amount: 120
      },
      {
        id: 2,
        serviceName: '快递代收',
        userName: '李爷爷',
        userPhone: '13800138001',
        bookingTime: '2024-01-04 10:00:00',
        status: 'processing',
        trackingNumber: 'SF1234567890'
      },
      {
        id: 3,
        serviceName: '农产品代销',
        userName: '张奶奶',
        userPhone: '13800138002',
        bookingTime: '2024-01-03 16:00:00',
        status: 'completed',
        amount: 500
      }
    ],
    // 过滤后的服务预约列表
    filteredServiceBookings: [],
    // 筛选状态
    filterStatus: 'all', // all, pending, processing, completed, cancelled
    // 服务类型
    serviceTypes: ['全部', '水电缴费', '快递代收', '农产品代销', '家政服务', '维修服务', '法律咨询'],
    // 当前选中的服务类型
    selectedServiceType: '全部'
  },

  onLoad() {
    console.log('Service management page loaded')
    // 从数据库获取服务预约列表
    this.loadServiceBookings()
  },

  // 过滤服务预约列表
  filterServiceBookings() {
    const { serviceBookings, filterStatus, selectedServiceType } = this.data
    const filtered = serviceBookings.filter(item => {
      const statusMatch = filterStatus === 'all' || filterStatus === item.status
      const typeMatch = selectedServiceType === '全部' || selectedServiceType === item.serviceName
      return statusMatch && typeMatch
    })
    this.setData({
      filteredServiceBookings: filtered
    })
  },

  onReady() {
    console.log('Service management page ready')
  },

  // 加载服务预约列表
  loadServiceBookings() {
    // 模拟从数据库获取数据
    // 实际项目中应该调用API获取数据
    const serviceBookings = this.data.serviceBookings
    this.setData({
      serviceBookings
    })
    // 加载后进行过滤
    this.filterServiceBookings()
  },

  // 筛选状态切换
  switchFilterStatus(e) {
    const status = e.currentTarget.dataset.status
    this.setData({
      filterStatus: status
    })
    // 切换后重新过滤
    this.filterServiceBookings()
  },

  // 服务类型切换
  switchServiceType(e) {
    const serviceType = e.currentTarget.dataset.type
    this.setData({
      selectedServiceType: serviceType
    })
    // 切换后重新过滤
    this.filterServiceBookings()
  },

  // 更新订单状态
  updateOrderStatus(e) {
    const { orderId, status } = e.currentTarget.dataset
    // 执行更新订单状态操作
    // 实际项目中应该调用API更新订单状态
    const updatedBookings = this.data.serviceBookings.map(booking => {
      if (booking.id === orderId) {
        return {
          ...booking,
          status: status
        }
      }
      return booking
    })
    this.setData({
      serviceBookings: updatedBookings
    })
    wx.showToast({
      title: '订单状态已更新',
      icon: 'success'
    })
  },

  // 查看订单详情
  viewOrderDetail(e) {
    const orderId = e.currentTarget.dataset.orderId
    wx.showToast({
      title: `查看订单详情：${orderId}`,
      icon: 'none'
    })
  },

  // 导出订单数据
  exportOrderData() {
    wx.showToast({
      title: '订单数据导出功能开发中',
      icon: 'none'
    })
  }
})