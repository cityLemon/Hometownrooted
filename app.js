// app.js
App({
  onLaunch() {
    console.log('App launched')
    
    // Check for compatibility issues
    if (!wx.getMenuButtonBoundingClientRect) {
      console.warn('getMenuButtonBoundingClientRect not available')
    }
    
    if (!wx.getSystemInfoSync) {
      console.warn('getSystemInfoSync not available')
    }
  },
  
  onShow() {
    console.log('App shown')
  },
  
  onHide() {
    console.log('App hidden')
  }
})
