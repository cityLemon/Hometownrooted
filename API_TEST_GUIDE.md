# 快速测试脚本

## 在浏览器中测试API

### 1. 测试健康检查
在浏览器地址栏输入：
```
http://localhost:8080/hometownrooted_backend_war_exploded/api/health
```

**预期结果**：
```json
{
  "success": true,
  "message": "Backend is running"
}
```

**如果返回404**：
- 检查Tomcat是否正在运行
- 检查上下文路径是否正确
- 查看Tomcat控制台日志

### 2. 测试数据库状态
在浏览器地址栏输入：
```
http://localhost:8080/hometownrooted_backend_war_exploded/api/database/status
```

**预期结果**：
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

### 3. 测试其他API
```
http://localhost:8080/hometownrooted_backend_war_exploded/api/auth/login
http://localhost:8080/hometownrooted_backend_war_exploded/api/auth/register
```

这些应该返回405（Method Not Allowed），因为它们需要POST请求。

## 如果所有API都返回404

### 可能原因1：上下文路径错误
尝试以下URL：
```
http://localhost:8080/hometownrooted/api/health
http://localhost:8080/api/health
```

### 可能原因2：Servlet未部署
1. 在IDEA中，点击 `View` → `Tool Windows` → `Terminal`
2. 运行以下命令：
```bash
cd target/hometownrooted/WEB-INF/classes/com/hometownrooted/servlet
dir
```

检查是否存在以下文件：
- HealthServlet.class
- DatabaseStatusServlet.class

如果不存在，需要重新编译项目。

### 可能原因3：web.xml未生效
1. 检查web.xml是否在正确的位置：
   ```
   target/hometownrooted/WEB-INF/web.xml
   ```
2. 检查web.xml内容是否包含HealthServlet和DatabaseStatusServlet的配置

## 查看Tomcat控制台输出

启动Tomcat后，查看控制台输出，查找以下信息：

### 正常启动应该看到：
```
INFO: Deploying web application archive [.../hometownrooted_backend_war_exploded]
INFO: Mapping servlet: [AuthServlet] to [/api/auth/*]
INFO: Mapping servlet: [HealthServlet] to [/api/health]
INFO: Mapping servlet: [DatabaseStatusServlet] to [/api/database/status]
```

### 如果看到错误：
```
SEVERE: Error configuring application listener of class [...]
SEVERE: Skipped installing application listeners due to previous error(s)
```

这表示有配置错误或依赖缺失。

## 最简单的解决方案

如果上述方法都不行，尝试以下步骤：

1. **完全停止Tomcat**
2. **删除所有部署的文件夹**：
   - 删除 `apache-tomcat-8.5.97\webapps\hometownrooted`
   - 删除 `apache-tomcat-8.5.97\webapps\hometownrooted_backend_war_exploded`
3. **清理项目**：
   - 在IDEA中：`Build` → `Clean Project`
4. **重新构建**：
   - 在IDEA中：`Build` → `Rebuild Project`
5. **重新配置Tomcat**：
   - `Run` → `Edit Configurations...`
   - 删除现有的Tomcat配置
   - 重新添加Tomcat配置
   - 在`Deployment`标签页添加`hometownrooted:war exploded`
6. **启动Tomcat**

## 检查数据库连接

确保MySQL服务正在运行：
1. 打开命令提示符
2. 运行：
```bash
mysql -u root -p
```
3. 输入密码后，运行：
```sql
SHOW DATABASES;
USE hometownrooted;
SHOW TABLES;
```

确保数据库和表都存在。
