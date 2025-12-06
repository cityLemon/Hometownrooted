// backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 数据库配置
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'rural_community',
  charset: 'utf8mb4'
};

// JWT密钥
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// 数据库连接池
let pool;

async function initDatabase() {
  try {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // 测试连接
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
    
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
}

// 认证中间件
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: '未提供认证令牌' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 验证用户是否存在
    const [users] = await pool.execute(
      'SELECT u.*, r.role_code FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ? AND u.status = "active"',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: '用户不存在或已被禁用' });
    }
    
    req.user = users[0];
    next();
  } catch (error) {
    console.error('认证错误:', error);
    res.status(401).json({ success: false, message: '认证失败' });
  }
};

// 登录接口
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名和密码不能为空' 
      });
    }
    
    // 查询用户
    const [users] = await pool.execute(
      'SELECT u.*, r.role_code FROM users u JOIN roles r ON u.role_id = r.id WHERE u.username = ? OR u.phone = ?',
      [username, username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }
    
    const user = users[0];
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }
    
    // 检查用户状态
    if (user.status !== 'active') {
      return res.status(401).json({ 
        success: false, 
        message: '账号已被禁用' 
      });
    }
    
    // 更新最后登录时间
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );
    
    // 生成JWT令牌
    const token = jwt.sign(
      { userId: user.id, role: user.role_code },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // 返回用户信息（不包含密码）
    const userInfo = {
      id: user.id,
      username: user.username,
      phone: user.phone,
      realName: user.real_name,
      gender: user.gender,
      age: user.age,
      address: user.address,
      avatar: user.avatar,
      roleCode: user.role_code,
      roleName: user.role_name
    };
    
    res.json({
      success: true,
      message: '登录成功',
      data: {
        token: token,
        userInfo: userInfo
      }
    });
    
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 注册接口
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, phone, roleCode, realName, gender, age, address } = req.body;
    
    // 验证必填字段
    if (!username || !password || !phone || !roleCode || !realName) {
      return res.status(400).json({ 
        success: false, 
        message: '请填写所有必填字段' 
      });
    }
    
    // 验证用户名长度
    if (username.length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名至少需要3个字符' 
      });
    }
    
    // 验证密码长度
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: '密码至少需要6个字符' 
      });
    }
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: '请输入正确的手机号' 
      });
    }
    
    // 验证年龄
    if (age && (age < 1 || age > 120)) {
      return res.status(400).json({ 
        success: false, 
        message: '请输入正确的年龄' 
      });
    }
    
    // 查询角色ID
    const [roles] = await pool.execute(
      'SELECT id FROM roles WHERE role_code = ?',
      [roleCode]
    );
    
    if (roles.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '无效的角色类型' 
      });
    }
    
    const roleId = roles[0].id;
    
    // 检查用户名是否已存在
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名已存在' 
      });
    }
    
    // 检查手机号是否已存在
    const [existingPhones] = await pool.execute(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    );
    
    if (existingPhones.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: '手机号已注册' 
      });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 插入新用户
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, phone, role_id, real_name, gender, age, address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "active")',
      [username, hashedPassword, phone, roleId, realName, gender || '保密', age || null, address || null]
    );
    
    res.json({
      success: true,
      message: '注册成功',
      data: {
        userId: result.insertId
      }
    });
    
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 获取用户信息
app.get('/api/user/info', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        userInfo: req.user
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 修改密码
app.post('/api/user/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: '请提供旧密码和新密码' 
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: '新密码至少需要6个字符' 
      });
    }
    
    // 验证旧密码
    const [users] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: '用户不存在' 
      });
    }
    
    const isOldPasswordValid = await bcrypt.compare(oldPassword, users[0].password);
    
    if (!isOldPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: '旧密码错误' 
      });
    }
    
    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // 更新密码
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, req.user.id]
    );
    
    res.json({
      success: true,
      message: '密码修改成功'
    });
    
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 健康数据相关接口
app.get('/api/health/data', authMiddleware, async (req, res) => {
  try {
    const [healthData] = await pool.execute(
      'SELECT * FROM health_data WHERE user_id = ? ORDER BY measurement_date DESC, measurement_time DESC LIMIT 10',
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: {
        healthData: healthData
      }
    });
  } catch (error) {
    console.error('获取健康数据错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

app.post('/api/health/data', authMiddleware, async (req, res) => {
  try {
    const { bloodPressureHigh, bloodPressureLow, heartRate, bloodSugar, weight, temperature, measurementDate, measurementTime } = req.body;
    
    await pool.execute(
      'INSERT INTO health_data (user_id, blood_pressure_high, blood_pressure_low, heart_rate, blood_sugar, weight, temperature, measurement_date, measurement_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, bloodPressureHigh, bloodPressureLow, heartRate, bloodSugar, weight, temperature, measurementDate, measurementTime]
    );
    
    res.json({
      success: true,
      message: '健康数据添加成功'
    });
  } catch (error) {
    console.error('添加健康数据错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 服务预约相关接口
app.get('/api/service/bookings', authMiddleware, async (req, res) => {
  try {
    const [bookings] = await pool.execute(
      'SELECT * FROM service_bookings WHERE user_id = ? ORDER BY booking_date DESC, booking_time DESC',
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: {
        bookings: bookings
      }
    });
  } catch (error) {
    console.error('获取服务预约错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

app.post('/api/service/bookings', authMiddleware, async (req, res) => {
  try {
    const { serviceName, serviceCategory, bookingDate, bookingTime, providerName, price } = req.body;
    
    await pool.execute(
      'INSERT INTO service_bookings (user_id, service_name, service_category, booking_date, booking_time, provider_name, status, price) VALUES (?, ?, ?, ?, ?, ?, "pending", ?)',
      [req.user.id, serviceName, serviceCategory, bookingDate, bookingTime, providerName, price]
    );
    
    res.json({
      success: true,
      message: '服务预约成功'
    });
  } catch (error) {
    console.error('添加服务预约错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 紧急联系人相关接口
app.get('/api/emergency/contacts', authMiddleware, async (req, res) => {
  try {
    const [contacts] = await pool.execute(
      'SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY priority ASC',
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: {
        contacts: contacts
      }
    });
  } catch (error) {
    console.error('获取紧急联系人错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;

async function startServer() {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`API地址: http://localhost:${PORT}/api`);
  });
}

startServer();