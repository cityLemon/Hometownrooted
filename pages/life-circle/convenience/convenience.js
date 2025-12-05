// convenience.js - 便民服务
Page({
  data: {
    // 便民服务列表
    services: [
      {
        id: 1,
        name: '水电缴费',
        icon: '/images/services/water-electricity.svg',
        description: '水费、电费在线缴纳',
        type: 'payment'
      },
      {
        id: 2,
        name: '快递代收',
        icon: '/images/services/express.svg',
        description: '快递代收代寄服务',
        type: 'express'
      },
      {
        id: 3,
        name: '农产品代销',
        icon: '/images/services/agriculture.svg',
        description: '农产品在线销售',
        type: 'agriculture'
      },
      {
        id: 4,
        name: '家政服务',
        icon: '/images/services/housekeeping.svg',
        description: '保洁、保姆、月嫂服务',
        type: 'housekeeping'
      },
      {
        id: 5,
        name: '维修服务',
        icon: '/images/services/maintenance.svg',
        description: '家电、家具维修服务',
        type: 'maintenance'
      },
      {
        id: 6,
        name: '法律咨询',
        icon: '/images/services/legal.svg',
        description: '免费法律咨询服务',
        type: 'legal'
      }
    ],
    // 过滤后的服务列表
    filteredServices: [],
    // 服务预约记录
    bookingRecords: [
      {
        id: 1,
        serviceName: '水电缴费',
        serviceType: 'payment',
        bookingTime: '2024-01-05 14:30:00',
        status: 'completed',
        amount: 120
      },
      {
        id: 2,
        serviceName: '快递代收',
        serviceType: 'express',
        bookingTime: '2024-01-04 10:00:00',
        status: 'completed',
        trackingNumber: 'SF1234567890'
      }
    ],
    // 当前选中的服务类型
    selectedServiceType: 'all', // all, payment, express, agriculture, housekeeping, maintenance, legal
    // 预约弹窗显示状态
    showBookingModal: false,
    // 当前选中的服务
    selectedService: null
  },

  onLoad() {
    console.log('Convenience service page loaded')
    // 从数据库获取便民服务列表和预约记录
    this.loadServices()
  },

  onReady() {
    console.log('Convenience service page ready')
  },

  // 加载便民服务列表和预约记录
  loadServices() {
    // 模拟从数据库获取数据
    // 实际项目中应该调用API获取数据
    const services = this.data.services
    const bookingRecords = this.data.bookingRecords
    this.setData({
      services,
      bookingRecords
    })
    // 初始化过滤后的服务列表
    this.filterServices()
  },

  // 过滤服务列表
  filterServices() {
    const { services, selectedServiceType } = this.data
    let filteredServices = []
    
    if (selectedServiceType === 'all') {
      filteredServices = services
    } else {
      filteredServices = services.filter(item => item.type === selectedServiceType)
    }
    
    this.setData({
      filteredServices
    })
  },

  // 切换服务类型
  switchServiceType(e) {
    const serviceType = e.currentTarget.dataset.type
    this.setData({
      selectedServiceType: serviceType
    }, () => {
      // 切换服务类型后重新过滤服务列表
      this.filterServices()
    })
  },

  // 打开预约弹窗
  openBookingModal(e) {
    const serviceId = e.currentTarget.dataset.id
    const selectedService = this.data.services.find(service => service.id === serviceId)
    this.setData({
      showBookingModal: true,
      selectedService
    })
  },

  // 关闭预约弹窗
  closeBookingModal() {
    this.setData({
      showBookingModal: false,
      selectedService: null
    })
  },

  // 确认预约
  confirmBooking() {
    const { selectedService } = this.data
    
    // 执行预约操作
    // 实际项目中应该调用API执行预约
    const newBooking = {
      id: Date.now(),
      serviceName: selectedService.name,
      serviceType: selectedService.type,
      bookingTime: new Date().toLocaleString('zh-CN'),
      status: 'pending'
    }
    
    this.setData({
      bookingRecords: [newBooking, ...this.data.bookingRecords],
      showBookingModal: false,
      selectedService: null
    })
    
    wx.showToast({
      title: '预约成功',
      icon: 'success'
    })
  },

  // 查看服务详情
  viewServiceDetail(e) {
    const serviceId = e.currentTarget.dataset.id
    wx.showToast({
      title: `查看服务详情：${serviceId}`,
      icon: 'none'
    })
  },

  // 查看预约记录
  viewBookingRecord(e) {
    const recordId = e.currentTarget.dataset.id
    wx.showToast({
      title: `查看预约记录：${recordId}`,
      icon: 'none'
    })
  }
})
