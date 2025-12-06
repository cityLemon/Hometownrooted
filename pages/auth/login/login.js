// pages/auth/login/login.js
const app = getApp();

Page({
  data: {
    username: '',
    password: '',
    showPassword: false,
    rememberMe: false,
    isLoading: false
  },

  onLoad() {
    // 检查是否记住用户名
    const rememberedUsername = wx.getStorageSync('rememberedUsername');
    if (rememberedUsername) {
      this.setData({
        username: rememberedUsername,
        rememberMe: true
      });
    }
  },

  onUsernameInput(e) {
    this.setData({
      username: e.detail.value.trim()
    });
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  onRememberChange(e) {
    this.setData({
      rememberMe: e.detail.value.length > 0
    });
  },

  onForgotPassword() {
    wx.showToast({
      title: '请联系管理员重置密码',
      icon: 'none'
    });
  },

  onRegister() {
    wx.navigateTo({
      url: '/pages/auth/register/register'
    });
  },

  async onLogin() {
    const { username, password, rememberMe } = this.data;
    
    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
      return;
    }

    if (username.length < 3 || password.length < 6) {
      wx.showToast({
        title: '用户名至少3位，密码至少6位',
        icon: 'none'
      });
      return;
    }

    this.setData({ isLoading: true });

    try {
      // 调用登录API
      const result = await this.loginRequest(username, password);
      
      if (result.success) {
        // 保存登录状态
        wx.setStorageSync('token', result.data.token);
        wx.setStorageSync('userInfo', result.data.userInfo);
        app.globalData.userInfo = result.data.userInfo;
        app.globalData.isLoggedIn = true;

        // 处理记住用户名
        if (rememberMe) {
          wx.setStorageSync('rememberedUsername', username);
        } else {
          wx.removeStorageSync('rememberedUsername');
        }

        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        });

        // 跳转到首页，并隐藏登录页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      } else {
        wx.showToast({
          title: result.message || '登录失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('登录错误:', error);
      wx.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 登录请求
  loginRequest(username, password) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://localhost:3000/api/auth/login',
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
  },

  // 快速登录（体验账号）
  async quickLogin(e) {
    const role = e.currentTarget.dataset.role;
    let username = '';
    let password = '123456';

    switch (role) {
      case 'elder':
        username = 'test_elder';
        break;
      case 'volunteer':
        username = 'test_volunteer';
        break;
      case 'admin':
        username = 'admin';
        password = 'admin123';
        break;
    }

    this.setData({ username, password });
    
    // 自动执行登录
    setTimeout(() => {
      this.onLogin();
    }, 500);
  }
});