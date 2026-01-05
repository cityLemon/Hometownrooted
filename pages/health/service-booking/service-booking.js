const auth = require('../../../utils/auth.js')

Page({
  data: {
    pageLoaded: false,
    selectedCategory: 'all',
    serviceCategories: [
      { id: 'all', name: '全部服务', icon: '🏥' },
      { id: 'medical', name: '医疗服务', icon: '👨‍⚕️' },
      { id: 'nursing', name: '护理服务', icon: '🏥' },
      { id: 'rehabilitation', name: '康复服务', icon: '💪' },
      { id: 'housekeeping', name: '家政服务', icon: '🏠' },
      { id: 'meal', name: '餐饮服务', icon: '🍽️' }
    ],
    availableServices: [
      {
        id: 1,
        name: '上门体检',
        category: 'medical',
        price: 299,
        description: '专业医生上门进行基础体检服务',
        duration: 60,
        provider: '乡村医疗站',
        rating: '⭐⭐⭐⭐⭐',
        reviewCount: 128
      },
      {
        id: 2,
        name: '血压监测',
        category: 'medical',
        price: 50,
        description: '定期血压测量和健康指导',
        duration: 30,
        provider: '乡村医疗站',
        rating: '⭐⭐⭐⭐⭐',
        reviewCount: 89
      },
      {
        id: 3,
        name: '康复按摩',
        category: 'rehabilitation',
        price: 120,
        description: '专业康复按摩，缓解肌肉疼痛',
        duration: 45,
        provider: '康复中心',
        rating: '⭐⭐⭐⭐',
        reviewCount: 67
      },
      {
        id: 4,
        name: '居家护理',
        category: 'nursing',
        price: 200,
        description: '专业护士上门护理服务',
        duration: 90,
        provider: '护理中心',
        rating: '⭐⭐⭐⭐⭐',
        reviewCount: 156
      },
      {
        id: 5,
        name: '清洁打扫',
        category: 'housekeeping',
        price: 80,
        description: '居家清洁和整理服务',
        duration: 120,
        provider: '家政服务',
        rating: '⭐⭐⭐⭐',
        reviewCount: 234
      },
      {
        id: 6,
        name: '营养配餐',
        category: 'meal',
        price: 35,
        description: '根据健康状况定制的营养餐',
        duration: 0,
        provider: '营养餐厅',
        rating: '⭐⭐⭐⭐⭐',
        reviewCount: 189
      }
    ],
    myBookings: [
      {
        id: 1,
        serviceName: '上门体检',
        date: '2024-01-15',
        time: '09:00',
        provider: '乡村医疗站',
        status: 'confirmed',
        statusText: '已确认'
      },
      {
        id: 2,
        serviceName: '血压监测',
        date: '2024-01-20',
        time: '14:30',
        provider: '乡村医疗站',
        status: 'pending',
        statusText: '待确认'
      }
    ]
  },

  onLoad(options) {
    console.log('Service booking page loaded')
    if (!auth.checkLogin()) {
      return
    }
    this.loadServices()
  },

  onReady() {
    console.log('Service booking page ready')
  },

  onShow() {
    this.loadMyBookings()
  },

  loadServices() {
    wx.showLoading({
      title: '加载中...'
    })
    
    const app = getApp()
    const userId = app.globalData.userInfo?.id
    
    wx.request({
      url: `${app.globalData.baseUrl}/api/health/services`,
      method: 'GET',
      header: auth.getAuthHeader(),
      data: {
        category: this.data.selectedCategory
      },
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200 && res.data.success) {
          const services = res.data.data?.services || this.data.availableServices
          this.setData({
            availableServices: services,
            pageLoaded: true
          })
        } else {
          wx.showToast({
            title: '使用演示数据',
            icon: 'none',
            duration: 1500
          })
          this.setData({
            pageLoaded: true
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
        this.setData({
          pageLoaded: true
        })
      }
    })
  },

  loadMyBookings() {
    const app = getApp()
    const userId = app.globalData.userInfo?.id
    
    wx.request({
      url: `${app.globalData.baseUrl}/api/health/bookings/${userId}`,
      method: 'GET',
      header: auth.getAuthHeader(),
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          const bookings = res.data.data?.bookings || []
          this.setData({
            myBookings: bookings
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

  // 选择服务分类
  selectCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      selectedCategory: category
    })
    // 过滤服务列表
    this.filterServices(category)
  },

  // 过滤服务
  filterServices(category) {
    if (category === 'all') {
      return this.data.availableServices
    } else {
      return this.data.availableServices.filter(service => service.category === category)
    }
  },

  // 选择服务
  selectService(e) {
    const service = e.currentTarget.dataset.service
    wx.navigateTo({
      url: `/pages/health/service-detail/service-detail?serviceId=${service.id}`
    })
  },

  // 查看预约详情
  viewBookingDetail(e) {
    const booking = e.currentTarget.dataset.booking
    wx.navigateTo({
      url: `/pages/health/booking-detail/booking-detail?bookingId=${booking.id}`
    })
  },

  // 查看全部预约
  viewAllBookings() {
    wx.navigateTo({
      url: '/pages/health/booking-list/booking-list'
    })
  },

  // 取消预约
  cancelBooking(e) {
    const bookingId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个预约吗？',
      success: (res) => {
        if (res.confirm) {
          // 实际项目中应该调用API取消预约
          wx.showToast({
            title: '预约已取消',
            icon: 'success'
          })
          // 重新加载预约列表
          this.loadMyBookings()
        }
      }
    })
  }
})