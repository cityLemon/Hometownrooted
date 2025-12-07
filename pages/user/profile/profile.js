// profile.js - 个人信息
const app = getApp();

Page({
  data: {
    // 页面加载状态
    pageLoaded: false,
    // 离线状态
    offline: false,
    // 登录状态
    isLoggedIn: false,
    // 用户信息
    userInfo: {
      avatarUrl: '/images/avatar/default.svg',
      name: '',
      phone: '',
      gender: '',
      age: '',
      address: '',
      role: '',
      familyMembers: []
    },
    // 编辑模式
    editMode: false,
    // 临时存储编辑数据
    tempUserInfo: {}
  },

  onLoad() {
    console.log('User profile page loaded')
    // 检查登录状态
    this.checkLoginStatus()
    
    // 设置网络状态监听
    this.setupNetworkListener()
  },

  onShow() {
    // 页面显示时重新检查登录状态
    this.checkLoginStatus()
  },

  onReady() {
    console.log('User profile page ready')
  },

  // 检查登录状态
  checkLoginStatus() {
    const app = getApp()
    const isLoggedIn = app.globalData.isLoggedIn || false
    
    this.setData({
      isLoggedIn: isLoggedIn,
      pageLoaded: true
    })

    if (isLoggedIn) {
      // 已登录，加载用户信息
      this.loadUserInfo()
    } else {
      // 未登录，显示空数据
      this.setData({
        userInfo: {
          avatarUrl: '/images/avatar/default.svg',
          name: '',
          phone: '',
          gender: '',
          age: '',
          address: '',
          role: '',
          familyMembers: []
        }
      })
    }
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login/login'
    })
  },

  // 加载用户信息
  loadUserInfo() {
    // 从全局数据获取用户信息
    const app = getApp()
    const globalUserInfo = app.globalData.userInfo
    
    if (globalUserInfo) {
      // 使用全局用户信息
      const userInfo = {
        avatarUrl: globalUserInfo.avatarUrl || '/images/avatar/default.svg',
        name: globalUserInfo.realName || globalUserInfo.username || '',
        phone: globalUserInfo.phone || '',
        gender: globalUserInfo.gender || '',
        age: globalUserInfo.age || '',
        address: globalUserInfo.address || '',
        role: globalUserInfo.role || '',
        familyMembers: globalUserInfo.familyMembers || []
      }
      
      this.setData({
        userInfo,
        tempUserInfo: JSON.parse(JSON.stringify(userInfo))
      })
    } else {
      // 如果全局没有用户信息，尝试从本地存储获取
      const storedUserInfo = wx.getStorageSync('userInfo')
      if (storedUserInfo) {
        const userInfo = {
          avatarUrl: storedUserInfo.avatarUrl || '/images/avatar/default.svg',
          name: storedUserInfo.realName || storedUserInfo.username || '',
          phone: storedUserInfo.phone || '',
          gender: storedUserInfo.gender || '',
          age: storedUserInfo.age || '',
          address: storedUserInfo.address || '',
          role: storedUserInfo.role || '',
          familyMembers: storedUserInfo.familyMembers || []
        }
        
        this.setData({
          userInfo,
          tempUserInfo: JSON.parse(JSON.stringify(userInfo))
        })
      }
    }
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
          // 清除本地存储的用户信息
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('token')
          
          // 清除全局数据
          const app = getApp()
          app.globalData.userInfo = null
          app.globalData.isLoggedIn = false
          app.globalData.token = ''
          
          // 显示退出成功提示
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 1500
          })
          
          // 重置页面数据
          this.setData({
            isLoggedIn: false,
            userInfo: {
              avatarUrl: '/images/avatar/default.svg',
              name: '',
              phone: '',
              gender: '',
              age: '',
              address: '',
              role: '',
              familyMembers: []
            }
          })
          
          // 跳转到登录页面
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/auth/login/login'
            })
          }, 1500)
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