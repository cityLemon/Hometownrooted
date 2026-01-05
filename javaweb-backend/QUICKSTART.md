# 快速启动指南

## 第一步：启动MySQL数据库

1. 打开小皮面板（phpStudy）
2. 点击"MySQL" -> "启动"
3. 确认MySQL服务运行在端口3306

## 第二步：创建数据库

1. 打开小皮面板的"数据库"管理工具
2. 或使用Navicat/phpMyAdmin连接到MySQL
3. 执行SQL脚本：`javaweb-backend/src/main/resources/schema.sql`

或者在命令行中执行：

```bash
# 连接到MySQL
mysql -u root -p

# 输入密码：root

# 执行SQL脚本
source c:/Users/City/Desktop/content/javaweb-backend/src/main/resources/schema.sql
```

## 第三步：使用IntelliJ IDEA打开项目

1. 启动IntelliJ IDEA
2. File -> Open
3. 选择文件夹：`c:\Users\City\Desktop\content\javaweb-backend`
4. 等待IDEA加载项目

## 第四步：配置Tomcat

1. 在IDEA中，点击右上角的"Add Configuration..."
2. 点击 + 号 -> Tomcat Server -> Local
3. 配置Tomcat：
   - Name: Hometownrooted
   - Configure... -> 选择Tomcat安装目录
   - HTTP port: 8080
4. 切换到"Deployment"标签页
5. 点击 + 号 -> Artifact
6. 选择 `hometownrooted:war exploded`
7. Application context: 设置为 `/`
8. 点击"OK"

## 第五步：启动Tomcat

1. 点击IDEA右上角的绿色运行按钮（▶）
2. 等待Tomcat启动完成
3. 在浏览器中访问：http://localhost:8080
4. 应该能看到"乡村安土 - 后端服务"页面

## 第六步：测试API

### 1. 测试用户注册

使用Postman或curl测试：

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -d "username=testuser" \
  -d "password=123456" \
  -d "role_name=志愿者" \
  -d "phone=13800138000" \
  -d "gender=男" \
  -d "age=25" \
  -d "address=北京市朝阳区"
```

### 2. 测试用户登录

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -d "username=testuser" \
  -d "password=123456"
```

### 3. 测试获取任务列表

```bash
curl http://localhost:8080/api/tasks/list
```

## 第七步：启动微信小程序

1. 打开微信开发者工具
2. 导入项目：`c:\Users\City\Desktop\content`
3. 点击"编译"按钮
4. 在小程序中测试登录和注册功能

## 常见问题解决

### 问题1：Tomcat启动失败

**错误信息**: `java.net.BindException: Address already in use: 8080`

**解决方法**:
1. 检查8080端口是否被占用
2. 修改Tomcat端口为8081或其他端口
3. 或关闭占用8080端口的程序

### 问题2：数据库连接失败

**错误信息**: `java.sql.SQLException: Access denied for user 'root'@'localhost'`

**解决方法**:
1. 确认MySQL用户名和密码是否为 root/root
2. 检查MySQL服务是否启动
3. 修改 `DBUtil.java` 中的数据库连接信息

### 问题3：找不到依赖库

**错误信息**: `java.lang.ClassNotFoundException: com.mysql.cj.jdbc.Driver`

**解决方法**:
1. 下载MySQL JDBC驱动：https://dev.mysql.com/downloads/connector/j/
2. 将 `mysql-connector-java-8.0.33.jar` 放入 `lib/` 目录
3. 在IDEA中右键jar文件 -> Add to Library

### 问题4：前端无法连接后端

**错误信息**: `request:fail`

**解决方法**:
1. 确认Tomcat已启动
2. 检查后端URL是否正确：http://localhost:8080
3. 在微信开发者工具中，点击"详情" -> "本地设置" -> 勾选"不校验合法域名"

## 项目结构说明

```
javaweb-backend/
├── src/main/java/com/hometownrooted/
│   ├── entity/          # 实体类（User, Task等）
│   ├── dao/             # 数据访问层
│   ├── servlet/         # 控制器（AuthServlet, TaskServlet等）
│   └── util/           # 工具类（DBUtil, JsonUtil）
├── src/main/resources/
│   └── schema.sql      # 数据库初始化脚本
├── src/main/webapp/
│   ├── WEB-INF/
│   │   └── web.xml    # Web配置
│   ├── static/         # 静态资源（图片）
│   └── index.html      # 后端首页
└── pom.xml            # Maven配置文件
```

## 下一步

1. 完善其他功能模块（健康档案、紧急呼救等）
2. 添加密码加密（BCrypt）
3. 实现JWT Token认证
4. 添加日志记录
5. 优化数据库查询性能

祝您开发顺利！
