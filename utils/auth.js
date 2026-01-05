const app = getApp()

function checkLogin(showToast = true) {
  if (!app.globalData.isLoggedIn || !app.globalData.userInfo) {
    if (showToast) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再使用此功能',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/login/login'
            })
          }
        }
      })
    }
    return false
  }
  return true
}

function requireLogin(page, callback) {
  if (checkLogin()) {
    if (callback && typeof callback === 'function') {
      callback()
    }
  }
}

function checkRole(requiredRole) {
  if (!checkLogin()) {
    return false
  }
  
  const currentRole = app.globalData.currentRole
  if (requiredRole && currentRole !== requiredRole) {
    wx.showToast({
      title: `需要${requiredRole}权限`,
      icon: 'none'
    })
    return false
  }
  
  return true
}

function getAuthHeader() {
  return {
    'Authorization': `Bearer ${app.globalData.token}`,
    'Content-Type': 'application/json'
  }
}

function handleAuthError(error) {
  if (error.statusCode === 401 || error.statusCode === 403) {
    wx.showModal({
      title: '登录已过期',
      content: '请重新登录',
      confirmText: '去登录',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          app.clearLoginData()
          wx.navigateTo({
            url: '/pages/auth/login/login'
          })
        }
      }
    })
    return true
  }
  return false
}

module.exports = {
  checkLogin,
  requireLogin,
  checkRole,
  getAuthHeader,
  handleAuthError
}