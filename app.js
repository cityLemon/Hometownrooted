// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    isLoggedIn: false,
    currentRole: null,
    baseUrl: 'http://localhost:8080/hometownrooted_backend_war_exploded'
  },

  onLaunch() {
    console.log('========================================')
    console.log('🚀 App launched')
    console.log('========================================')
    
    // 检查后端连接状态
    this.checkBackendConnection()
    
    // 检查数据库连接状态（通过后端API）
    this.checkDatabaseConnection()
    
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

  // 检查后端连接状态
  checkBackendConnection() {
    console.log('\n📡 检查后端连接状态...')
    const that = this
    const url = this.globalData.baseUrl + '/api/health'
    
    console.log('请求URL:', url)
    
    wx.request({
      url: url,
      method: 'GET',
      timeout: 5000,
      success: (res) => {
        if (res.statusCode === 200) {
          console.log('✅ 后端连接成功')
          console.log('   后端地址:', this.globalData.baseUrl)
          console.log('   响应状态:', res.statusCode)
          
          // 显示连接成功提示
          wx.showToast({
            title: '后端连接成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          console.log('❌ 后端连接失败')
          console.log('   状态码:', res.statusCode)
          
          wx.showToast({
            title: '后端连接失败',
            icon: 'error',
            duration: 3000
          })
        }
      },
      fail: (error) => {
        console.log('❌ 后端连接失败')
        console.log('   错误信息:', error.errMsg)
        
        wx.showToast({
          title: '无法连接后端',
          icon: 'error',
          duration: 3000
        })
      }
    })
  },

  // 检查数据库连接状态
  checkDatabaseConnection() {
    console.log('\n💾 检查数据库连接状态...')
    const that = this
    const url = this.globalData.baseUrl + '/api/database/status'
    
    console.log('请求URL:', url)
    
    wx.request({
      url: url,
      method: 'GET',
      timeout: 5000,
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          console.log('✅ 数据库连接成功')
          console.log('   数据库类型:', res.data.databaseType || 'MySQL')
          console.log('   数据库名称:', res.data.databaseName || 'hometownrooted')
          console.log('   连接状态:', res.data.status || '正常')
          
          wx.showToast({
            title: '数据库连接成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          console.log('❌ 数据库连接失败')
          console.log('   响应数据:', res.data)
          
          wx.showToast({
            title: '数据库连接失败',
            icon: 'error',
            duration: 3000
          })
        }
      },
      fail: (error) => {
        console.log('❌ 数据库连接失败')
        console.log('   错误信息:', error.errMsg)
        console.log('   提示: 请确保后端服务已启动且数据库配置正确')
        
        wx.showToast({
          title: '无法连接数据库',
          icon: 'error',
          duration: 3000
        })
      }
    })
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
