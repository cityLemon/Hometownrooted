// index.js
Page({
  data: {
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
    // 按钮动画
    buttonAnimation: '',
    // 页面加载动画状态
    pageLoaded: false,
    // 轮播图数据
    swiperList: [
      {
        id: 1,
        image: '/images/banner/banner1.svg',
        title: '乡村安土，守护您的健康',
        url: '/pages/health/profile/profile'
      },
      {
        id: 2,
        image: '/images/banner/banner2.svg',
        title: '银龄互助，时间银行',
        url: '/pages/time-bank/record/record'
      },
      {
        id: 3,
        image: '/images/banner/banner3.svg',
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
    ]
  },
  
  onLoad() {
    console.log('Index page loaded')
    // 检查登录状态
    this.checkLoginStatus()
  },
  
  onReady() {
    console.log('Index page ready')
    // 页面加载完成后执行动画
    this.initPageAnimations()
  },

  // 初始化页面动画
  initPageAnimations() {
    // 创建页面加载动画
    const animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease-out',
      delay: 0
    })

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
      // 初始化按钮动画
      this.initButtonAnimation()
    })
  },

  // 初始化按钮动画
  initButtonAnimation() {
    const buttonAnimation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease-out',
      delay: 1000
    })

    buttonAnimation.opacity(1).translateY(0).step()
    
    this.setData({
      buttonAnimation: buttonAnimation.export()
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
    })
  },
  
  // 检查登录状态
  checkLoginStatus() {
    // 模拟检查登录状态
    const isLogin = wx.getStorageSync('isLogin')
    if (!isLogin) {
      // 未登录，跳转到登录页面
      // wx.navigateTo({ url: '/pages/login/login' })
    }
  },
  
  // 选择角色
  selectRole(e) {
    const roleId = e.currentTarget.dataset.roleId
    const roleIndex = e.currentTarget.dataset.index
    
    // 如果点击的是已选中的角色，则取消选中
    if (this.data.selectedRole === roleId) {
      // 取消选中动画
      const unselectAnimation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      unselectAnimation.scale(1).opacity(1).step()
      
      const updatedRoles = this.data.roles.map((role, index) => {
        if (index === roleIndex) {
          role.animation = unselectAnimation.export()
        }
        return role
      })
      
      this.setData({
        selectedRole: null,
        roles: updatedRoles
      })
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

    this.setData({
      selectedRole: roleId,
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
    
    // 根据角色跳转到相应页面
    switch (this.data.selectedRole) {
      case 'elder':
        wx.switchTab({ url: '/pages/health/profile/profile' })
        break
      case 'volunteer':
        wx.switchTab({ url: '/pages/time-bank/record/record' })
        break
      case 'admin':
        wx.navigateTo({ url: '/pages/admin/service-manage/service-manage' })
        break
      case 'government':
        wx.navigateTo({ url: '/pages/admin/data-board/data-board' })
        break
      case 'csr':
        wx.navigateTo({ url: '/pages/care/adoption/adoption' })
        break
      default:
        wx.showToast({
          title: '角色不存在',
          icon: 'none'
        })
    }
  },
  
  // 轮播图点击事件
  swiperItemTap(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({ url })
  },
  
  // 快捷入口点击事件
  quickEntranceTap(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({ url })
  },
  
  // 语音导航
  voiceNav() {
    wx.showToast({
      title: '语音导航功能开发中',
      icon: 'none'
    })
  }
})
