// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    isLoggedIn: false,
    currentRole: null
  },

  onLaunch() {
    console.log('App launched')
    
    // Check for compatibility issues
    if (!wx.getMenuButtonBoundingClientRect) {
      console.warn('getMenuButtonBoundingClientRect not available')
    }
    
    if (!wx.getSystemInfoSync) {
      console.warn('getSystemInfoSync not available')
    }

    // 检查本地存储的登录状态
    this.checkLoginStatus()
  },
  
  onShow() {
    console.log('App shown')
  },
  
  onHide() {
    console.log('App hidden')
  },

  // 检查登录状态
  checkLoginStatus() {
    try {
      const token = wx.getStorageSync('token')
      const userInfo = wx.getStorageSync('userInfo')
      
      if (token && userInfo) {
        this.globalData.token = token
        this.globalData.userInfo = userInfo
        this.globalData.isLoggedIn = true
        this.globalData.currentRole = userInfo.role_name
        
        // 验证token有效性
        this.validateToken(token)
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      this.clearLoginData()
    }
  },

  // 验证token
  validateToken(token) {
    wx.request({
      url: 'http://localhost:8080/api/auth/validate',
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          console.log('Token验证成功')
        } else {
          console.log('Token验证失败')
          this.clearLoginData()
        }
      },
      fail: (error) => {
        console.error('Token验证请求失败:', error)
      }
    })
  },

  // 登录成功处理
  loginSuccess(userInfo, token) {
    this.globalData.userInfo = userInfo
    this.globalData.token = token
    this.globalData.isLoggedIn = true
    this.globalData.currentRole = userInfo.role_name
    
    try {
      wx.setStorageSync('userInfo', userInfo)
      wx.setStorageSync('token', token)
    } catch (error) {
      console.error('存储登录数据失败:', error)
    }
  },

  // 退出登录
  logout() {
    this.clearLoginData()
    
    // 跳转到首页（使用reLaunch确保显示tabBar）
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  // 清除登录数据
  clearLoginData() {
    this.globalData.userInfo = null
    this.globalData.token = null
    this.globalData.isLoggedIn = false
    this.globalData.currentRole = null
    
    try {
      wx.removeStorageSync('userInfo')
      wx.removeStorageSync('token')
    } catch (error) {
      console.error('清除登录数据失败:', error)
    }
  },

  // 获取请求头
  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.globalData.token}`,
      'Content-Type': 'application/json'
    }
  }
})
