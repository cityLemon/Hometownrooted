// emergency.js - 一键呼救
Page({
  data: {
    // 紧急联系人列表
    emergencyContacts: [
      { id: 1, name: '儿子', phone: '13800138001', relation: '子女' },
      { id: 2, name: '女儿', phone: '13800138002', relation: '子女' },
      { id: 3, name: '乡村医疗站', phone: '010-12345678', relation: '医疗服务' }
    ],
    // 当前位置信息
    location: {
      latitude: 0,
      longitude: 0,
      address: '正在获取位置...'
    },
    // 呼救状态
    callStatus: 'idle', // idle, calling, success, failed
    // 倒计时（秒）
    countDown: 10,
    // 定时器
    timer: null,
    // 是否自动拨号
    autoCall: true
  },

  onLoad() {
    console.log('Emergency page loaded')
    // 获取位置信息
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

  // 获取当前位置
  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: (res) => {
        const { latitude, longitude } = res
        this.setData({
          'location.latitude': latitude,
          'location.longitude': longitude
        })
        // 逆地址解析
        this.reverseGeocode(latitude, longitude)
      },
      fail: (err) => {
        console.error('获取位置失败:', err)
        this.setData({
          'location.address': '获取位置失败，请检查权限设置'
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

  // 执行呼救
  executeCall() {
    // 1. 发送呼救信息给紧急联系人
    this.sendSOSMessage()
    
    // 2. 自动拨号（如果开启）
    if (this.data.autoCall) {
      this.autoDial()
    }
    
    // 3. 发送信息给乡村医疗站
    this.notifyMedicalStation()
    
    // 4. 更新状态
    this.setData({
      callStatus: 'success'
    })
    
    wx.showToast({
      title: '呼救已发送',
      icon: 'success'
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
