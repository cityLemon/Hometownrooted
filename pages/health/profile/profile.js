// profile.js - 健康档案管理
Page({
  data: {
    // 页面加载状态
    pageLoaded: false,
    // 离线状态
    offline: false,
    // 健康档案数据
    healthProfile: {
      basicInfo: {
        name: '张三',
        age: 75,
        gender: '男',
        phone: '13800138000',
        address: '北京市朝阳区乡村安土社区'
      },
      vitals: {
        bloodPressure: '120/80',
        heartRate: '72',
        bloodSugar: '5.6',
        weight: '65'
      },
      vitalsTrend: {
        bloodPressure: 'down',
        heartRate: 'stable',
        bloodSugar: 'down',
        weight: 'stable'
      },
      lastUpdateDate: '今天 14:30',
      chronicDiseases: [
        { id: 1, name: '高血压', diagnosisDate: '2020-01-01', status: '稳定' },
        { id: 2, name: '糖尿病', diagnosisDate: '2021-03-15', status: '稳定' }
      ],
      medication: [
        { id: 1, name: '硝苯地平缓释片', dosage: '1片/次，2次/日', time: '早7:00，晚7:00' },
        { id: 2, name: '二甲双胍', dosage: '2片/次，3次/日', time: '早中晚饭后' }
      ],
      allergies: '青霉素过敏',
      medicalHistory: [
        { id: 1, date: '2023-05-10', hospital: '北京协和医院', diagnosis: '高血压复诊' },
        { id: 2, date: '2023-03-15', hospital: '北京同仁医院', diagnosis: '糖尿病检查' },
        { id: 3, date: '2022-12-08', hospital: '北京安贞医院', diagnosis: '心电图检查' }
      ]
    },
    // 编辑模式
    editMode: false,
    // 临时存储编辑数据
    tempProfile: {}
  },

  onLoad() {
    console.log('Health profile page loaded')
    // 从数据库获取健康档案数据
    this.loadHealthProfile()
    this.setupNetworkListener()
  },

  onReady() {
    console.log('Health profile page ready')
    // 绘制健康指标图表
    this.drawHealthChart()
  },

  // 加载健康档案数据
  loadHealthProfile() {
    // 模拟从数据库获取数据
    // 实际项目中应该调用API获取数据
    const healthProfile = this.data.healthProfile
    this.setData({
      healthProfile,
      tempProfile: JSON.parse(JSON.stringify(healthProfile)),
      pageLoaded: true
    })
  },

  // 跳转到紧急呼救页面
  goToEmergency() {
    wx.navigateTo({
      url: '/pages/health/emergency/emergency'
    })
  },

  // 跳转到健康监测页面
  goToMonitoring() {
    wx.navigateTo({
      url: '/pages/health/monitoring/monitoring'
    })
  },

  // 跳转到服务预约页面
  goToServiceBooking() {
    wx.navigateTo({
      url: '/pages/health/service-booking/service-booking'
    })
  },

  // 分享健康档案
  shareProfile() {
    wx.showActionSheet({
      itemList: ['分享给家人', '分享给医生', '生成报告'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            // 分享给家人
            this.shareToFamily()
            break
          case 1:
            // 分享给医生
            this.shareToDoctor()
            break
          case 2:
            // 生成报告
            this.generateReport()
            break
        }
      }
    })
  },

  // 分享给家人
  shareToFamily() {
    wx.showToast({
      title: '分享链接已复制',
      icon: 'success'
    })
  },

  // 分享给医生
  shareToDoctor() {
    wx.showToast({
      title: '正在打开医生列表',
      icon: 'loading'
    })
    // 实际项目中应该跳转到医生选择页面
  },

  // 生成报告
  generateReport() {
    wx.showToast({
      title: '正在生成报告',
      icon: 'loading'
    })
    // 实际项目中应该生成并下载健康报告
  },

  // 查看就医详情
  viewMedicalDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/health/medical-detail/medical-detail?id=${id}`
    })
  },

  // 查看全部就医记录
  goToMedicalHistory() {
    wx.navigateTo({
      url: '/pages/health/medical-history/medical-history'
    })
  },

  // 显示用户菜单（切换角色、退出登录）
  showUserMenu() {
    const app = getApp()
    const userInfo = app.globalData.userInfo
    
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    wx.showActionSheet({
      itemList: ['切换角色', '退出登录'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 切换角色
          this.switchRole()
        } else if (res.tapIndex === 1) {
          // 退出登录
          this.logout()
        }
      }
    })
  },

  // 切换角色
  switchRole() {
    wx.showModal({
      title: '切换角色',
      content: '确定要切换到其他角色吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除当前登录状态
          const app = getApp()
          app.clearLoginData()
          
          // 跳转到首页
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      }
    })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.logout()
        }
      }
    })
  },

  // 绘制健康指标图表
  drawHealthChart() {
    const ctx = wx.createCanvasContext('healthChart', this)
    
    // 模拟数据
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const bloodPressure = [120, 125, 118, 130, 122, 128, 120]
    const heartRate = [72, 75, 70, 78, 73, 76, 72]
    const bloodSugar = [5.6, 6.1, 5.8, 6.5, 5.9, 6.2, 5.6]
    
    // 设置画布尺寸
    const canvasWidth = 320
    const canvasHeight = 300
    const padding = 40
    const graphWidth = canvasWidth - padding * 2
    const graphHeight = canvasHeight - padding * 2
    
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    
    // 绘制坐标轴
    ctx.beginPath()
    ctx.setStrokeStyle('#E9ECEF')
    ctx.setLineWidth(1)
    
    // X轴
    ctx.moveTo(padding, canvasHeight - padding)
    ctx.lineTo(canvasWidth - padding, canvasHeight - padding)
    
    // Y轴
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvasHeight - padding)
    
    ctx.stroke()
    
    // 绘制数据点和线条
    const drawLine = (data, color) => {
      const xStep = graphWidth / (data.length - 1)
      const maxValue = Math.max(...data)
      const minValue = Math.min(...data)
      const range = maxValue - minValue
      
      ctx.beginPath()
      ctx.setStrokeStyle(color)
      ctx.setLineWidth(2)
      
      data.forEach((value, index) => {
        const x = padding + index * xStep
        const y = canvasHeight - padding - ((value - minValue) / range) * graphHeight
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        
        // 绘制数据点
        ctx.setFillStyle(color)
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      })
      
      ctx.stroke()
    }
    
    // 绘制三条线
    drawLine(bloodPressure.map(v => v / 5), 'rgba(245, 54, 92, 0.7)') // 血压值缩小5倍便于显示
    drawLine(heartRate, 'rgba(45, 100, 240, 0.7)')
    drawLine(bloodSugar.map(v => v * 12), 'rgba(251, 99, 64, 0.7)') // 血糖值乘以12便于显示
    
    // 绘制X轴标签
    ctx.setFontSize(22)
    ctx.setFillStyle('#8898AA')
    days.forEach((day, index) => {
      const x = padding + (graphWidth / (days.length - 1)) * index
      ctx.fillText(day, x - 20, canvasHeight - padding + 20)
    })
    
    ctx.draw()
  },

  // 进入编辑模式
  enterEditMode() {
    this.setData({
      editMode: true,
      tempProfile: JSON.parse(JSON.stringify(this.data.healthProfile))
    })
  },

  // 保存编辑
  saveEdit() {
    // 验证数据
    if (!this.validateData()) {
      return
    }

    // 保存数据到数据库
    // 实际项目中应该调用API保存数据
    this.setData({
      healthProfile: this.data.tempProfile,
      editMode: false
    })

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
  },

  // 取消编辑
  cancelEdit() {
    this.setData({
      editMode: false,
      tempProfile: JSON.parse(JSON.stringify(this.data.healthProfile))
    })
  },

  // 验证数据
  validateData() {
    const tempProfile = this.data.tempProfile
    if (!tempProfile.basicInfo.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false
    }
    if (!tempProfile.basicInfo.age) {
      wx.showToast({
        title: '请输入年龄',
        icon: 'none'
      })
      return false
    }
    return true
  },

  // 输入框变化事件
  inputChange(e) {
    const { field, subfield } = e.currentTarget.dataset
    const value = e.detail.value
    
    if (subfield) {
      this.setData({
        [`tempProfile.${field}.${subfield}`]: value
      })
    } else {
      this.setData({
        [`tempProfile.${field}`]: value
      })
    }
  },

  // 添加慢性病
  addChronicDisease() {
    const chronicDiseases = this.data.tempProfile.chronicDiseases
    const newDisease = {
      id: Date.now(),
      name: '',
      diagnosisDate: '',
      status: '稳定'
    }
    chronicDiseases.push(newDisease)
    this.setData({
      [`tempProfile.chronicDiseases`]: chronicDiseases
    })
  },

  // 删除慢性病
  deleteChronicDisease(e) {
    const index = e.currentTarget.dataset.index
    const chronicDiseases = this.data.tempProfile.chronicDiseases
    chronicDiseases.splice(index, 1)
    this.setData({
      [`tempProfile.chronicDiseases`]: chronicDiseases
    })
  },

  // 添加用药
  addMedication() {
    const medication = this.data.tempProfile.medication
    const newMedication = {
      id: Date.now(),
      name: '',
      dosage: '',
      time: ''
    }
    medication.push(newMedication)
    this.setData({
      [`tempProfile.medication`]: medication
    })
  },

  // 删除用药
  deleteMedication(e) {
    const index = e.currentTarget.dataset.index
    const medication = this.data.tempProfile.medication
    medication.splice(index, 1)
    this.setData({
      [`tempProfile.medication`]: medication
    })
  },

  // 慢性病输入变化
  chronicDiseaseChange(e) {
    const { index, field } = e.currentTarget.dataset
    const value = e.detail.value
    this.setData({
      [`tempProfile.chronicDiseases[${index}].${field}`]: value
    })
  },

  // 用药输入变化
  medicationChange(e) {
    const { index, field } = e.currentTarget.dataset
    const value = e.detail.value
    this.setData({
      [`tempProfile.medication[${index}].${field}`]: value
    })
  },
  
  // 设置网络状态监听
  setupNetworkListener() {
    // 获取当前网络状态
    wx.getNetworkType({
      success: (res) => {
        this.setData({
          offline: res.networkType === 'none'
        })
      }
    })
    
    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      this.setData({
        offline: !res.isConnected
      })
    })
  }
})
