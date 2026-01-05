const auth = require('../../../utils/auth.js')

Page({
  data: {
    emergencyContacts: [
      { id: 1, name: '儿子', phone: '13800138001', relation: '子女' },
      { id: 2, name: '女儿', phone: '13800138002', relation: '子女' },
      { id: 3, name: '乡村医疗站', phone: '010-12345678', relation: '医疗服务' }
    ],
    location: {
      latitude: 0,
      longitude: 0,
      address: '正在获取位置...'
    },
    callStatus: 'idle',
    countDown: 10,
    timer: null,
    autoCall: true
  },

  onLoad() {
    console.log('Emergency page loaded')
    if (!auth.checkLogin()) {
      return
    }
    this.getCurrentLocation()
  },

  onReady() {
    console.log('Emergency page ready')
  },

  onUnload() {
    // 清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  getCurrentLocation() {
    wx.showLoading({
      title: '获取位置中...'
    })
    
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: (res) => {
        const { latitude, longitude } = res
        this.setData({
          'location.latitude': latitude,
          'location.longitude': longitude
        })
        this.reverseGeocode(latitude, longitude)
        wx.hideLoading()
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('获取位置失败:', err)
        this.setData({
          'location.address': '获取位置失败，请检查权限设置'
        })
        wx.showModal({
          title: '位置权限',
          content: '需要获取您的位置信息以便紧急呼救，请授权位置权限',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting()
            }
          }
        })
      }
    })
  },

  // 逆地址解析
  reverseGeocode(latitude, longitude) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${latitude},${longitude}`,
        key: 'YOUR_TENCENT_MAP_KEY' // 请替换为实际的腾讯地图API Key
      },
      success: (res) => {
        if (res.data.status === 0) {
          this.setData({
            'location.address': res.data.result.address
          })
        }
      },
      fail: (err) => {
        console.error('逆地址解析失败:', err)
        this.setData({
          'location.address': `${latitude},${longitude}`
        })
      }
    })
  },

  // 一键呼救
  emergencyCall() {
    // 开始倒计时
    this.startCountDown()
    
    this.setData({
      callStatus: 'calling'
    })
  },

  // 开始倒计时
  startCountDown() {
    let countDown = 10
    this.setData({
      countDown,
      timer: setInterval(() => {
        countDown--
        this.setData({
          countDown
        })
        
        if (countDown <= 0) {
          // 倒计时结束，执行呼救
          this.executeCall()
          this.clearCountDown()
        }
      }, 1000)
    })
  },

  // 取消呼救
  cancelCall() {
    this.clearCountDown()
    this.setData({
      callStatus: 'idle',
      countDown: 10
    })
    
    wx.showToast({
      title: '已取消呼救',
      icon: 'success'
    })
  },

  // 清除倒计时
  clearCountDown() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({
        timer: null
      })
    }
  },

  executeCall() {
    wx.showLoading({
      title: '发送中...'
    })
    
    const app = getApp()
    const userId = app.globalData.userInfo?.id
    
    const sosData = {
      userId: userId,
      location: {
        latitude: this.data.location.latitude,
        longitude: this.data.location.longitude,
        address: this.data.location.address
      },
      contacts: this.data.emergencyContacts,
      timestamp: new Date().toISOString()
    }
    
    wx.request({
      url: `${app.globalData.baseUrl}/api/emergency/sos`,
      method: 'POST',
      header: auth.getAuthHeader(),
      data: sosData,
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200 && res.data.success) {
          this.sendSOSMessage()
          
          if (this.data.autoCall) {
            this.autoDial()
          }
          
          this.notifyMedicalStation()
          
          this.setData({
            callStatus: 'success'
          })
          
          wx.showToast({
            title: '呼救已发送',
            icon: 'success'
          })
        } else {
          console.error('发送呼救失败:', res.data)
          this.setData({
            callStatus: 'failed'
          })
          wx.showToast({
            title: res.data.message || '发送失败',
            icon: 'none'
          })
        }
      },
      fail: (error) => {
        wx.hideLoading()
        console.error('发送呼救请求失败:', error)
        if (!auth.handleAuthError(error)) {
          this.setData({
            callStatus: 'failed'
          })
          wx.showToast({
            title: '网络错误，请重试',
            icon: 'none'
          })
        }
      }
    })
  },

  // 发送SOS信息给紧急联系人
  sendSOSMessage() {
    // 模拟发送信息
    // 实际项目中应该调用API发送信息
    const { location } = this.data
    const message = `【紧急呼救】${this.data.emergencyContacts[0].name}，我需要帮助！我的位置是：${location.address}（${location.latitude}, ${location.longitude}）`
    
    console.log('发送SOS信息:', message)
    // 可以使用微信模板消息或云函数发送短信
  },

  // 自动拨号
  autoDial() {
    // 模拟自动拨号
    // 实际项目中可以使用wx.makePhoneCall
    const phoneNumber = this.data.emergencyContacts[0].phone
    
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: () => {
        console.log('自动拨号成功')
      },
      fail: (err) => {
        console.error('自动拨号失败:', err)
      }
    })
  },

  // 通知乡村医疗站
  notifyMedicalStation() {
    // 模拟通知乡村医疗站
    // 实际项目中应该调用API通知医疗站
    const { location } = this.data
    const message = `【紧急呼救】有老人需要帮助！位置：${location.address}（${location.latitude}, ${location.longitude}）`
    
    console.log('通知乡村医疗站:', message)
  },

  // 手动拨号
  manualDial(e) {
    const phoneNumber = e.currentTarget.dataset.phone
    
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: () => {
        console.log('手动拨号成功')
      },
      fail: (err) => {
        console.error('手动拨号失败:', err)
      }
    })
  },

  // 切换自动拨号
  toggleAutoCall() {
    this.setData({
      autoCall: !this.data.autoCall
    })
  },

  // 重新获取位置
  refreshLocation() {
    this.getCurrentLocation()
  }
})
