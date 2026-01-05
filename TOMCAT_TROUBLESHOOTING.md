# Tomcat部署问题排查步骤

## 问题现象
访问以下URL返回404错误：
- http://localhost:8080/hometownrooted_backend_war_exploded/api/health
- http://localhost:8080/hometownrooted_backend_war_exploded/api/database/status

## 解决步骤

### 步骤1：清理Tomcat工作目录
1. 停止Tomcat服务器
2. 找到Tomcat工作目录，通常在：
   - IDEA配置的工作目录：`C:\Users\City\AppData\Local\JetBrains\IntelliJIdea2024.3\tomcat\511a6178-7a89-4074-b518-6c1f0349c743\work`
   - 或者Tomcat安装目录：`apache-tomcat-8.5.97\work`
3. 删除整个work文件夹
4. 删除Tomcat的temp文件夹（如果存在）

### 步骤2：清理项目并重新构建
1. 在IDEA中：
   - 点击 `Build` → `Clean Project`
   - 点击 `Build` → `Rebuild Project`
2. 或者在Maven工具窗口中：
   - 点击 `Clean`
   - 点击 `Install`

### 步骤3：删除旧的部署文件
1. 找到Tomcat的webapps目录
2. 删除 `hometownrooted` 文件夹（如果存在）
3. 删除 `hometownrooted_backend_war_exploded` 文件夹（如果存在）

### 步骤4：重新部署并启动
1. 在IDEA中重新配置Tomcat运行配置
2. 确保Deployment标签页中有正确的artifact：
   - `hometownrooted:war exploded`
3. 点击运行按钮启动Tomcat

### 步骤5：验证部署
启动后，在浏览器中访问以下URL测试：

1. 测试健康检查：
   ```
   http://localhost:8080/hometownrooted_backend_war_exploded/api/health
   ```
   预期返回：
   ```json
   {
     "success": true,
     "message": "Backend is running"
   }
   ```

2. 测试数据库状态：
   ```
   http://localhost:8080/hometownrooted_backend_war_exploded/api/database/status
   ```
   预期返回：
   ```json
   {
     "success": true,
     "data": {
       "status": "connected",
       "databaseType": "MySQL",
       "databaseName": "hometownrooted",
       "databaseVersion": "8.0.xx"
     }
   }
   ```

### 步骤6：检查Tomcat日志
如果还是404，查看Tomcat日志文件：
- `catalina.out` 或 `catalina.log`
- `localhost.log`

查找以下信息：
- Servlet加载错误
- Context启动错误
- ClassNotFoundException

## 常见问题

### 问题1：ClassNotFoundException
**原因**：类文件没有正确编译或部署
**解决**：执行步骤2（重新构建项目）

### 问题2：Context启动失败
**原因**：web.xml配置错误或依赖缺失
**解决**：检查Tomcat控制台输出

### 问题3：URL路径错误
**原因**：上下文路径不正确
**解决**：
1. 在IDEA中，点击右上角的运行配置下拉菜单
2. 选择 `Edit Configurations...`
3. 找到Tomcat配置
4. 检查 `Deployment` 标签页
5. 确认 `Application context` 是 `/hometownrooted_backend_war_exploded`

## 临时解决方案

如果上述步骤都无法解决问题，可以尝试：

### 方案A：修改前端URL
修改 `app.js` 中的baseUrl，尝试不同的上下文路径：

```javascript
// 尝试1（当前）
baseUrl: 'http://localhost:8080/hometownrooted_backend_war_exploded'

// 尝试2
baseUrl: 'http://localhost:8080/hometownrooted'

// 尝试3
baseUrl: 'http://localhost:8080'
```

### 方案B：使用注解配置
如果web.xml配置有问题，可以改用@WebServlet注解：

1. 恢复HealthServlet和DatabaseStatusServlet中的@WebServlet注解
2. 删除web.xml中对应的servlet配置
3. 重新构建和部署

## 验证Servlet类是否已编译

检查以下文件是否存在：
```
C:\Users\City\Desktop\content\javaweb-backend\target\hometownrooted\WEB-INF\classes\com\hometownrooted\servlet\HealthServlet.class
C:\Users\City\Desktop\content\javaweb-backend\target\hometownrooted\WEB-INF\classes\com\hometownrooted\servlet\DatabaseStatusServlet.class
```

如果这些.class文件不存在，说明编译有问题。
