// index.js
Page({
  data: {
    // 离线状态
    offline: false,
    // 双击检测时间戳
    lastTapTime: 0,
    // 角色选项
    roles: [
      {
        id: 'elder',
        name: '老人',
        icon: '/images/roles/elder.svg',
        description: '健康管理、一键呼救、服务预约',
        animation: ''
      },
      {
        id: 'volunteer',
        name: '志愿者',
        icon: '/images/roles/volunteer.svg',
        description: '任务认领、服务记录、积分兑换',
        animation: ''
      },
      {
        id: 'admin',
        name: '管理员',
        icon: '/images/roles/admin.svg',
        description: '服务管理、用户管理、数据看板',
        animation: ''
      },
      {
        id: 'government',
        name: '政府人员',
        icon: '/images/roles/government.svg',
        description: '政策发布、项目监管、数据统计',
        animation: ''
      },
      {
        id: 'csr',
        name: '企业CSR',
        icon: '/images/roles/csr.svg',
        description: '爱心认领、公益项目、ESG报告',
        animation: ''
      }
    ],
    selectedRole: null,
    selectedRoleName: '',
    // 页面加载动画状态
    pageLoaded: false,
    // 当前轮播图索引
    currentSwiperIndex: 0,
    // 轮播图数据
    swiperList: [
      {
        id: 1,
        image: '/images/banner/1.jpg',
        title: '乡村安土，守护您的健康',
        url: '/pages/health/profile/profile'
      },
      {
        id: 2,
        image: '/images/banner/2.jpg',
        title: '银龄互助，时间银行',
        url: '/pages/time-bank/record/record'
      },
      {
        id: 3,
        image: '/images/banner/3.jpg',
        title: '乡村生活圈，便民服务',
        url: '/pages/life-circle/convenience/convenience'
      }
    ],
    // 快捷入口
    quickEntrances: [
      {
        id: 1,
        name: '健康档案',
        icon: '/images/entrances/health.svg',
        url: '/pages/health/profile/profile',
        animation: ''
      },
      {
        id: 2,
        name: '一键呼救',
        icon: '/images/entrances/emergency.svg',
        url: '/pages/health/emergency/emergency',
        animation: ''
      },
      {
        id: 3,
        name: '任务发布',
        icon: '/images/entrances/task.svg',
        url: '/pages/time-bank/task/task',
        animation: ''
      },
      {
        id: 4,
        name: '积分商城',
        icon: '/images/entrances/mall.svg',
        url: '/pages/time-bank/mall/mall',
        animation: ''
      }
    ],
    pageLoaded: false  // 页面加载状态
  },
  
  onLoad() {
    console.log('Index page loaded')
    
    // 强制显示tabBar
    this.forceShowTabBar()
    
    // 检查登录状态
    this.checkLoginStatus()
    // 监听网络状态变化
    this.setupNetworkListener()
  },
  
  onShow() {
    console.log('Index page shown')
    // 确保tabBar显示
    this.forceShowTabBar()
  },

  onReady() {
    console.log('Index page ready')
    // 页面加载完成后执行动画
    this.initPageAnimations()
  },

  // 初始化页面动画
  initPageAnimations() {
    // 为每个角色项添加加载动画
    const rolesWithAnimation = this.data.roles.map((role, index) => {
      const roleAnimation = wx.createAnimation({
        duration: 600,
        timingFunction: `cubic-bezier(0.4, 0, 0.2, 1)`,
        delay: 200 + index * 100
      })

      // 从下方淡入动画
      roleAnimation.translateY(0).opacity(1).step()
      
      role.animation = roleAnimation.export()
      return role
    })

    this.setData({
      roles: rolesWithAnimation,
      pageLoaded: true
    }, () => {
      // 初始化快捷入口动画
      this.initQuickEntranceAnimations()
    })
  },

  // 初始化快捷入口动画
  initQuickEntranceAnimations() {
    // 为每个快捷入口项添加加载动画
    const quickEntrancesWithAnimation = this.data.quickEntrances.map((entrance, index) => {
      const entranceAnimation = wx.createAnimation({
        duration: 600,
        timingFunction: `cubic-bezier(0.4, 0, 0.2, 1)`,
        delay: 1200 + index * 100
      })

      // 从下方淡入动画
      entranceAnimation.translateY(0).opacity(1).step()
      
      entrance.animation = entranceAnimation.export()
      return entrance
    })

    this.setData({
      quickEntrances: quickEntrancesWithAnimation
    }, () => {
      // 初始化进入按钮动画
      this.initEnterButtonAnimation()
    })
  },

  // 初始化进入按钮动画
  initEnterButtonAnimation() {
    const buttonAnimation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease-out',
      delay: 1600
    })

    buttonAnimation.opacity(1).translateY(0).step()
    
    this.setData({
      enterButtonAnimation: buttonAnimation.export()
    })
  },
  
  // 检查登录状态
  checkLoginStatus() {
    const app = getApp()
    
    // 临时注释掉自动重定向，让用户可以看到index页面的tabBar
    // 如果用户已登录，隐藏首页，跳转到对应角色页面
    // if (app.globalData.isLoggedIn && app.globalData.userInfo) {
    //   this.redirectToRolePage(app.globalData.userInfo.role_name)
    // }
    // 如果用户未登录，允许以游客身份访问首页
    // else {
    //   console.log('用户未登录，以游客身份访问首页')
    //   // 可以在这里添加游客模式的特殊处理
    // }
    
    console.log('当前登录状态:', app.globalData.isLoggedIn ? '已登录' : '未登录')
    if (app.globalData.isLoggedIn && app.globalData.userInfo) {
      console.log('用户信息:', app.globalData.userInfo)
      console.log('注意: 已临时禁用自动重定向，如需恢复请取消注释')
    }
  },

  // 强制显示tabBar
  forceShowTabBar() {
    if (wx.showTabBar) {
      wx.showTabBar({
        animation: false,
        success: () => {
          console.log('TabBar强制显示成功')
        },
        fail: (err) => {
          console.log('TabBar强制显示失败:', err)
        }
      })
    }
    
    // 额外检查：确保tabBar配置正确
    if (wx.getTabBar) {
      try {
        const tabBar = wx.getTabBar()
        console.log('TabBar对象:', tabBar)
      } catch (e) {
        console.log('获取TabBar对象失败:', e)
      }
    }
  },

  // 清除登录数据
  clearLoginData() {
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
  },

  // 双击事件处理
  onDoubleTap() {
    console.log('双击事件触发')
    this.showLoginDialog()
  },

  // 显示登录对话框
  showLoginDialog() {
    wx.showActionSheet({
      itemList: ['登录账号', '注册账号'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 登录
          wx.navigateTo({
            url: '/pages/auth/login/login'
          })
        } else if (res.tapIndex === 1) {
          // 注册
          wx.navigateTo({
            url: '/pages/auth/register/register'
          })
        }
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },

  // 跳转到对应角色页面
  redirectToRolePage(roleName) {
    let url = ''
    switch (roleName) {
      case '老人':
      case 'elder':
        url = '/pages/health/profile/profile'
        break
      case '志愿者':
      case 'volunteer':
        url = '/pages/time-bank/record/record'
        break
      case '管理员':
      case 'admin':
        url = '/pages/admin/service-manage/service-manage'
        break
      case '政府人员':
      case 'government':
        url = '/pages/admin/data-board/data-board'
        break
      case '企业CSR':
      case 'csr':
        url = '/pages/care/adoption/adoption'
        break
      default:
        url = '/pages/health/profile/profile'
    }

    wx.reLaunch({
      url: url
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
  },
  
  // 选择角色
  selectRole(e) {
    const roleId = e.currentTarget.dataset.roleId
    const roleIndex = e.currentTarget.dataset.index
    
    // 如果点击的是已选中的角色，则直接跳转到对应页面
    if (this.data.selectedRole === roleId) {
      // 直接跳转到对应角色页面
      this.enterRole()
      return
    }

    // 创建选中动画
    const selectAnimation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })

    // 先缩放变小，再放大到正常大小，产生弹跳效果
    selectAnimation.scale(0.9).opacity(0.8).step({ duration: 150 })
    selectAnimation.scale(1.05).opacity(1).step({ duration: 150 })
    selectAnimation.scale(1).step({ duration: 100 })
    
    // 更新角色动画
    const updatedRoles = this.data.roles.map((role, index) => {
      if (index === roleIndex) {
        role.animation = selectAnimation.export()
      } else {
        // 其他角色轻微缩小
        const otherAnimation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease-out'
        })
        otherAnimation.scale(0.95).opacity(0.8).step()
        role.animation = otherAnimation.export()
      }
      return role
    })

    // 获取选中角色的名称
    const selectedRoleName = this.data.roles.find(role => role.id === roleId)?.name || ''

    this.setData({
      selectedRole: roleId,
      selectedRoleName: selectedRoleName,
      roles: updatedRoles
    })
  },
  
  // 进入角色功能
  enterRole() {
    if (!this.data.selectedRole) {
      wx.showToast({
        title: '请选择角色',
        icon: 'none'
      })
      return
    }
    
    console.log('进入角色功能，选中角色：', this.data.selectedRole)
    
    // 检查用户是否已登录，如果未登录则跳转到登录页面
    const app = getApp()
    if (!app.globalData.isLoggedIn) {
      console.log('用户未登录，跳转到登录页面')
      wx.showModal({
        title: '需要登录',
        content: '使用此功能需要登录，是否现在登录？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/login/login'
            })
          }
        }
      })
      return
    }

    // 添加按钮动画
    const buttonAnimation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })

    buttonAnimation.scale(0.95).step()
    buttonAnimation.scale(1).step()

    this.setData({
      enterButtonAnimation: buttonAnimation.export()
    })

    // 延迟跳转，让用户看到动画效果
    setTimeout(() => {
      let url = ''
      switch (this.data.selectedRole) {
        case 'elder':
          url = '/pages/health/profile/profile'
          break
        case 'volunteer':
          url = '/pages/time-bank/record/record'
          break
        case 'admin':
          url = '/pages/admin/service-manage/service-manage'
          break
        case 'government':
          url = '/pages/admin/data-board/data-board'
          break
        case 'csr':
          url = '/pages/care/adoption/adoption'
          break
        default:
          url = '/pages/health/profile/profile'
      }

      // 检查目标页面是否是tabBar页面，使用合适的跳转方式
      const tabBarPages = [
        '/pages/index/index',
        '/pages/health/profile/profile',
        '/pages/time-bank/record/record',
        '/pages/life-circle/convenience/convenience',
        '/pages/user/profile/profile'
      ]
      
      if (tabBarPages.includes(url)) {
        // 使用switchTab跳转到tabBar页面，确保tabBar显示
        wx.switchTab({
          url: url,
          success: () => {
            console.log('switchTab跳转成功:', url)
          },
          fail: (err) => {
            console.error('switchTab跳转失败:', err)
            wx.navigateTo({ url: url })
          }
        })
      } else {
        // 非tabBar页面使用navigateTo
        wx.navigateTo({ url: url })
      }
    }, 300)
  },
  
  // 轮播图点击事件
  swiperItemTap(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({ url })
  },
  
  // 轮播图切换事件
  onSwiperChange(e) {
    this.setData({
      currentSwiperIndex: e.detail.current
    })
  },
  
  // 上一张幻灯片
  prevSlide() {
    if (this.data.currentSwiperIndex > 0) {
      this.setData({
        currentSwiperIndex: this.data.currentSwiperIndex - 1
      })
    } else {
      // 如果是第一张，则切换到最后一张
      this.setData({
        currentSwiperIndex: this.data.swiperList.length - 1
      })
    }
  },
  
  // 下一张幻灯片
  nextSlide() {
    if (this.data.currentSwiperIndex < this.data.swiperList.length - 1) {
      this.setData({
        currentSwiperIndex: this.data.currentSwiperIndex + 1
      })
    } else {
      // 如果是最后一张，则切换到第一张
      this.setData({
        currentSwiperIndex: 0
      })
    }
  },
  
  // 快捷入口点击事件
  quickEntranceTap(e) {
    const url = e.currentTarget.dataset.url
    
    // 检查用户是否已登录，如果未登录则提示需要登录
    const app = getApp()
    if (!app.globalData.isLoggedIn) {
      console.log('用户未登录，快捷入口功能受限')
      wx.showModal({
        title: '需要登录',
        content: '使用此功能需要登录，是否现在登录？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/login/login'
            })
          }
        }
      })
      return
    }
    
    wx.navigateTo({ url })
  },
  
  // 语音导航
  voiceNav() {
    wx.showToast({
      title: '语音导航功能开发中',
      icon: 'none'
    })
  },

  // 页面点击事件（用于双击检测）
  onPageTap(e) {
    const currentTime = Date.now()
    const lastTapTime = this.data.lastTapTime || 0
    const tapInterval = currentTime - lastTapTime
    
    console.log('页面点击事件触发', {
      currentTime,
      lastTapTime,
      tapInterval,
      selectedRole: this.data.selectedRole
    })
    
    // 双击间隔小于500ms
    if (tapInterval < 500 && tapInterval > 0) {
      console.log('双击事件触发，执行角色跳转')
      this.enterRole()
    }
    
    this.setData({
      lastTapTime: currentTime
    })
  }
})
