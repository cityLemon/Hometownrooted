# 乡村安土 - JavaWeb后端项目

## 项目简介

乡村安土（Hometownrooted）是一个基于JavaWeb技术栈的后端服务项目，为微信小程序提供完整的后端API支持，包括用户认证、任务管理、时间银行等功能。

## 技术栈

- **Java**: 1.8
- **Servlet**: 4.0
- **数据库**: MySQL 8.0
- **Web服务器**: Tomcat 9.x
- **构建工具**: Maven
- **JSON处理**: Jackson 2.15.2

## 项目结构

```
javaweb-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/hometownrooted/
│   │   │       ├── entity/          # 实体类
│   │   │       │   ├── User.java
│   │   │       │   ├── Task.java
│   │   │       │   ├── TimeBankRecord.java
│   │   │       │   └── HealthProfile.java
│   │   │       ├── dao/             # 数据访问层
│   │   │       │   ├── UserDAO.java
│   │   │       │   ├── TaskDAO.java
│   │   │       │   └── TimeBankRecordDAO.java
│   │   │       ├── servlet/         # 控制器层
│   │   │       │   ├── AuthServlet.java
│   │   │       │   ├── TaskServlet.java
│   │   │       │   ├── TimeBankServlet.java
│   │   │       │   └── CORSFilter.java
│   │   │       └── util/           # 工具类
│   │   │           ├── DBUtil.java
│   │   │           └── JsonUtil.java
│   │   ├── resources/
│   │   │   └── schema.sql         # 数据库脚本
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   └── web.xml        # Web配置文件
│   │       ├── static/             # 静态资源
│   │       │   └── images/
│   │       │       ├── tabbar/
│   │       │       ├── banner/
│   │       │       ├── roles/
│   │       │       ├── entrances/
│   │       │       └── avatar/
│   │       └── index.html          # 后端首页
├── lib/                           # 依赖库
└── pom.xml                        # Maven配置文件
```

## 数据库配置

### 数据库信息

- **数据库名**: hometownrooted
- **端口**: 3306
- **用户名**: root
- **密码**: root

### 初始化数据库

1. 启动小皮面板（phpStudy）
2. 打开MySQL数据库管理
3. 执行SQL脚本：`src/main/resources/schema.sql`

或者在命令行中执行：

```bash
mysql -u root -p < src/main/resources/schema.sql
```

## 依赖库

项目需要以下依赖库，请将以下JAR文件放入 `lib/` 目录：

1. **servlet-api.jar** - Servlet API
2. **mysql-connector-java.jar** - MySQL JDBC驱动
3. **jackson-databind.jar** - Jackson JSON处理
4. **jackson-core.jar** - Jackson核心
5. **jackson-annotations.jar** - Jackson注解

### Maven依赖（推荐）

如果使用Maven构建，依赖已配置在 `pom.xml` 中：

```xml
<dependencies>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.33</version>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.15.2</version>
    </dependency>
</dependencies>
```

## 部署步骤

### 方法1：使用IntelliJ IDEA（推荐）

1. **打开项目**
   - 启动IntelliJ IDEA
   - File -> Open
   - 选择 `javaweb-backend` 文件夹

2. **配置Tomcat**
   - Run -> Edit Configurations
   - 点击 + 号 -> Tomcat Server -> Local
   - 配置Tomcat安装目录
   - Deployment标签页 -> + -> Artifact
   - 选择 `hometownrooted:war exploded`
   - 设置Application context为 `/`

3. **启动服务**
   - 点击运行按钮（绿色三角形）
   - 访问 http://localhost:8080

### 方法2：手动部署到Tomcat

1. **编译项目**
   ```bash
   cd javaweb-backend
   mvn clean package
   ```

2. **部署WAR文件**
   - 将 `target/hometownrooted.war` 复制到Tomcat的 `webapps` 目录
   - 启动Tomcat

3. **访问服务**
   - http://localhost:8080/hometownrooted

## API接口文档

### 认证接口

#### 1. 用户登录
- **URL**: `POST /api/auth/login`
- **参数**:
  - `username`: 用户名
  - `password`: 密码
- **返回**:
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
      "token": "token_1_1234567890",
      "userInfo": {
        "id": 1,
        "username": "elder_demo",
        "role_name": "老人",
        "phone": "13800138001",
        "gender": "男",
        "age": 65,
        "address": "北京市朝阳区",
        "avatar": "/static/images/avatar/elder.jpg"
      }
    }
  }
  ```

#### 2. 用户注册
- **URL**: `POST /api/auth/register`
- **参数**:
  - `username`: 用户名（至少3位）
  - `password`: 密码（至少6位）
  - `role_name`: 角色名称
  - `phone`: 手机号（可选）
  - `gender`: 性别（可选）
  - `age`: 年龄（可选）
  - `address`: 地址（可选）
- **返回**:
  ```json
  {
    "success": true,
    "message": "注册成功",
    "data": {
      "token": "token_2_1234567890",
      "userInfo": {
        "id": 2,
        "username": "volunteer_demo",
        "role_name": "志愿者",
        ...
      }
    }
  }
  ```

### 任务管理接口

#### 1. 获取任务列表
- **URL**: `GET /api/tasks/list`
- **参数**:
  - `status`: 任务状态（可选，如：open、assigned、completed）
- **返回**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "publisherId": 1,
        "title": "帮助老人买菜",
        "description": "需要帮忙购买一些蔬菜和水果",
        "taskType": "生活服务",
        "reward": 10.0,
        "location": "北京市朝阳区",
        "deadline": "2026-01-10 18:00:00",
        "status": "open",
        "volunteerId": null,
        "createdAt": "2026-01-05 10:00:00"
      }
    ]
  }
  ```

