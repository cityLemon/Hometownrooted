# TabBar图标更换和Element UI Radio组件实现

## 已完成的工作

### 1. TabBar图标配置更新

**文件**：`app.json`

**更新内容**：
- ✅ 将选中颜色从 `#2D64F0` 改为 Element UI 的蓝色 `#409EFF`
- ✅ 修正图标文件扩展名：`.svg` → `.png`（微信小程序只支持PNG格式）
- ✅ 保留5个tabBar项目：首页、健康守护、时间银行、生活圈、我的

**图标文件**：
```
images/tabbar/home.png              # 首页（未选中）
images/tabbar/home-active.png        # 首页（选中）
images/tabbar/health.png            # 健康守护（未选中）
images/tabbar/health-active.png      # 健康守护（选中）
images/tabbar/time.png              # 时间银行（未选中）
images/tabbar/time-active.png        # 时间银行（选中）
images/tabbar/life.png              # 生活圈（未选中）
images/tabbar/life-active.png        # 生活圈（选中）
images/tabbar/user.png              # 我的（未选中）
images/tabbar/user-active.png        # 我的（选中）
```

### 2. Element UI Radio组件实现

**创建的文件**：

#### 2.1 role-selection.html
**路径**：`javaweb-backend/src/main/webapp/role-selection.html`

**功能**：
- ✅ 使用 Element UI 的 `<el-radio>` 和 `<el-radio-group>` 组件
- ✅ 5个角色选项：老人、志愿者、管理员、政府人员、企业CSR
- ✅ 每个角色包含图标、名称和描述
- ✅ 带边框样式的单选框
- ✅ 确认和重置按钮
- ✅ 渐变背景和现代化UI设计

**技术栈**：
- Vue.js 2.6.14
- Element UI（从CDN引入）
- 响应式设计

#### 2.2 RoleSelectionServlet.java
**路径**：`javaweb-backend/src/main/java/com/hometownrooted/servlet/RoleSelectionServlet.java`

**功能**：
- ✅ GET请求：转发到 role-selection.html 页面
- ✅ POST请求：处理角色选择提交，返回JSON响应

#### 2.3 web.xml配置
**路径**：`javaweb-backend/src/main/webapp/WEB-INF/web.xml`

**新增配置**：
```xml
<servlet>
    <servlet-name>RoleSelectionServlet</servlet-name>
    <servlet-class>com.hometownrooted.servlet.RoleSelectionServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>RoleSelectionServlet</servlet-name>
    <url-pattern>/role-selection</url-pattern>
</servlet-mapping>
```

## 访问方式

### 小程序TabBar
小程序底部导航栏会显示5个tab：
1. 首页
2. 健康守护
3. 时间银行
4. 生活圈
5. 我的

### 后端角色选择页面
在浏览器中访问：
```
http://localhost:8080/hometownrooted_backend_war_exploded/role-selection
```

**页面效果**：
- 渐变紫色背景
- 白色卡片容器
- 5个带边框的单选框
- 每个选项包含emoji图标、角色名称和描述
- 确认和重置按钮

## Element UI Radio组件特性

### 基础用法
```html
<el-radio v-model="radio" label="1">备选项</el-radio>
<el-radio v-model="radio" label="2">备选项</el-radio>
```

### 禁用状态
```html
<el-radio disabled>备选项</el-radio>
```

### 单选框组
```html
<el-radio-group v-model="radio">
    <el-radio label="1">备选项1</el-radio>
    <el-radio label="2">备选项2</el-radio>
    <el-radio label="3">备选项3</el-radio>
</el-radio-group>
```

### 按钮样式
```html
<el-radio-group v-model="radio">
    <el-radio-button label="上海">上海</el-radio-button>
    <el-radio-button label="北京">北京</el-radio-button>
    <el-radio-button label="广州">广州</el-radio-button>
    <el-radio-button label="深圳">深圳</el-radio-button>
</el-radio-group>
```

### 带边框
```html
<el-radio v-model="radio" label="1" border>备选项1</el-radio>
<el-radio v-model="radio" label="2" border>备选项2</el-radio>
```

## 角色数据结构

```javascript
roles: [
    {
        value: 'elder',
        name: '老人',
        description: '健康管理、一键呼救、服务预约',
        icon: '👴'
    },
    {
        value: 'volunteer',
        name: '志愿者',
        description: '任务认领、服务记录、积分兑换',
        icon: '🤝'
    },
    {
        value: 'admin',
        name: '管理员',
        description: '服务管理、用户管理、数据看板',
        icon: '👨‍💼'
    },
    {
        value: 'government',
        name: '政府人员',
        description: '政策发布、项目监管、数据统计',
        icon: '🏛️'
    },
    {
        value: 'csr',
        name: '企业CSR',
        description: '爱心认领、公益项目、ESG报告',
        icon: '🏢'
    }
]
```

## API接口

### GET /role-selection
返回角色选择HTML页面

### POST /role-selection
**请求参数**：
- `role`: 选中的角色值（elder/volunteer/admin/government/csr）

**响应示例**：
```json
{
  "success": true,
  "message": "角色选择成功",
  "role": "elder"
}
```

## 部署步骤

1. **停止Tomcat服务器**
2. **重新构建项目**：
   - 在IDEA中：`Build` → `Rebuild Project`
3. **启动Tomcat服务器**
4. **访问角色选择页面**：
   ```
   http://localhost:8080/hometownrooted_backend_war_exploded/role-selection
   ```

## 设计说明

### 颜色方案
- 主色：`#409EFF`（Element UI蓝色）
- 未选中：`#8898AA`（灰色）
- 背景：渐变紫色 `#667eea` → `#764ba2`
- 文字：`#303133`（深灰）

### 交互效果
- 鼠标悬停：边框变蓝，背景变浅蓝
- 选中状态：边框变蓝，背景变浅蓝
- 按钮点击：显示成功/提示消息

## 注意事项

1. **图标格式**：微信小程序只支持PNG格式，不支持SVG
2. **图标尺寸**：推荐81px × 81px，最大40kb
3. **CDN依赖**：Element UI从unpkg.com引入，需要网络连接
4. **Vue版本**：使用Vue 2.x，与Element UI兼容

## 后续优化建议

1. **图标设计**：根据Element UI风格设计新的PNG图标
2. **响应式**：优化移动端显示效果
3. **国际化**：添加多语言支持
4. **主题定制**：支持自定义主题颜色
5. **动画效果**：添加更流畅的过渡动画
