// adoption.js - 爱心认领
Page({
  data: {
    // 爱心认领需求列表
    adoptionNeeds: [
      {
        id: 1,
        name: '王奶奶',
        age: 82,
        gender: '女',
        address: '乡村安土社区1号院',
        description: '独居老人，行动不便，需要日常照顾和陪伴',
        needs: ['日常照顾', '陪伴聊天', '购物代办'],
        status: 'pending', // pending, adopted, completed
        image: '/images/elder/elder1.svg'
      },
      {
        id: 2,
        name: '李爷爷',
        age: 78,
        gender: '男',
        address: '乡村安土社区2号院',
        description: '独居老人，患有高血压，需要定期测量血压和提醒用药',
        needs: ['健康监测', '用药提醒', '医疗陪同'],
        status: 'pending',
        image: '/images/elder/elder2.svg'
      },
      {
        id: 3,
        name: '张奶奶',
        age: 85,
        gender: '女',
        address: '乡村安土社区3号院',
        description: '独居老人，视力不佳，需要帮助阅读和购物',
        needs: ['阅读帮助', '购物代办', '家务协助'],
        status: 'adopted',
        image: '/images/elder/elder3.svg'
      }
    ],
    // 过滤后的爱心认领需求列表
    filteredAdoptionNeeds: [],
    // 认领记录
    adoptionRecords: [
      {
        id: 1,
        elderName: '张奶奶',
        adoptionTime: '2024-01-05 14:30:00',
        status: 'adopted',
        adopterName: '爱心企业A'
      }
    ],
    // 筛选状态
    filterStatus: 'all', // all, pending, adopted, completed
    // 认领弹窗显示状态
    showAdoptionModal: false,
    // 当前选中的需求
    selectedNeed: null
  },

  onLoad() {
    console.log('Adoption page loaded')
    // 从数据库获取爱心认领需求和认领记录
    this.loadAdoptionData()
  },

  // 过滤爱心认领需求列表
  filterAdoptionNeeds() {
    const { adoptionNeeds, filterStatus } = this.data
    const filtered = adoptionNeeds.filter(item => {
      return filterStatus === 'all' || filterStatus === item.status
    })
    this.setData({
      filteredAdoptionNeeds: filtered
    })
  },

  onReady() {
    console.log('Adoption page ready')
  },

  // 加载爱心认领数据
  loadAdoptionData() {
    // 模拟从数据库获取数据
    // 实际项目中应该调用API获取数据
    const adoptionNeeds = this.data.adoptionNeeds
    const adoptionRecords = this.data.adoptionRecords
    this.setData({
      adoptionNeeds,
      adoptionRecords
    })
    // 加载后进行过滤
    this.filterAdoptionNeeds()
  },

  // 筛选状态切换
  switchFilterStatus(e) {
    const status = e.currentTarget.dataset.status
    this.setData({
      filterStatus: status
    })
    // 切换后重新过滤
    this.filterAdoptionNeeds()
  },

  // 打开认领弹窗
  openAdoptionModal(e) {
    const needId = e.currentTarget.dataset.id
    const selectedNeed = this.data.adoptionNeeds.find(need => need.id === needId)
    this.setData({
      showAdoptionModal: true,
      selectedNeed
    })
  },

  // 关闭认领弹窗
  closeAdoptionModal() {
    this.setData({
      showAdoptionModal: false,
      selectedNeed: null
    })
  },

  // 确认认领
  confirmAdoption() {
    const { selectedNeed } = this.data
    
    // 执行认领操作
    // 实际项目中应该调用API执行认领
    // 更新需求状态
    const updatedNeeds = this.data.adoptionNeeds.map(need => {
      if (need.id === selectedNeed.id) {
        return {
          ...need,
          status: 'adopted'
        }
      }
      return need
    })
    
    // 添加认领记录
    const newRecord = {
      id: Date.now(),
      elderName: selectedNeed.name,
      adoptionTime: new Date().toLocaleString('zh-CN'),
      status: 'adopted',
      adopterName: '当前用户' // 实际项目中应该获取当前登录用户信息
    }
    
    this.setData({
      adoptionNeeds: updatedNeeds,
      adoptionRecords: [newRecord, ...this.data.adoptionRecords],
      showAdoptionModal: false,
      selectedNeed: null
    })
    
    // 更新后重新过滤
    this.filterAdoptionNeeds()
    
    wx.showToast({
      title: '认领成功',
      icon: 'success'
    })
  },

  // 查看需求详情
  viewNeedDetail(e) {
    const needId = e.currentTarget.dataset.id
    wx.showToast({
      title: `查看需求详情：${needId}`,
      icon: 'none'
    })
  }
})