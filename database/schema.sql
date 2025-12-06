-- 乡村安土微信小程序数据库结构
-- 数据库: rural_community
-- 字符集: utf8mb4
-- 排序规则: utf8mb4_unicode_ci

-- 创建数据库
CREATE DATABASE IF NOT EXISTS rural_community 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE rural_community;

-- 用户角色表
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    role_code VARCHAR(20) NOT NULL UNIQUE COMMENT '角色代码',
    description TEXT COMMENT '角色描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色表';

-- 插入角色数据
INSERT INTO roles (role_name, role_code, description) VALUES
('老人', 'elder', '老年用户，需要健康监护和生活服务'),
('志愿者', 'volunteer', '社区志愿者，提供互助服务'),
('管理员', 'admin', '系统管理员，管理用户和服务'),
('政府人员', 'government', '政府工作人员，监督和管理'),
('企业CSR', 'csr', '企业社会责任人员，提供支持');

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    role_id INT NOT NULL COMMENT '角色ID',
    real_name VARCHAR(50) COMMENT '真实姓名',
    gender ENUM('男', '女', '保密') DEFAULT '保密' COMMENT '性别',
    age INT COMMENT '年龄',
    address TEXT COMMENT '地址',
    avatar VARCHAR(255) COMMENT '头像URL',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active' COMMENT '用户状态',
    last_login TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_username (username),
    INDEX idx_phone (phone),
    INDEX idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 家庭成员表
CREATE TABLE IF NOT EXISTS family_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    member_name VARCHAR(50) NOT NULL COMMENT '成员姓名',
    relationship VARCHAR(20) NOT NULL COMMENT '关系（如：配偶、子女、父母）',
    phone VARCHAR(20) COMMENT '联系电话',
    age INT COMMENT '年龄',
    gender ENUM('男', '女') COMMENT '性别',
    is_emergency_contact BOOLEAN DEFAULT FALSE COMMENT '是否为紧急联系人',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家庭成员表';

-- 用户会话表
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    session_token VARCHAR(255) NOT NULL UNIQUE COMMENT '会话令牌',
    expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户会话表';

-- 健康数据表
CREATE TABLE IF NOT EXISTS health_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    blood_pressure_high INT COMMENT '收缩压',
    blood_pressure_low INT COMMENT '舒张压',
    heart_rate INT COMMENT '心率',
    blood_sugar DECIMAL(5,2) COMMENT '血糖',
    weight DECIMAL(5,2) COMMENT '体重',
    temperature DECIMAL(4,1) COMMENT '体温',
    measurement_date DATE NOT NULL COMMENT '测量日期',
    measurement_time TIME NOT NULL COMMENT '测量时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_measurement_date (measurement_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='健康数据表';

-- 服务预约表
CREATE TABLE IF NOT EXISTS service_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    service_name VARCHAR(100) NOT NULL COMMENT '服务名称',
    service_category VARCHAR(50) NOT NULL COMMENT '服务分类',
    booking_date DATE NOT NULL COMMENT '预约日期',
    booking_time TIME NOT NULL COMMENT '预约时间',
    provider_name VARCHAR(100) COMMENT '服务提供者',
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending' COMMENT '预约状态',
    price DECIMAL(10,2) COMMENT '服务价格',
    notes TEXT COMMENT '备注信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务预约表';

-- 紧急联系人表
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    contact_name VARCHAR(50) NOT NULL COMMENT '联系人姓名',
    relationship VARCHAR(20) NOT NULL COMMENT '关系',
    phone VARCHAR(20) NOT NULL COMMENT '联系电话',
    priority INT DEFAULT 1 COMMENT '优先级（1最高）',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='紧急联系人表';

-- 创建默认管理员用户（密码：admin123）
INSERT INTO users (username, password, phone, role_id, real_name, gender, age, address, status) 
VALUES ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '13800138000', 3, '系统管理员', '男', 30, '系统管理员地址', 'active');

-- 创建测试老人用户（密码：123456）
INSERT INTO users (username, password, phone, role_id, real_name, gender, age, address, status) 
VALUES ('test_elder', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '13900139000', 1, '张大爷', '男', 68, '北京市朝阳区某某街道', 'active');

-- 创建测试志愿者用户（密码：123456）
INSERT INTO users (username, password, phone, role_id, real_name, gender, age, address, status) 
VALUES ('test_volunteer', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '13700137000', 2, '李志愿者', '女', 25, '北京市海淀区某某街道', 'active');

-- 添加一些测试数据
INSERT INTO family_members (user_id, member_name, relationship, phone, age, gender, is_emergency_contact) VALUES
(2, '张小明', '儿子', '13600136000', 35, '男', TRUE),
(2, '张小红', '女儿', '13500135000', 32, '女', TRUE);

INSERT INTO emergency_contacts (user_id, contact_name, relationship, phone, priority) VALUES
(2, '张小明', '儿子', '13600136000', 1),
(2, '张小红', '女儿', '13500135000', 2),
(2, '乡村医疗站', '医疗站', '010-12345678', 3);

INSERT INTO health_data (user_id, blood_pressure_high, blood_pressure_low, heart_rate, blood_sugar, weight, temperature, measurement_date, measurement_time) VALUES
(2, 140, 90, 78, 6.2, 70.5, 36.5, CURDATE(), '08:30:00'),
(2, 135, 85, 75, 5.8, 70.2, 36.3, CURDATE(), '20:30:00');

INSERT INTO service_bookings (user_id, service_name, service_category, booking_date, booking_time, provider_name, status, price) VALUES
(2, '血压测量服务', '医疗', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '社区卫生服务中心', 'confirmed', 50.00),
(2, '居家清洁服务', '生活', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '家政服务公司', 'pending', 120.00);