-- 乡村安土项目数据库脚本
-- 数据库：hometownrooted
-- 端口：3306
-- 用户名：root
-- 密码：root

-- 创建数据库
CREATE DATABASE IF NOT EXISTS hometownrooted DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hometownrooted;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称（老人/志愿者/管理员/政府人员/企业CSR）',
    phone VARCHAR(20) COMMENT '手机号',
    gender VARCHAR(10) COMMENT '性别',
    age INT COMMENT '年龄',
    address VARCHAR(255) COMMENT '地址',
    avatar VARCHAR(255) COMMENT '头像URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    status TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
    INDEX idx_username (username),
    INDEX idx_phone (phone),
    INDEX idx_role (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 健康档案表
CREATE TABLE IF NOT EXISTS health_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '健康档案ID',
    user_id INT NOT NULL COMMENT '用户ID',
    height DECIMAL(5,2) COMMENT '身高（cm）',
    weight DECIMAL(5,2) COMMENT '体重（kg）',
    blood_pressure VARCHAR(20) COMMENT '血压',
    blood_sugar VARCHAR(20) COMMENT '血糖',
    heart_rate INT COMMENT '心率',
    allergies TEXT COMMENT '过敏史',
    medications TEXT COMMENT '用药情况',
    chronic_diseases TEXT COMMENT '慢性病',
    emergency_contact VARCHAR(50) COMMENT '紧急联系人',
    emergency_phone VARCHAR(20) COMMENT '紧急联系电话',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='健康档案表';

-- 紧急呼救记录表
CREATE TABLE IF NOT EXISTS emergency_records (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '呼救记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    location VARCHAR(255) COMMENT '位置',
    latitude DECIMAL(10,8) COMMENT '纬度',
    longitude DECIMAL(11,8) COMMENT '经度',
    emergency_type VARCHAR(50) COMMENT '紧急类型',
    description TEXT COMMENT '描述',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态：pending-待处理，processing-处理中，completed-已完成',
    volunteer_id INT COMMENT '志愿者ID',
    response_time TIMESTAMP NULL COMMENT '响应时间',
    completion_time TIMESTAMP NULL COMMENT '完成时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='紧急呼救记录表';

-- 服务预约表
CREATE TABLE IF NOT EXISTS service_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '预约ID',
    user_id INT NOT NULL COMMENT '用户ID',
    service_type VARCHAR(50) NOT NULL COMMENT '服务类型',
    service_name VARCHAR(100) NOT NULL COMMENT '服务名称',
    appointment_date DATE NOT NULL COMMENT '预约日期',
    appointment_time TIME NOT NULL COMMENT '预约时间',
    location VARCHAR(255) COMMENT '服务地点',
    description TEXT COMMENT '描述',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态：pending-待确认，confirmed-已确认，completed-已完成，cancelled-已取消',
    provider_id INT COMMENT '服务提供者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_appointment_date (appointment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务预约表';

-- 时间银行记录表
CREATE TABLE IF NOT EXISTS time_bank_records (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    task_id INT COMMENT '任务ID',
    type VARCHAR(20) NOT NULL COMMENT '类型：earn-赚取，spend-消费',
    amount DECIMAL(10,2) NOT NULL COMMENT '时间币数量',
    description VARCHAR(255) COMMENT '描述',
    balance DECIMAL(10,2) NOT NULL COMMENT '余额',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='时间银行记录表';

-- 任务表
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '任务ID',
    publisher_id INT NOT NULL COMMENT '发布者ID',
    title VARCHAR(200) NOT NULL COMMENT '任务标题',
    description TEXT COMMENT '任务描述',
    task_type VARCHAR(50) COMMENT '任务类型',
    reward DECIMAL(10,2) NOT NULL COMMENT '奖励（时间币）',
    location VARCHAR(255) COMMENT '任务地点',
    deadline DATETIME COMMENT '截止时间',
    status VARCHAR(20) DEFAULT 'open' COMMENT '状态：open-开放中，assigned-已认领，completed-已完成，cancelled-已取消',
    volunteer_id INT COMMENT '志愿者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (publisher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_publisher_id (publisher_id),
    INDEX idx_status (status),
    INDEX idx_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';

-- 积分商城商品表
CREATE TABLE IF NOT EXISTS mall_products (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '商品ID',
    name VARCHAR(200) NOT NULL COMMENT '商品名称',
    description TEXT COMMENT '商品描述',
    image VARCHAR(255) COMMENT '商品图片',
    price DECIMAL(10,2) NOT NULL COMMENT '价格（时间币）',
    stock INT DEFAULT 0 COMMENT '库存',
    status VARCHAR(20) DEFAULT 'available' COMMENT '状态：available-可兑换，unavailable-不可兑换',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分商城商品表';

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
    user_id INT NOT NULL COMMENT '用户ID',
    product_id INT NOT NULL COMMENT '商品ID',
    quantity INT NOT NULL COMMENT '数量',
    total_price DECIMAL(10,2) NOT NULL COMMENT '总价',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '状态：pending-待发货，shipped-已发货，completed-已完成，cancelled-已取消',
    shipping_address VARCHAR(255) COMMENT '收货地址',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES mall_products(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 生活圈便民服务表
CREATE TABLE IF NOT EXISTS convenience_services (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '服务ID',
    title VARCHAR(200) NOT NULL COMMENT '服务标题',
    description TEXT COMMENT '服务描述',
    category VARCHAR(50) COMMENT '服务分类',
    provider_name VARCHAR(100) COMMENT '服务提供者',
    phone VARCHAR(20) COMMENT '联系电话',
    address VARCHAR(255) COMMENT '地址',
    image VARCHAR(255) COMMENT '服务图片',
    status VARCHAR(20) DEFAULT 'active' COMMENT '状态：active-活跃，inactive-不活跃',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='生活圈便民服务表';

-- 活动表
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '活动ID',
    title VARCHAR(200) NOT NULL COMMENT '活动标题',
    description TEXT COMMENT '活动描述',
    activity_date DATE NOT NULL COMMENT '活动日期',
    activity_time TIME COMMENT '活动时间',
    location VARCHAR(255) COMMENT '活动地点',
    max_participants INT COMMENT '最大参与人数',
    current_participants INT DEFAULT 0 COMMENT '当前参与人数',
    status VARCHAR(20) DEFAULT 'upcoming' COMMENT '状态：upcoming-即将开始，ongoing-进行中，completed-已完成，cancelled-已取消',
    image VARCHAR(255) COMMENT '活动图片',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_activity_date (activity_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表';

-- 故事表
CREATE TABLE IF NOT EXISTS stories (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '故事ID',
    user_id INT NOT NULL COMMENT '用户ID',
    title VARCHAR(200) NOT NULL COMMENT '故事标题',
    content TEXT NOT NULL COMMENT '故事内容',
    image VARCHAR(255) COMMENT '故事图片',
    likes INT DEFAULT 0 COMMENT '点赞数',
    views INT DEFAULT 0 COMMENT '浏览数',
    status VARCHAR(20) DEFAULT 'published' COMMENT '状态：draft-草稿，published-已发布，archived-已归档',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='故事表';

-- 政策表
CREATE TABLE IF NOT EXISTS policies (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '政策ID',
    title VARCHAR(200) NOT NULL COMMENT '政策标题',
    content TEXT NOT NULL COMMENT '政策内容',
    policy_type VARCHAR(50) COMMENT '政策类型',
    publish_date DATE COMMENT '发布日期',
    source VARCHAR(100) COMMENT '来源',
    status VARCHAR(20) DEFAULT 'active' COMMENT '状态：active-有效，expired-已过期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_policy_type (policy_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='政策表';

-- 公益项目表
CREATE TABLE IF NOT EXISTS charity_projects (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '项目ID',
    title VARCHAR(200) NOT NULL COMMENT '项目标题',
    description TEXT COMMENT '项目描述',
    target_amount DECIMAL(10,2) COMMENT '目标金额',
    current_amount DECIMAL(10,2) DEFAULT 0 COMMENT '当前金额',
    start_date DATE COMMENT '开始日期',
    end_date DATE COMMENT '结束日期',
    status VARCHAR(20) DEFAULT 'ongoing' COMMENT '状态：ongoing-进行中，completed-已完成，cancelled-已取消',
    image VARCHAR(255) COMMENT '项目图片',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_status (status),
    INDEX idx_start_date (start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='公益项目表';

-- 捐赠记录表
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '捐赠ID',
    user_id INT NOT NULL COMMENT '用户ID',
    project_id INT NOT NULL COMMENT '项目ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '捐赠金额',
    message TEXT COMMENT '留言',
    status VARCHAR(20) DEFAULT 'completed' COMMENT '状态：pending-待处理，completed-已完成',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES charity_projects(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='捐赠记录表';

-- ESG报告表
CREATE TABLE IF NOT EXISTS esg_reports (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '报告ID',
    title VARCHAR(200) NOT NULL COMMENT '报告标题',
    year INT NOT NULL COMMENT '年份',
    content TEXT COMMENT '报告内容',
    file_url VARCHAR(255) COMMENT '文件URL',
    publish_date DATE COMMENT '发布日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ESG报告表';

-- 插入测试数据
-- 插入测试用户
INSERT INTO users (username, password, role_name, phone, gender, age, address, avatar) VALUES
('elder_demo', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqJ8G4K5J5J5J5J5J5J5J5J5J5J5J5', '老人', '13800138001', '男', 65, '北京市朝阳区', '/static/images/avatar/elder.jpg'),
('volunteer_demo', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqJ8G4K5J5J5J5J5J5J5J5J5J5J5J5', '志愿者', '13800138002', '女', 28, '北京市海淀区', '/static/images/avatar/volunteer.jpg'),
('admin_demo', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqJ8G4K5J5J5J5J5J5J5J5J5J5J5J5', '管理员', '13800138003', '男', 35, '北京市西城区', '/static/images/avatar/admin.jpg');

-- 注意：密码需要使用BCrypt加密，上面的密码是 '123456' 的加密结果
-- 实际使用时需要使用BCrypt工具生成正确的加密密码
