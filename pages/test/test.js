Page({
  data: {
    
  },

  // 清除本地存储
  clearStorage() {
    try {
      wx.removeStorageSync('token')
      wx.removeStorageSync('userInfo')
      wx.showToast({
        title: '存储已清除',
        icon: 'success'
      })
      
      // 重新启动应用
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }, 1500)
    } catch (error) {
      wx.showToast({
        title: '清除失败',
        icon: 'error'
      })
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const app = getApp()
    const isLoggedIn = app.globalData.isLoggedIn
    const userInfo = app.globalData.userInfo
    
    wx.showModal({
      title: '登录状态',
      content: `是否登录: ${isLoggedIn ? '是' : '否'}\n用户信息: ${userInfo ? JSON.stringify(userInfo) : '无'}`,
      showCancel: false
    })
  }
})