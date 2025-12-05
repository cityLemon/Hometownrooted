// emergency-button.js - 紧急按钮组件
Component({
  // 组件的属性列表
  properties: {
    // 按钮文本
    text: {
      type: String,
      value: '一键呼救'
    },
    // 按钮尺寸：small, medium, large
    size: {
      type: String,
      value: 'large'
    },
    // 按钮颜色
    color: {
      type: String,
      value: '#f5222d' // 默认红色
    },
    // 倒计时时间（秒）
    countdown: {
      type: Number,
      value: 10
    },
    // 是否自动拨号
    autoCall: {
      type: Boolean,
      value: true
    },
    // 是否显示倒计时
    showCountdown: {
      type: Boolean,
      value: true
    },
    // 是否可点击
    disabled: {
      type: Boolean,
      value: false
    }
  },

  // 组件的初始数据
  data: {
    // 倒计时剩余时间
    remainingTime: 0,
    // 按钮状态：idle, counting, calling, success, failed
    status: 'idle',
    // 定时器
    timer: null
  },

  // 组件的方法列表
  methods: {
    // 按钮点击事件
    onButtonClick() {
      if (this.properties.disabled) {
        return
      }

      // 如果已经在倒计时或呼叫中，不重复触发
      if (this.data.status === 'counting' || this.data.status === 'calling') {
        return
      }

      // 开始倒计时
      this.startCountdown()
    },

    // 开始倒计时
    startCountdown() {
      // 设置初始剩余时间
      this.setData({
        remainingTime: this.properties.countdown,
        status: 'counting'
      })

      // 触发开始倒计时事件
      this.triggerEvent('countdownstart', {
        countdown: this.properties.countdown
      })

      // 创建定时器
      const timer = setInterval(() => {
        const remainingTime = this.data.remainingTime - 1
        this.setData({
          remainingTime
        })

        // 倒计时结束
        if (remainingTime <= 0) {
          this.clearTimer()
          this.executeCall()
        }
      }, 1000)

      this.setData({
        timer
      })
    },

    // 取消呼叫
    cancelCall() {
      this.clearTimer()
      this.setData({
        status: 'idle',
        remainingTime: 0
      })

      // 触发取消事件
      this.triggerEvent('cancel', {})
    },

    // 清除定时器
    clearTimer() {
      if (this.data.timer) {
        clearInterval(this.data.timer)
        this.setData({
          timer: null
        })
      }
    },

    // 执行呼叫
    executeCall() {
      this.setData({
        status: 'calling'
      })

      // 触发呼叫事件
      this.triggerEvent('call', {
        autoCall: this.properties.autoCall
      })

      // 模拟呼叫成功
      setTimeout(() => {
        this.setData({
          status: 'success'
        })
        
        // 触发呼叫成功事件
        this.triggerEvent('callsuccess', {})
        
        // 3秒后恢复到初始状态
        setTimeout(() => {
          this.setData({
            status: 'idle',
            remainingTime: 0
          })
        }, 3000)
      }, 2000)
    }
  },

  // 组件生命周期
  lifetimes: {
    attached() {
      // 组件挂载时执行
      console.log('Emergency button component attached')
    },
    detached() {
      // 组件卸载时执行
      console.log('Emergency button component detached')
      // 清除定时器
      this.clearTimer()
    }
  }
})