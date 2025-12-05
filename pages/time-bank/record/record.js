// record.js - 服务记录与兑换
Page({
  data: {
    // 时间币余额
    timeCoinBalance: 120,
    // 服务记录列表
    serviceRecords: [
      {
        id: 1,
        type: 'earn', // earn 赚取, spend 消费
        title: '帮助张奶奶买菜',
        duration: 2,
        time: '2024-01-05 14:30:00',
        status: 'completed'
      },
      {
        id: 2,
        type: 'earn',
        title: '陪伴李爷爷聊天',
        duration: 1.5,
        time: '2024-01-04 10:00:00',
        status: 'completed'
      },
      {
        id: 3,
        type: 'spend',
        title: '兑换大米一袋',
        duration: 5,
        time: '2024-01-03 16:00:00',
        status: 'completed'
      },
      {
        id: 4,
        type: 'earn',
        title: '帮助王奶奶打扫卫生',
        duration: 3,
        time: '2024-01-02 09:00:00',
        status: 'completed'
      }
    ],
    // 过滤后的服务记录列表
    filteredServiceRecords: [],
    // 兑换规则
    exchangeRules: [
      {
        id: 1,
        name: '大米一袋',
        requiredTime: 5,
        description: '5公斤装大米一袋',
        image: '/images/products/rice.svg'
      },
      {
        id: 2,
        name: '食用油一桶',
        requiredTime: 8,
        description: '5升装食用油一桶',
        image: '/images/products/oil.svg'
      },
      {
        id: 3,
        name: '洗衣粉一袋',
        requiredTime: 3,
        description: '1公斤装洗衣粉一袋',
        image: '/images/products/detergent.svg'
      }
    ],
    // 当前选中的记录类型
    selectedRecordType: 'all', // all, earn, spend
    // 兑换弹窗显示状态
    showExchangeModal: false,
    // 当前选中的兑换商品
    selectedExchangeItem: null
  },

  onLoad() {
    console.log('Service record page loaded')
    // 从数据库获取服务记录和时间币余额
    this.loadServiceRecords()
  },

  onReady() {
    console.log('Service record page ready')
  },

  // 加载服务记录和时间币余额
  loadServiceRecords() {
    // 模拟从数据库获取数据
    // 实际项目中应该调用API获取数据
    const serviceRecords = this.data.serviceRecords
    const timeCoinBalance = this.data.timeCoinBalance
    this.setData({
      serviceRecords,
      timeCoinBalance
    })
    // 初始化过滤后的服务记录列表
    this.filterServiceRecords()
  },

  // 过滤服务记录列表
  filterServiceRecords() {
    const { serviceRecords, selectedRecordType } = this.data
    let filteredServiceRecords = []
    
    if (selectedRecordType === 'all') {
      filteredServiceRecords = serviceRecords
    } else {
      filteredServiceRecords = serviceRecords.filter(item => item.type === selectedRecordType)
    }
    
    this.setData({
      filteredServiceRecords
    })
  },

  // 切换记录类型
  switchRecordType(e) {
    const recordType = e.currentTarget.dataset.type
    this.setData({
      selectedRecordType: recordType
    }, () => {
      // 切换记录类型后重新过滤服务记录列表
      this.filterServiceRecords()
    })
  },

  // 打开兑换弹窗
  openExchangeModal(e) {
    const itemId = e.currentTarget.dataset.id
    const selectedExchangeItem = this.data.exchangeRules.find(item => item.id === itemId)
    this.setData({
      showExchangeModal: true,
      selectedExchangeItem
    })
  },

  // 关闭兑换弹窗
  closeExchangeModal() {
    this.setData({
      showExchangeModal: false,
      selectedExchangeItem: null
    })
  },

  // 确认兑换
  confirmExchange() {
    const { selectedExchangeItem, timeCoinBalance } = this.data
    
    // 检查时间币余额是否足够
    if (timeCoinBalance < selectedExchangeItem.requiredTime) {
      wx.showToast({
        title: '时间币余额不足',
        icon: 'none'
      })
      return
    }
    
    // 执行兑换操作
    // 实际项目中应该调用API执行兑换
    const newBalance = timeCoinBalance - selectedExchangeItem.requiredTime
    const newRecord = {
      id: Date.now(),
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
      // 兑换成功后重新过滤服务记录列表
      this.filterServiceRecords()
    })
    
    wx.showToast({
      title: '兑换成功',
      icon: 'success'
    })
  },

  // 查看兑换详情
  viewExchangeDetail(e) {
    const itemId = e.currentTarget.dataset.id
    wx.showToast({
      title: `查看兑换详情：${itemId}`,
      icon: 'none'
    })
  },

  // 查看服务详情
  viewServiceDetail(e) {
    const recordId = e.currentTarget.dataset.id
    wx.showToast({
      title: `查看服务详情：${recordId}`,
      icon: 'none'
    })
  }
})
