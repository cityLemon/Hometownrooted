// pages/auth/register/register.js
const app = getApp();

Page({
  data: {
    selectedRole: '',
    username: '',
    realName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    genderIndex: -1,
    age: '',
    address: '',
    showPassword: false,
    showConfirmPassword: false,
    genderOptions: ['男', '女', '保密'],
    agreementChecked: false,
    isLoading: false
  },

  onLoad() {
    // 页面加载时的初始化
  },

  // 角色选择
  selectRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({
      selectedRole: role
    });
  },

  // 输入事件处理
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value.trim()
    });
  },

  onRealNameInput(e) {
    this.setData({
      realName: e.detail.value.trim()
    });
  },

  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value.trim()
    });
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  onGenderChange(e) {
    this.setData({
      genderIndex: parseInt(e.detail.value)
    });
  },

  onAgeInput(e) {
    this.setData({
      age: e.detail.value
    });
  },

  onAddressInput(e) {
    this.setData({
      address: e.detail.value.trim()
    });
  },

  // 密码显示切换
  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  toggleConfirmPassword() {
    this.setData({
      showConfirmPassword: !this.data.showConfirmPassword
    });
  },

  // 协议相关
  onAgreementChange(e) {
    this.setData({
      agreementChecked: e.detail.value.length > 0
    });
  },

  showServiceAgreement() {
    wx.showModal({
      title: '服务协议',
      content: '这里是服务协议的详细内容...',
      showCancel: false
    });
  },

  showPrivacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '这里是隐私政策的详细内容...',
      showCancel: false
    });
  },

  // 返回登录
  onLogin() {
    wx.navigateBack();
  },

  // 表单验证
  validateForm() {
    const { 
      selectedRole, username, realName, phone, 
      password, confirmPassword, genderIndex, age, address 
    } = this.data;

    if (!selectedRole) {
      wx.showToast({
        title: '请选择角色',
        icon: 'none'
      });
      return false;
    }

    if (!username || username.length < 3) {
      wx.showToast({
        title: '用户名至少3位',
        icon: 'none'
      });
      return false;
    }

    if (!realName) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      });
      return false;
    }

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return false;
    }

    if (!password || password.length < 6) {
      wx.showToast({
        title: '密码至少6位',
        icon: 'none'
      });
      return false;
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return false;
    }

    if (genderIndex === -1) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      });
      return false;
    }

    if (!age || age < 1 || age > 120) {
      wx.showToast({
        title: '请输入正确的年龄',
        icon: 'none'
      });
      return false;
    }

    if (!address) {
      wx.showToast({
        title: '请输入地址',
        icon: 'none'
      });
      return false;
    }

    return true;
  },

  // 注册提交
  async onRegister() {
    if (!this.validateForm()) {
      return;
    }

    if (!this.data.agreementChecked) {
      wx.showToast({
        title: '请同意服务协议和隐私政策',
        icon: 'none'
      });
      return;
    }

    this.setData({ isLoading: true });

    try {
      const result = await this.registerRequest();
      
      if (result.success) {
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1500
        });

        // 注册成功后自动登录
        setTimeout(() => {
          this.autoLoginAfterRegister();
        }, 1500);
      } else {
        wx.showToast({
          title: result.message || '注册失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('注册错误:', error);
      wx.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 注册请求
  registerRequest() {
    const { 
      selectedRole, username, realName, phone, 
      password, genderIndex, age, address 
    } = this.data;

    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://localhost:3000/api/auth/register',
        method: 'POST',
        data: {
          username: username,
          password: password,
          phone: phone,
          roleCode: selectedRole,
          realName: realName,
          gender: this.data.genderOptions[genderIndex],
          age: parseInt(age),
          address: address
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject(new Error('注册请求失败'));
          }
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  },

  // 注册后自动登录
  async autoLoginAfterRegister() {
    const { username, password } = this.data;
    
    try {
      const result = await new Promise((resolve, reject) => {
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
              reject(new Error('自动登录失败'));
            }
          },
          fail: (error) => {
            reject(error);
          }
        });
      });

      if (result.success) {
        // 保存登录状态
        wx.setStorageSync('token', result.data.token);
        wx.setStorageSync('userInfo', result.data.userInfo);
        app.globalData.userInfo = result.data.userInfo;
        app.globalData.isLoggedIn = true;

        // 跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    } catch (error) {
      console.error('自动登录失败:', error);
      // 如果自动登录失败，返回登录页面
      wx.navigateBack();
    }
  }
});