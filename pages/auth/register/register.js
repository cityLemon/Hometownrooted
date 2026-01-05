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
    isLoading: false,
    // 表单验证状态
    validation: {
      username: { valid: true, message: '' },
      phone: { valid: true, message: '' },
      password: { valid: true, message: '' },
      confirmPassword: { valid: true, message: '' },
      age: { valid: true, message: '' }
    },
    // 实时验证状态
    isFormValid: false,
    // 密码强度
    passwordStrength: 0, // 0-4
    passwordStrengthText: '',
    passwordStrengthColor: ''
  },

  onLoad() {
    // 页面加载时的初始化
  },

  // 检查密码强度
  checkPasswordStrength(password) {
    if (!password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    let patterns = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // 计算分数
    Object.values(patterns).forEach(match => {
      if (match) score++;
    });
    
    // 额外加分
    if (password.length >= 12) score++;
    if (patterns.length && patterns.lowercase && patterns.uppercase && patterns.numbers && patterns.special) score++;
    
    const strengthLevels = [
      { score: 0, text: '太短', color: '#ff4757' },
      { score: 1, text: '弱', color: '#ff4757' },
      { score: 2, text: '一般', color: '#ffa502' },
      { score: 3, text: '良好', color: '#2ed573' },
      { score: 4, text: '强', color: '#26de81' },
      { score: 5, text: '很强', color: '#20bf6b' }
    ];
    
    return strengthLevels[Math.min(score, 5)];
  },

  // 检查表单整体有效性
  checkFormValidity() {
    const { 
      selectedRole, username, realName, phone, 
      password, confirmPassword, genderIndex, age, address,
      validation
    } = this.data;
    
    const isFormValid = selectedRole && 
                       username && validation.username.valid &&
                       realName &&
                       phone && validation.phone.valid &&
                       password && validation.password.valid &&
                       confirmPassword && validation.confirmPassword.valid &&
                       genderIndex !== -1 &&
                       age && validation.age.valid &&
                       address &&
                       this.data.agreementChecked;
    
    this.setData({ isFormValid });
  },

  // 角色选择
  selectRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({
      selectedRole: role
    });
    this.checkFormValidity();
  },

  // 输入事件处理
  onUsernameInput(e) {
    const username = e.detail.value.trim();
    const validation = { ...this.data.validation };
    
    if (username.length < 3) {
      validation.username = { valid: false, message: '用户名至少需要3个字符' };
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      validation.username = { valid: false, message: '用户名只能包含字母、数字和下划线' };
    } else {
      validation.username = { valid: true, message: '' };
    }
    
    this.setData({
      username: username,
      validation: validation
    });
    
    this.checkFormValidity();
  },

  onRealNameInput(e) {
    this.setData({
      realName: e.detail.value.trim()
    });
  },

  onPhoneInput(e) {
    const phone = e.detail.value.trim();
    const validation = { ...this.data.validation };
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      validation.phone = { valid: false, message: '请输入正确的手机号' };
    } else {
      validation.phone = { valid: true, message: '' };
    }
    
    this.setData({
      phone: phone,
      validation: validation
    });
    
    this.checkFormValidity();
  },

  onPasswordInput(e) {
    const password = e.detail.value;
    const validation = { ...this.data.validation };
    
    // 密码强度检查
    const strength = this.checkPasswordStrength(password);
    
    if (password.length < 6) {
      validation.password = { valid: false, message: '密码至少需要6个字符' };
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password)) {
      validation.password = { valid: false, message: '密码必须包含字母和数字' };
    } else {
      validation.password = { valid: true, message: '' };
    }
    
    // 检查确认密码
    if (this.data.confirmPassword) {
      if (password !== this.data.confirmPassword) {
        validation.confirmPassword = { valid: false, message: '两次密码输入不一致' };
      } else {
        validation.confirmPassword = { valid: true, message: '' };
      }
    }
    
    this.setData({
      password: password,
      validation: validation,
      passwordStrength: strength.score,
      passwordStrengthText: strength.text,
      passwordStrengthColor: strength.color
    });
    
    this.checkFormValidity();
  },

  onConfirmPasswordInput(e) {
    const confirmPassword = e.detail.value;
    const validation = { ...this.data.validation };
    
    if (confirmPassword !== this.data.password) {
      validation.confirmPassword = { valid: false, message: '两次密码输入不一致' };
    } else {
      validation.confirmPassword = { valid: true, message: '' };
    }
    
    this.setData({
      confirmPassword: confirmPassword,
      validation: validation
    });
    
    this.checkFormValidity();
  },

  onGenderChange(e) {
    this.setData({
      genderIndex: parseInt(e.detail.value)
    });
  },

  onAgeInput(e) {
    const age = e.detail.value;
    const validation = { ...this.data.validation };
    
    if (!age || age < 1 || age > 120) {
      validation.age = { valid: false, message: '请输入正确的年龄(1-120)' };
    } else {
      validation.age = { valid: true, message: '' };
    }
    
    this.setData({
      age: age,
      validation: validation
    });
    
    this.checkFormValidity();
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
    this.checkFormValidity();
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

  // 注册提交
  async onRegister() {
    const { 
      selectedRole, username, realName, phone, 
      password, confirmPassword, genderIndex, age, address
    } = this.data;

    // 客户端验证
    if (!selectedRole) {
      wx.showToast({ title: '请选择角色', icon: 'none' });
      return;
    }

    if (!username || !realName || !phone || !password || !confirmPassword || !age || !address) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    if (password !== confirmPassword) {
      wx.showToast({ title: '两次密码输入不一致', icon: 'none' });
      return;
    }

    if (genderIndex === -1) {
      wx.showToast({ title: '请选择性别', icon: 'none' });
      return;
    }

    if (!this.data.agreementChecked) {
      wx.showToast({ title: '请先同意服务协议', icon: 'none' });
      return;
    }

    this.setData({ isLoading: true });

    try {
      // 调用注册API
      const result = await this.registerRequest();
      
      if (result.success) {
        // 注册成功
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1500
        });
        
        setTimeout(() => {
          this.setData({ isLoading: false });
          wx.navigateTo({
            url: '/pages/auth/login/login'
          });
        }, 1500);
      } else {
        // 注册失败
        const errorMessage = this.getRegisterErrorMessage(result.message);
        wx.showToast({
          title: errorMessage,
          icon: 'none'
        });
        this.setData({ isLoading: false });
      }
    } catch (error) {
      console.error('注册错误:', error);
      wx.showToast({
        title: '网络连接失败，请检查网络后重试',
        icon: 'none'
      });
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
      const url = app.globalData.baseUrl + '/api/auth/register'
      console.log('注册请求URL:', url)
      
      wx.request({
        url: url,
        method: 'POST',
        data: {
          role: selectedRole,
          username: username,
          realName: realName,
          phone: phone,
          password: password,
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

  // 获取注册错误消息
  getRegisterErrorMessage(message) {
    if (!message) return '注册失败，请重试';
    
    const errorMap = {
      'USERNAME_EXISTS': '用户名已存在',
      'PHONE_EXISTS': '手机号已被注册',
      'INVALID_PHONE': '手机号格式不正确',
      'WEAK_PASSWORD': '密码强度不够',
      'INVALID_AGE': '年龄格式不正确',
      'INVALID_ROLE': '角色选择错误'
    };
    
    return errorMap[message] || message || '注册失败，请重试';
  }
});