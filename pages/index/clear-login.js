// 清除登录数据并重启应用
function clearLoginAndRestart() {
  try {
    // 清除本地存储
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    
    // 清除全局数据
    const app = getApp()
    app.globalData.userInfo = null
    app.globalData.token = null
    app.globalData.isLoggedIn = false
    app.globalData.currentRole = null
    
    wx.showToast({
      title: '登录数据已清除',
      icon: 'success',
      duration: 1500
    })
    
    // 重启应用到首页
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
}

module.exports = {
  clearLoginAndRestart
}