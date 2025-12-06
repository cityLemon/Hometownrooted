// profile.js - 个人信息
Page({
  data: {
    // 页面加载状态
    pageLoaded: false,
    // 离线状态
    offline: false,
    // 用户信息
    userInfo: {
      avatarUrl: '/images/avatar/default.svg',
      name: '张三',
      phone: '13800138000',
      gender: '男',
      age: 75,
      address: '北京市朝阳区乡村安土社区',
      role: 'elder', // elder, volunteer, admin, government, csr
      familyMembers: [
        { id: 1, name: '儿子', phone: '13800138001', relation: '子女' },
        { id: 2, name: '女儿', phone: '13800138002', relation: '子女' }
      ]
    },
    // 编辑模式
    editMode: false,
    // 临时存储编辑数据
    tempUserInfo: {}
  },

  onLoad() {
    console.log('User profile page loaded')
    // 从数据库获取用户信息
    this.loadUserInfo()
    
    // 页面加载完成
    this.setData({
      pageLoaded: true
    })

    // 设置网络状态监听
    this.setupNetworkListener()
  },

  onReady() {
    console.log('User profile page ready')
  },

  // 加载用户信息
  loadUserInfo() {
    // 模拟从数据库获取数据
    // 实际项目中应该调用API获取数据
    const userInfo = this.data.userInfo
    this.setData({
      userInfo,
      tempUserInfo: JSON.parse(JSON.stringify(userInfo))
    })
  },

  // 进入编辑模式
  enterEditMode() {
    this.setData({
      editMode: true,
      tempUserInfo: JSON.parse(JSON.stringify(this.data.userInfo))
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
      userInfo: this.data.tempUserInfo,
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
      tempUserInfo: JSON.parse(JSON.stringify(this.data.userInfo))
    })
  },

  // 验证数据
  validateData() {
    const tempUserInfo = this.data.tempUserInfo
    if (!tempUserInfo.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false
    }
    if (!tempUserInfo.phone) {
      wx.showToast({
        title: '请输入电话',
        icon: 'none'
      })
      return false
    }
    return true
  },

  // 输入框变化事件
  inputChange(e) {
    const { field } = e.currentTarget.dataset
    const value = e.detail.value
    this.setData({
      [`tempUserInfo.${field}`]: value
    })
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        // 上传头像到服务器
        // 实际项目中应该调用API上传头像
        this.setData({
          [`tempUserInfo.avatarUrl`]: tempFilePath
        })
      }
    })
  },

  // 查看家庭联动
  viewFamilyLinkage() {
    wx.navigateTo({
      url: '/pages/user/family/family'
    })
  },

  // 查看角色切换
  viewRoleSwitch() {
    wx.navigateTo({
      url: '/pages/user/role/role'
    })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 执行退出登录操作
          // 实际项目中应该调用API执行退出登录
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
          // 跳转到登录页面
          // wx.redirectTo({ url: '/pages/login/login' })
        }
      }
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