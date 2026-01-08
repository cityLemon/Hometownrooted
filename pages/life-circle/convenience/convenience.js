const auth = require('../../../utils/auth.js')
const app = getApp()

Page({
  data: {
    pageLoaded: false,
    offline: false,
    isLoading: false,
    isRefreshing: false,
    hasMore: true,
    services: [],
    filteredServices: [],
    bookingRecords: [],
    selectedServiceType: 'all',
    showBookingModal: false,
    selectedService: null,
    searchKeyword: '',
    currentPage: 1,
    pageSize: 10
  },

  onLoad() {
    console.log('Convenience service page loaded')
    if (!auth.checkLogin()) {
      return
    }
    this.initPage()
  },

  initPage() {
    this.setData({
      isLoading: true
    })
    Promise.all([
      this.loadServices(),
      this.loadBookingRecords()
    ]).finally(() => {
      this.setData({
        pageLoaded: true,
        isLoading: false
      })
    })
    this.setupNetworkListener()
  },

  setupNetworkListener() {
    wx.onNetworkStatusChange((res) => {
      this.setData({
        offline: !res.isConnected
      })
    })
    wx.getNetworkType({
      success: (res) => {
        this.setData({
          offline: res.networkType === 'none'
        })
      }
    })
  },

  loadServices(isLoadMore = false) {
    return new Promise((resolve, reject) => {
      const { currentPage, pageSize, selectedServiceType, searchKeyword } = this.data
      
      const params = {
        page: isLoadMore ? currentPage : 1,
        pageSize: pageSize,
        type: selectedServiceType === 'all' ? '' : selectedServiceType,
        keyword: searchKeyword
      }

      wx.request({
        url: app.globalData.baseUrl + '/api/convenience/services',
        method: 'GET',
        data: params,
        header: {
          'Authorization': auth.getAuthHeader()
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            const newServices = res.data.data.services || []
            const total = res.data.data.total || 0
            
            this.setData({
              services: isLoadMore ? [...this.data.services, ...newServices] : newServices,
              filteredServices: isLoadMore ? [...this.data.filteredServices, ...newServices] : newServices,
              hasMore: (isLoadMore ? this.data.services.length : 0) + newServices.length < total,
              currentPage: isLoadMore ? currentPage + 1 : 1
            })
            resolve(newServices)
          } else {
            // API返回错误，使用mock数据
            const mockServices = this.getMockServices()
            this.setData({
              services: mockServices,
              filteredServices: mockServices,
              hasMore: false
            })
            wx.showToast({
              title: '使用演示数据',
              icon: 'none',
              duration: 1500
            })
            resolve(mockServices)
          }
        },
        fail: (err) => {
          wx.showToast({
            title: '使用演示数据',
            icon: 'none',
            duration: 1500
          })
          
          this.setData({
            services: this.getMockServices(),
            filteredServices: this.getMockServices(),
            hasMore: false
          })
          resolve(this.getMockServices())
        }
      })
    })
  },

  getMockServices() {
    return [
      {
        id: 1,
        name: '水电费缴纳',
        description: '便捷的水电费在线缴纳服务',
        icon: '/images/roles/elder.svg',
        type: 'payment'
      },
      {
        id: 2,
        name: '快递代收',
        description: '专业快递代收代发服务',
        icon: '/images/roles/volunteer.svg',
        type: 'express'
      },
      {
        id: 3,
        name: '农产品配送',
        description: '新鲜农产品直配到家',
        icon: '/images/roles/elder.svg',
        type: 'agriculture'
      },
      {
        id: 4,
        name: '家政服务',
        description: '专业的家政清洁服务',
        icon: '/images/roles/volunteer.svg',
        type: 'housekeeping'
      },
      {
        id: 5,
        name: '家电维修',
        description: '快速上门维修服务',
        icon: '/images/roles/admin.svg',
        type: 'maintenance'
      },
      {
        id: 6,
        name: '法律咨询',
        description: '专业的法律咨询服务',
        icon: '/images/roles/elder.svg',
        type: 'legal'
      }
    ]
  },

  loadBookingRecords() {
    return new Promise((resolve, reject) => {
      const { currentPage, pageSize } = this.data
      
      wx.request({
        url: app.globalData.baseUrl + '/api/convenience/bookings',
        method: 'GET',
        data: {
          page: currentPage,
          pageSize: pageSize
        },
        header: {
          'Authorization': auth.getAuthHeader()
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            const records = res.data.data.bookings || []
            this.setData({
              bookingRecords: records
            })
            resolve(records)
          } else {
            // API返回错误，使用mock数据
            const mockRecords = this.getMockBookingRecords()
            this.setData({
              bookingRecords: mockRecords
            })
            resolve(mockRecords)
          }
        },
        fail: (err) => {
          this.setData({
            bookingRecords: this.getMockBookingRecords()
          })
          resolve(this.getMockBookingRecords())
        }
      })
    })
  },

  getMockBookingRecords() {
    return [
      {
        id: 1,
        serviceName: '水电费缴纳',
        bookingTime: '2024-01-15 10:30',
        status: 'completed'
      },
      {
        id: 2,
        serviceName: '家政服务',
        bookingTime: '2024-01-16 14:00',
        status: 'pending'
      },
      {
        id: 3,
        serviceName: '快递代收',
        bookingTime: '2024-01-17 09:00',
        status: 'cancelled'
      }
    ]
  },

  filterServices() {
    const { services, selectedServiceType, searchKeyword } = this.data
    let filtered = services

    if (selectedServiceType !== 'all') {
      filtered = filtered.filter(service => service.type === selectedServiceType)
    }

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(keyword) || 
        service.description.toLowerCase().includes(keyword)
      )
    }

    this.setData({
      filteredServices: filtered
    })
  },

  refreshData(callback) {
    this.setData({
      isRefreshing: true
    })
    
    Promise.all([
      this.loadServices(),
      this.loadBookingRecords()
    ]).finally(() => {
      this.setData({
        isRefreshing: false
      })
      wx.stopPullDownRefresh()
      if (callback && typeof callback === 'function') {
        callback()
      }
    })
  },

  loadMoreRecords() {
    if (this.data.isLoading || !this.data.hasMore) {
      return
    }
    
    this.setData({
      isLoading: true
    })
    
    this.loadServices(true).finally(() => {
      this.setData({
        isLoading: false
      })
    })
  },

  switchServiceType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      selectedServiceType: type,
      currentPage: 1,
      hasMore: true
    }, () => {
      this.filterServices()
    })
  },

  onSearchInput: debounce(function(e) {
    const keyword = e.detail.value
    this.setData({
      searchKeyword: keyword
    }, () => {
      this.filterServices()
    })
  }, 300),

  onClearSearch() {
    this.setData({
      searchKeyword: ''
    }, () => {
      this.filterServices()
    })
  },

  openBookingModal(e) {
    const serviceId = e.currentTarget.dataset.id
    const service = this.data.services.find(s => s.id === serviceId)
    
    if (service) {
      this.setData({
        selectedService: service,
        showBookingModal: true
      })
    } else {
      wx.showToast({
        title: '服务信息不存在',
        icon: 'none',
        duration: 2000
      })
    }
  },

  closeBookingModal() {
    this.setData({
      showBookingModal: false,
      selectedService: null
    })
  },

  confirmBooking() {
    if (!this.data.selectedService) {
      wx.showToast({
        title: '请选择服务',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.showLoading({
      title: '预约中...'
    })

    wx.request({
      url: app.globalData.baseUrl + '/api/convenience/bookings',
      method: 'POST',
      data: {
        serviceId: this.data.selectedService.id,
        serviceName: this.data.selectedService.name
      },
      header: {
        'Authorization': auth.getAuthHeader(),
        'Content-Type': 'application/json'
      },
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200 && res.data.success) {
          wx.showToast({
            title: '预约成功',
            icon: 'success',
            duration: 2000
          })
          this.closeBookingModal()
          this.loadBookingRecords()
        } else {
          wx.showToast({
            title: res.data.message || '预约失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  viewServiceDetail(e) {
    const serviceId = e.currentTarget.dataset.serviceId
    const service = this.data.services.find(s => s.id === serviceId)
    
    if (service) {
      wx.navigateTo({
        url: `/pages/life-circle/service-detail/service-detail?id=${serviceId}`
      })
    } else {
      wx.showToast({
        title: '服务信息不存在',
        icon: 'none',
        duration: 2000
      })
    }
  },

  viewBookingRecord(e) {
    const recordId = e.currentTarget.dataset.recordId
    const record = this.data.bookingRecords.find(r => r.id === recordId)
    
    if (record) {
      wx.navigateTo({
        url: `/pages/life-circle/booking-detail/booking-detail?id=${recordId}`
      })
    } else {
      wx.showToast({
        title: '预约记录不存在',
        icon: 'none',
        duration: 2000
      })
    }
  },

  onPullDownRefresh() {
    this.refreshData()
  },

  onReachBottom() {
    this.loadMoreRecords()
  },

  onShareAppMessage() {
    return {
      title: '便民服务',
      path: '/pages/life-circle/convenience/convenience'
    }
  }
})

function debounce(func, wait) {
  let timeout
  return function(...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}