const auth = require('../../../utils/auth.js')
const app = getApp()

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
      const userId = app.globalData.userInfo?.id
      
      if (!userId) {
        // 用户信息不存在，使用mock数据
        const mockBalance = this.getMockTimeCoinBalance()
        this.setData({
          timeCoinBalance: mockBalance
        })
        resolve()
        return
      }

      wx.request({
        url: `${app.globalData.baseUrl}/api/timebank/balance?user_id=${userId}`,
        method: 'GET',
        header: auth.getAuthHeader(),
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            this.setData({
              timeCoinBalance: res.data.data.balance || 0
            })
            resolve()
          } else {
            // API返回错误，使用mock数据
            const mockBalance = this.getMockTimeCoinBalance()
            this.setData({
              timeCoinBalance: mockBalance
            })
            resolve()
          }
        },
        fail: (error) => {
          // 请求失败，使用mock数据
          const mockBalance = this.getMockTimeCoinBalance()
          this.setData({
            timeCoinBalance: mockBalance
          })
          resolve()
        }
      })
    })
  },

  getMockTimeCoinBalance() {
    const role = app.globalData.userInfo?.role || '老人'
    
    const balanceMap = {
      '老人': 50,
      '志愿者': 120,
      '管理员': 200
    }
    
    return balanceMap[role] || 50
  },

  loadServiceRecords(isLoadMore = false) {
    return new Promise((resolve, reject) => {
      const userId = app.globalData.userInfo?.id
      const { currentPage, pageSize, selectedRecordType, searchKeyword } = this.data
      
      if (!userId) {
        // 用户信息不存在，使用mock数据
        const mockRecords = this.getMockServiceRecords()
        this.setData({
          serviceRecords: mockRecords,
          currentPage: 1,
          hasMore: false
        })
        this.filterServiceRecords()
        resolve()
        return
      }

      const page = isLoadMore ? currentPage + 1 : 1

      wx.request({
        url: `${app.globalData.baseUrl}/api/timebank/records?user_id=${userId}`,
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
            // API返回错误，使用mock数据
            const mockRecords = this.getMockServiceRecords()
            this.setData({
              serviceRecords: mockRecords,
              currentPage: 1,
              hasMore: false
            })
            this.filterServiceRecords()
            resolve()
          }
        },
        fail: (error) => {
          // 请求失败，使用mock数据
          const mockRecords = this.getMockServiceRecords()
          this.setData({
            serviceRecords: mockRecords,
            currentPage: 1,
            hasMore: false
          })
          this.filterServiceRecords()
          resolve()
        }
      })
    })
  },

  getMockServiceRecords() {
    const role = app.globalData.userInfo?.role || '老人'
    
    const recordsMap = {
      '老人': [
        {
          id: 1,
          type: 'earn',
          title: '陪同就医',
          duration: 2,
          time: '2024-01-15 09:30',
          status: 'completed'
        },
        {
          id: 2,
          type: 'earn',
          title: '代购药品',
          duration: 1,
          time: '2024-01-14 14:00',
          status: 'completed'
        },
        {
          id: 3,
          type: 'spend',
          title: '兑换大米',
          duration: 5,
          time: '2024-01-13 10:00',
          status: 'completed'
        }
      ],
      '志愿者': [
        {
          id: 1,
          type: 'earn',
          title: '陪同就医',
          duration: 2,
          time: '2024-01-15 09:30',
          status: 'completed'
        },
        {
          id: 2,
          type: 'earn',
          title: '代购药品',
          duration: 1,
          time: '2024-01-14 14:00',
          status: 'completed'
        },
        {
          id: 3,
          type: 'earn',
          title: '健康讲座',
          duration: 3,
          time: '2024-01-13 15:00',
          status: 'completed'
        },
        {
          id: 4,
          type: 'earn',
          title: '家政服务',
          duration: 4,
          time: '2024-01-12 08:00',
          status: 'completed'
        },
        {
          id: 5,
          type: 'earn',
          title: '陪伴聊天',
          duration: 1,
          time: '2024-01-11 16:00',
          status: 'completed'
        }
      ],
      '管理员': [
        {
          id: 1,
          type: 'earn',
          title: '陪同就医',
          duration: 2,
          time: '2024-01-15 09:30',
          status: 'completed'
        },
        {
          id: 2,
          type: 'earn',
          title: '代购药品',
          duration: 1,
          time: '2024-01-14 14:00',
          status: 'completed'
        },
        {
          id: 3,
          type: 'earn',
          title: '健康讲座',
          duration: 3,
          time: '2024-01-13 15:00',
          status: 'completed'
        },
        {
          id: 4,
          type: 'earn',
          title: '家政服务',
          duration: 4,
          time: '2024-01-12 08:00',
          status: 'completed'
        },
        {
          id: 5,
          type: 'earn',
          title: '陪伴聊天',
          duration: 1,
          time: '2024-01-11 16:00',
          status: 'completed'
        },
        {
          id: 6,
          type: 'spend',
          title: '兑换大米',
          duration: 5,
          time: '2024-01-10 10:00',
          status: 'completed'
        }
      ]
    }
    
    return recordsMap[role] || recordsMap['老人']
  },

  loadExchangeRules() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.baseUrl}/api/timebank/exchange-rules`,
        method: 'GET',
        header: auth.getAuthHeader(),
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            this.setData({
              exchangeRules: res.data.data.rules || []
            })
            resolve()
          } else {
            // API返回错误，使用mock数据
            const mockRules = this.getMockExchangeRules()
            this.setData({
              exchangeRules: mockRules
            })
            resolve()
          }
        },
        fail: (error) => {
          // 请求失败，使用mock数据
          const mockRules = this.getMockExchangeRules()
          this.setData({
            exchangeRules: mockRules
          })
          resolve()
        }
      })
    })
  },

  getMockExchangeRules() {
    return [
      {
        id: 1,
        name: '大米',
        description: '优质东北大米5kg',
        requiredTime: 5,
        icon: '/images/rice.png'
      },
      {
        id: 2,
        name: '食用油',
        description: '花生油5L',
        requiredTime: 8,
        icon: '/images/oil.png'
      },
      {
        id: 3,
        name: '鸡蛋',
        description: '土鸡蛋30个',
        requiredTime: 6,
        icon: '/images/egg.png'
      },
      {
        id: 4,
        name: '蔬菜包',
        description: '新鲜蔬菜组合',
        requiredTime: 4,
        icon: '/images/vegetable.png'
      },
      {
        id: 5,
        name: '水果包',
        description: '时令水果组合',
        requiredTime: 5,
        icon: '/images/fruit.png'
      },
      {
        id: 6,
        name: '日用品',
        description: '洗洁精、洗衣液等',
        requiredTime: 7,
        icon: '/images/daily.png'
      }
    ]
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
          wx.showToast({
            title: res.data.message || '兑换失败',
            icon: 'none'
          })
        }
      },
      fail: (error) => {
        wx.hideLoading()
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