#### 2. 创建任务
- **URL**: `POST /api/tasks/create`
- **参数**:
  - `publisher_id`: 发布者ID
  - `title`: 任务标题
  - `description`: 任务描述
  - `task_type`: 任务类型
  - `reward`: 奖励（时间币）
  - `location`: 任务地点
  - `deadline`: 截止时间
- **返回**:
  ```json
  {
    "success": true,
    "message": "任务发布成功",
    "data": { ... }
  }
  ```

#### 3. 认领任务
- **URL**: `POST /api/tasks/{id}/accept`
- **参数**:
  - `volunteer_id`: 志愿者ID
- **返回**:
  ```json
  {
    "success": true,
    "message": "任务认领成功",
    "data": { ... }
  }
  ```

#### 4. 完成任务
- **URL**: `POST /api/tasks/{id}/complete`
- **返回**:
  ```json
  {
    "success": true,
    "message": "任务完成成功",
    "data": { ... }
  }
  ```

### 时间银行接口

#### 1. 获取余额
- **URL**: `GET /api/timebank/balance?user_id={id}`
- **返回**:
  ```json
  {
    "success": true,
    "data": 100.00
  }
  ```

#### 2. 获取记录
- **URL**: `GET /api/timebank/records?user_id={id}`
- **返回**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "userId": 1,
        "taskId": 1,
        "type": "earn",
        "amount": 10.00,
        "description": "完成任务：帮助老人买菜",
        "balance": 100.00,
        "createdAt": "2026-01-05 10:00:00"
      }
    ]
  }
  ```

## 前端对接

前端代码已修改为对接Java后端：

- **API基础URL**: `http://localhost:8080`
- **登录接口**: `/api/auth/login`
- **注册接口**: `/api/auth/register`

### 修改配置

如需修改后端地址，请修改以下文件：

1. `app.js` - 修改 `validateToken` 方法中的URL
2. `pages/auth/login/login.js` - 修改 `loginRequest` 方法中的URL
3. `pages/auth/register/register.js` - 修改 `registerRequest` 方法中的URL

## 测试账号

系统已预置测试账号：

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| elder_demo | 123456 | 老人 | 老人体验账号 |
| volunteer_demo | 123456 | 志愿者 | 志愿者体验账号 |
| admin_demo | 123456 | 管理员 | 管理员体验账号 |

**注意**: 测试账号的密码需要在数据库中使用BCrypt加密。当前实现使用明文密码，生产环境请使用BCrypt加密。

## 常见问题

### 1. 数据库连接失败

**问题**: `java.sql.SQLException: Access denied for user 'root'@'localhost'`

**解决**:
- 检查MySQL用户名和密码是否正确
- 确认MySQL服务是否启动
- 修改 `DBUtil.java` 中的数据库连接信息

### 2. 端口被占用

**问题**: `java.net.BindException: Address already in use`

**解决**:
- 检查8080端口是否被占用
- 修改Tomcat端口配置
- 或关闭占用8080端口的程序

### 3. CORS跨域问题

**问题**: 前端无法访问后端API

**解决**:
- 确认 `CORSFilter.java` 已正确配置
- 检查浏览器控制台的错误信息
- 确认后端服务正常运行

### 4. 图片无法访问

**问题**: 静态资源（图片）无法访问

**解决**:
- 确认图片已复制到 `src/main/webapp/static/images/` 目录
- 检查图片路径是否正确
- 确认Tomcat的静态资源配置

## 开发建议

1. **使用IDEA开发**
   - IDEA对JavaWeb项目支持最好
   - 可以直接运行和调试
   - 支持热部署

2. **数据库管理**
   - 使用Navicat或phpMyAdmin管理数据库
   - 定期备份数据库
   - 使用事务保证数据一致性

3. **日志记录**
   - 添加日志框架（如Log4j）
   - 记录关键操作和错误
   - 便于问题排查

4. **安全性**
   - 使用BCrypt加密密码
   - 添加JWT Token验证
   - 防止SQL注入
   - 添加输入验证

## 后续优化

- [ ] 添加JWT Token认证
- [ ] 实现密码BCrypt加密
- [ ] 添加日志框架
- [ ] 实现文件上传功能
- [ ] 添加Redis缓存
- [ ] 实现分页查询
- [ ] 添加单元测试
- [ ] 优化数据库查询性能

## 联系方式

如有问题，请联系开发团队。

## 许可证

本项目仅供学习和研究使用。
