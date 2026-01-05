// pages/auth/login/login.js
const app = getApp();

Page({
  data: {
    username: '',
    password: '',
    showPassword: false,
    rememberMe: false,
    rememberPassword: false,
    isLoading: false,
    // 输入验证状态
    validation: {
      username: { valid: true, message: '' },
      password: { valid: true, message: '' }
    },
    // 登录错误信息
    loginError: '',
    // 快速登录选项
    quickLoginOptions: [
      { name: '老人体验', username: 'elder_demo', password: '123456', role: '老人' },
      { name: '志愿者体验', username: 'volunteer_demo', password: '123456', role: '志愿者' },
      { name: '管理员体验', username: 'admin_demo', password: '123456', role: '管理员' }
    ]
  },

  onLoad() {
    // 页面加载时读取记住的信息
    const rememberedUsername = wx.getStorageSync('rememberedUsername');
    const rememberedPassword = wx.getStorageSync('rememberedPassword');
    const rememberPasswordFlag = wx.getStorageSync('rememberPasswordFlag');
    
    if (rememberedUsername) {
      this.setData({
        username: rememberedUsername,
        rememberMe: true
      });
    }
    
    if (rememberedPassword && rememberPasswordFlag) {
      this.setData({
        password: rememberedPassword,
        rememberPassword: true
      });
    }
  },

  // 处理登录成功
  handleLoginSuccess(data) {
    const { token, userInfo } = data;
    const { username, rememberMe, rememberPassword, password } = this.data;
    
    // 保存登录状态
    wx.setStorageSync('token', token);
    wx.setStorageSync('userInfo', userInfo);
    
    // 更新全局数据
    app.globalData.userInfo = userInfo;
    app.globalData.isLoggedIn = true;
    
    // 处理记住用户名
    if (rememberMe) {
      wx.setStorageSync('rememberedUsername', username);
    } else {
      wx.removeStorageSync('rememberedUsername');
    }
    
    // 处理记住密码
    if (rememberPassword) {
      wx.setStorageSync('rememberedPassword', password);
      wx.setStorageSync('rememberPasswordFlag', true);
    } else {
      wx.removeStorageSync('rememberedPassword');
      wx.removeStorageSync('rememberPasswordFlag');
    }
    
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500
    });
    
    setTimeout(() => {
      this.setData({ isLoading: false });
      wx.switchTab({
        url: '/pages/index/index'
      });
    }, 1500);
  },

  // 获取登录错误消息
  getLoginErrorMessage(message) {
    if (!message) return '登录失败，请重试';
    
    const errorMap = {
      'USER_NOT_FOUND': '用户名不存在',
      'INVALID_PASSWORD': '密码错误',
      'USER_DISABLED': '账号已被禁用，请联系客服',
      'INVALID_ROLE': '角色权限错误',
      'ACCOUNT_LOCKED': '账号已被锁定，请稍后再试'
    };
    
    return errorMap[message] || message || '登录失败，请重试';
  },

  onRegister() {
    wx.navigateTo({
      url: '/pages/auth/register/register'
    });
  },

  onUsernameInput(e) {
    const username = e.detail.value.trim();
    const validation = { ...this.data.validation };
    
    if (!username) {
      validation.username = { valid: false, message: '请输入用户名' };
    } else {
      validation.username = { valid: true, message: '' };
    }
    
    this.setData({ 
      username: username,
      validation: validation,
      loginError: ''
    });
  },

  onPasswordInput(e) {
    const password = e.detail.value;
    const validation = { ...this.data.validation };
    
    if (!password) {
      validation.password = { valid: false, message: '请输入密码' };
    } else {
      validation.password = { valid: true, message: '' };
    }
    
    this.setData({ 
      password: password,
      validation: validation,
      loginError: ''
    });
  },

  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  onRememberChange(e) {
    const values = e.detail.value;
    const rememberMe = values.includes('remember');
    const rememberPassword = values.includes('rememberPassword');
    
    this.setData({ 
      rememberMe,
      rememberPassword 
    });
    
    if (!rememberMe && !rememberPassword) {
      // 如果都不记住，清除所有存储
      wx.removeStorageSync('rememberedUsername');
      wx.removeStorageSync('rememberedPassword');
      wx.removeStorageSync('rememberPasswordFlag');
    } else if (!rememberMe && rememberPassword) {
      // 如果只记住密码，也要记住用户名
      this.setData({ rememberMe: true });
    }
  },

  onForgotPassword() {
    wx.showToast({
      title: '请联系管理员重置密码',
      icon: 'none'
    });
  },

  // 快速登录
  quickLogin(e) {
    const role = e.currentTarget.dataset.role;
    const option = this.data.quickLoginOptions.find(opt => opt.role === role);
    
    if (option) {
      this.setData({
        username: option.username,
        password: option.password,
        validation: {
          username: { valid: true, message: '' },
          password: { valid: true, message: '' }
        },
        loginError: ''
      });
      
      // 自动登录
      setTimeout(() => {
        this.onLogin();
      }, 300);
    }
  },

  async onLogin() {
    const { username, password, rememberMe } = this.data;
    
    // 客户端验证
    if (!username || !password) {
      this.setData({ 
        loginError: '请输入用户名和密码',
        'validation.username.valid': !username ? false : true,
        'validation.password.valid': !password ? false : true
      });
      return;
    }

    if (username.length < 3 || password.length < 6) {
      this.setData({ 
        loginError: '用户名至少3位，密码至少6位',
        'validation.username.valid': username.length < 3 ? false : true,
        'validation.password.valid': password.length < 6 ? false : true
      });
      return;
    }

    this.setData({ 
      isLoading: true,
      loginError: ''
    });

    try {
      // 调用登录API
      const result = await this.loginRequest(username, password);
      
      if (result.success) {
        // 登录成功
        this.handleLoginSuccess(result.data);
      } else {
        // 登录失败
        const errorMessage = this.getLoginErrorMessage(result.message);
        this.setData({ 
          loginError: errorMessage,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('登录错误:', error);
      this.setData({ 
        loginError: '网络连接失败，请检查网络后重试',
        isLoading: false
      });
    }
  },

  // 登录请求
  loginRequest(username, password) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://localhost:8080/api/auth/login',
        method: 'POST',
        data: {
          username: username,
          password: password
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject(new Error('登录请求失败'));
          }
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
});