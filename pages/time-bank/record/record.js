const auth = require('../../../utils/auth.js')

Page({
  data: {
    pageLoaded: false,
    offline: false,
    isLoading: false,
    isRefreshing: false,
    hasMore: true,
    timeCoinBalance: 0,
    serviceRecords: [],
    filteredServiceRecords: [],
    exchangeRules: [],
    selectedRecordType: 'all',
    showExchangeModal: false,
    selectedExchangeItem: null,
    searchKeyword: '',
    currentPage: 1,
    pageSize: 10
  },

  onLoad() {
    console.log('Service record page loaded')
    if (!auth.checkLogin()) {
      return
    }
    this.initPage()
  },

  onShow() {
    if (this.data.pageLoaded) {
      this.refreshData()
    }
  },

  onPullDownRefresh() {
    this.refreshData(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.loadMoreRecords()
    }
  },

  initPage() {
    this.setData({
      isLoading: true
    })
    Promise.all([
      this.loadTimeCoinBalance(),
      this.loadServiceRecords(),
      this.loadExchangeRules()
    ]).finally(() => {
      this.setData({
        pageLoaded: true,
        isLoading: false
      })
    })
    this.setupNetworkListener()
  },

  loadTimeCoinBalance() {
    return new Promise((resolve, reject) => {
      const app = getApp()
      const userId = app.globalData.userInfo?.id
      
      if (!userId) {
        reject(new Error('用户信息不存在'))
        return
      }

      wx.request({
        url: `${app.globalData.baseUrl}/api/time-bank/balance/${userId}`,
        method: 'GET',
        header: auth.getAuthHeader(),
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            this.setData({
              timeCoinBalance: res.data.data.balance || 0
            })
            resolve()
          } else {
            console.error('加载时间币余额失败:', res.data)
            wx.showToast({
              title: res.data.message || '加载失败',
              icon: 'none'
            })
            reject(new Error(res.data.message || '加载失败'))
          }
        },
        fail: (error) => {
          console.error('加载时间币余额请求失败:', error)
          if (!auth.handleAuthError(error)) {
            wx.showToast({
              title: '网络错误，请重试',
              icon: 'none'
            })
          }
          reject(error)
        }
      })
    })
  },

  loadServiceRecords(isLoadMore = false) {
    return new Promise((resolve, reject) => {
      const app = getApp()
      const userId = app.globalData.userInfo?.id
      const { currentPage, pageSize, selectedRecordType, searchKeyword } = this.data
      
      if (!userId) {
        reject(new Error('用户信息不存在'))
        return
      }

      const page = isLoadMore ? currentPage + 1 : 1

      wx.request({
        url: `${app.globalData.baseUrl}/api/time-bank/records/${userId}`,
        method: 'GET',
        header: auth.getAuthHeader(),
        data: {
          page,
          pageSize,
          type: selectedRecordType === 'all' ? '' : selectedRecordType,
          keyword: searchKeyword
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            const newRecords = res.data.data.records || []
            const hasMore = newRecords.length >= pageSize
            
            this.setData({
              serviceRecords: isLoadMore ? [...this.data.serviceRecords, ...newRecords] : newRecords,
              currentPage: page,
              hasMore
            })
            this.filterServiceRecords()
            resolve()
          } else {
            console.error('加载服务记录失败:', res.data)
            wx.showToast({
              title: res.data.message || '加载失败',
              icon: 'none'
            })
            reject(new Error(res.data.message || '加载失败'))
          }
        },
        fail: (error) => {
          console.error('加载服务记录请求失败:', error)
          if (!auth.handleAuthError(error)) {
            wx.showToast({
              title: '网络错误，请重试',
              icon: 'none'
            })
          }
          reject(error)
        }
      })
    })
  },

  loadExchangeRules() {
    return new Promise((resolve, reject) => {
      const app = getApp()
      
      wx.request({
        url: `${app.globalData.baseUrl}/api/time-bank/exchange-rules`,
        method: 'GET',
        header: auth.getAuthHeader(),
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            this.setData({
              exchangeRules: res.data.data.rules || []
            })
            resolve()
          } else {
            console.error('加载兑换规则失败:', res.data)
            reject(new Error(res.data.message || '加载失败'))
          }
        },
        fail: (error) => {
          console.error('加载兑换规则请求失败:', error)
          if (!auth.handleAuthError(error)) {
            wx.showToast({
              title: '网络错误，请重试',
              icon: 'none'
            })
          }
          reject(error)
        }
      })
    })
  },

  filterServiceRecords() {
    const { serviceRecords, selectedRecordType, searchKeyword } = this.data
    let filteredServiceRecords = [...serviceRecords]
    
    if (selectedRecordType !== 'all') {
      filteredServiceRecords = filteredServiceRecords.filter(item => item.type === selectedRecordType)
    }
    
    if (searchKeyword && searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim()
      filteredServiceRecords = filteredServiceRecords.filter(item => 
        item.title && item.title.toLowerCase().includes(keyword)
      )
    }
    
    this.setData({
      filteredServiceRecords
    })
  },

  refreshData(callback) {
    this.setData({
      isRefreshing: true
    })
    Promise.all([
      this.loadTimeCoinBalance(),
      this.loadServiceRecords(false),
      this.loadExchangeRules()
    ]).finally(() => {
      this.setData({
        isRefreshing: false
      })
      if (callback && typeof callback === 'function') {
        callback()
      }
    })
  },

  loadMoreRecords() {
    this.setData({
      isLoading: true
    })
    this.loadServiceRecords(true).finally(() => {
      this.setData({
        isLoading: false
      })
    })
  },

  switchRecordType(e) {
    const recordType = e.currentTarget.dataset.type
    this.setData({
      selectedRecordType: recordType,
      currentPage: 1
    }, () => {
      this.filterServiceRecords()
    })
  },

  onSearchInput: debounce(function(e) {
    const keyword = e.detail.value
    this.setData({
      searchKeyword: keyword
    }, () => {
      this.filterServiceRecords()
    })
  }, 300),

  onClearSearch() {
    this.setData({
      searchKeyword: ''
    }, () => {
      this.filterServiceRecords()
    })
  },

  openExchangeModal(e) {
    const itemId = e.currentTarget.dataset.id
    const selectedExchangeItem = this.data.exchangeRules.find(item => item.id === itemId)
    
    if (!selectedExchangeItem) {
      wx.showToast({
        title: '商品信息不存在',
        icon: 'none'
      })
      return
    }
    
    this.setData({
      showExchangeModal: true,
      selectedExchangeItem
    })
  },

  closeExchangeModal() {
    this.setData({
      showExchangeModal: false,
      selectedExchangeItem: null
    })
  },

  confirmExchange() {
    const { selectedExchangeItem, timeCoinBalance } = this.data
    
    if (!selectedExchangeItem) {
      wx.showToast({
        title: '请选择兑换商品',
        icon: 'none'
      })
      return
    }
    
    if (timeCoinBalance < selectedExchangeItem.requiredTime) {
      wx.showToast({
        title: '时间币余额不足',
        icon: 'none'
      })
      return
    }
    
    wx.showLoading({
      title: '兑换中...'
    })
    
    const app = getApp()
    const userId = app.globalData.userInfo?.id
    
    wx.request({
      url: `${app.globalData.baseUrl}/api/time-bank/exchange`,
      method: 'POST',
      header: auth.getAuthHeader(),
      data: {
        userId,
        ruleId: selectedExchangeItem.id
      },
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200 && res.data.success) {
          const newBalance = timeCoinBalance - selectedExchangeItem.requiredTime
          const newRecord = {
            id: res.data.data.recordId || Date.now(),
            type: 'spend',
            title: `兑换${selectedExchangeItem.name}`,
            duration: selectedExchangeItem.requiredTime,
            time: new Date().toLocaleString('zh-CN'),
            status: 'completed'
          }
          
          this.setData({
            timeCoinBalance: newBalance,
            serviceRecords: [newRecord, ...this.data.serviceRecords],
            showExchangeModal: false,
            selectedExchangeItem: null
          }, () => {
            this.filterServiceRecords()
          })
          
          wx.showToast({
            title: '兑换成功',
            icon: 'success'
          })
        } else {
          console.error('兑换失败:', res.data)
          wx.showToast({
            title: res.data.message || '兑换失败',
            icon: 'none'
          })
        }
      },
      fail: (error) => {
        wx.hideLoading()
        console.error('兑换请求失败:', error)
        if (!auth.handleAuthError(error)) {
          wx.showToast({
            title: '网络错误，请重试',
            icon: 'none'
          })
        }
      }
    })
  },

  viewServiceDetail(e) {
    const recordId = e.currentTarget.dataset.recordId
    if (!recordId) {
      wx.showToast({
        title: '记录信息不存在',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: `/pages/time-bank/record-detail/record-detail?id=${recordId}`
    })
  },

  exportData() {
    const { serviceRecords } = this.data
    
    if (serviceRecords.length === 0) {
      wx.showToast({
        title: '暂无数据可导出',
        icon: 'none'
      })
      return
    }
    
    wx.showLoading({
      title: '导出中...'
    })
    
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '导出成功',
        icon: 'success'
      })
    }, 1000)
  },

  setupNetworkListener() {
    wx.getNetworkType({
      success: (res) => {
        this.setData({
          offline: res.networkType === 'none'
        })
      }
    })
    
    wx.onNetworkStatusChange((res) => {
      this.setData({
        offline: !res.isConnected
      })
    })
  }
})

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}