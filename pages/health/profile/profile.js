// profile.js - 健康档案管理
Page({
  data: {
    // 健康档案数据
    healthProfile: {
      basicInfo: {
        name: '张三',
        age: 75,
        gender: '男',
        phone: '13800138000',
        address: '北京市朝阳区乡村安土社区'
      },
      chronicDiseases: [
        { id: 1, name: '高血压', diagnosisDate: '2020-01-01', status: '稳定' },
        { id: 2, name: '糖尿病', diagnosisDate: '2021-03-15', status: '稳定' }
      ],
      medication: [
        { id: 1, name: '硝苯地平缓释片', dosage: '1片/次，2次/日', time: '早7:00，晚7:00' },
        { id: 2, name: '二甲双胍', dosage: '2片/次，3次/日', time: '早中晚饭后' }
      ],
      allergies: '青霉素过敏'
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
  },

  onReady() {
    console.log('Health profile page ready')
  },

  // 加载健康档案数据
  loadHealthProfile() {
    // 模拟从数据库获取数据
    // 实际项目中应该调用API获取数据
    const healthProfile = this.data.healthProfile
    this.setData({
      healthProfile,
      tempProfile: JSON.parse(JSON.stringify(healthProfile))
    })
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
  }
})
