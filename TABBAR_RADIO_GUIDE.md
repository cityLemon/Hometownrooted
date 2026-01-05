# TabBar图标更换和Element UI Radio组件集成

## 已完成的工作

### 1. TabBar图标更换

已将所有tabBar图标从PNG格式更换为SVG格式，更加清晰和美观。

**图标列表：**
- 🏠 首页：`home.svg` / `home-active.svg`
- 💊 健康守护：`health.svg` / `health-active.svg`
- ⏰ 时间银行：`timebank.svg` / `timebank-active.svg`
- 🌐 生活圈：`lifecircle.svg` / `lifecircle-active.svg`
- 👤 我的：`profile.svg` / `profile-active.svg`

**图标特点：**
- ✅ SVG格式，支持任意缩放不失真
- ✅ 未选中状态使用灰色（#8898AA）
- ✅ 选中状态使用主题色（#2D64F0）
- ✅ 简洁的线条风格，符合现代UI设计

### 2. Element UI Radio组件集成

已在Java后端实现Element UI的Radio单选框组件展示。

**访问地址：**
```
http://localhost:8080/hometownrooted_backend_war_exploded/demo/radio
```

**组件示例包括：**
1. **基础用法** - 简单的单选框
2. **禁用状态** - 不可用的单选框
3. **单选框组** - 多个互斥选项的组合
4. **按钮样式** - 按钮形式的单选组合
5. **带边框** - 带有边框的单选框组

## 使用说明

### 查看新的TabBar图标

1. 在微信开发者工具中刷新小程序
2. 底部导航栏会显示新的SVG图标
3. 点击不同tab查看图标切换效果

### 访问Element UI Radio演示

1. 确保Tomcat服务器正在运行
2. 在浏览器中打开：
   ```
   http://localhost:8080/hometownrooted_backend_war_exploded/demo/radio
   ```
3. 您将看到Element UI的Radio组件示例

### Element UI Radio组件参数说明

#### Radio Attributes（属性）
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|---------|
| value / v-model | 绑定值 | string / number / boolean | — |
| label | Radio 的 value | string / number / boolean | — |
| disabled | 是否禁用 | boolean | — | false |
| border | 是否显示边框 | boolean | — | false |
| size | Radio 的尺寸 | string | medium / small / mini | — |
| name | 原生 name 属性 | string | — | — |

#### Radio-group Attributes（属性）
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|---------|
| value / v-model | 绑定值 | string / number / boolean | — |
| size | 单选框组尺寸 | string | medium / small / mini | — |
| disabled | 是否禁用 | boolean | — | false |
| text-color | 按钮形式的 Radio 激活时的文本颜色 | string | — | #ffffff |
| fill | 按钮形式的 Radio 激活时的填充色和边框色 | string | — | #409EFF |

#### Radio Events（事件）
| 事件名称 | 说明 | 回调参数 |
|----------|------|----------|
| input | 绑定值变化时触发的事件 | 选中的 Radio label 值 |

#### Radio-group Events（事件）
| 事件名称 | 说明 | 回调参数 |
|----------|------|----------|
| input | 绑定值变化时触发的事件 | 选中的 Radio label 值 |

## 代码示例

### 基础用法
```html
<el-radio v-model="radio" label="1">备选项1</el-radio>
<el-radio v-model="radio" label="2">备选项2</el-radio>
```

### 单选框组
```html
<el-radio-group v-model="radio">
  <el-radio :label="3">备选项1</el-radio>
  <el-radio :label="6">备选项2</el-radio>
  <el-radio :label="9">备选项3</el-radio>
</el-radio-group>
```

### 按钮样式
```html
<el-radio-group v-model="radio">
  <el-radio-button label="上海"></el-radio-button>
  <el-radio-button label="北京"></el-radio-button>
  <el-radio-button label="广州"></el-radio-button>
  <el-radio-button label="深圳"></el-radio-button>
</el-radio-group>
```

### Vue数据绑定
```javascript
new Vue({
  el: '.container',
  data: function() {
    return {
      radio: '1',
      radio2: '选中且禁用',
      radio3: 3,
      radio4: '上海'
    };
  }
});
```

## 部署步骤

### 重新构建和部署后端

1. **停止Tomcat服务器**
2. **重新构建项目**：
   - 在IDEA中：`Build` → `Rebuild Project`
3. **重新启动Tomcat服务器**

### 刷新小程序

1. 在微信开发者工具中点击"编译"按钮
2. 或者按 `Ctrl + B`（Windows）/ `Cmd + B`（Mac）

## 文件清单

### 新增的SVG图标文件
```
images/tabbar/
├── home.svg                    # 首页（未选中）
├── home-active.svg             # 首页（选中）
├── health.svg                 # 健康守护（未选中）
├── health-active.svg          # 健康守护（选中）
├── timebank.svg              # 时间银行（未选中）
├── timebank-active.svg       # 时间银行（选中）
├── lifecircle.svg            # 生活圈（未选中）
├── lifecircle-active.svg     # 生活圈（选中）
├── profile.svg               # 我的（未选中）
└── profile-active.svg        # 我的（选中）
```

### 新增的Java文件
```
javaweb-backend/src/main/java/com/hometownrooted/servlet/
└── RadioDemoServlet.java      # Element UI Radio演示Servlet
```

### 修改的配置文件
```
├── app.json                 # 更新tabBar图标路径
└── javaweb-backend/src/main/webapp/WEB-INF/
    └── web.xml             # 添加RadioDemoServlet配置
```

## 效果预览

### TabBar效果
- 未选中：灰色图标
- 选中：蓝色主题色图标
- 切换流畅，图标清晰

### Element UI Radio效果
- 基础单选框：圆形选择器
- 按钮样式：方形按钮组
- 禁用状态：灰色不可点击
- 边框样式：带边框的单选组

## 注意事项

1. **SVG图标优势**
   - 文件体积小
   - 任意缩放不失真
   - 支持CSS动态修改颜色

2. **Element UI CDN**
   - 使用了unpkg.com的CDN
   - Vue 2.6.14
   - Element UI 2.15.x

3. **浏览器兼容性**
   - 需要支持ES6的现代浏览器
   - 推荐使用Chrome、Firefox、Edge最新版本

## 扩展建议

### 1. 自定义TabBar图标
如果需要更换图标，只需：
1. 替换 `images/tabbar/` 目录下的SVG文件
2. 保持文件名不变
3. 刷新小程序

### 2. 添加更多Element UI组件
可以参考 `RadioDemoServlet.java` 的实现方式，添加：
- Checkbox（复选框）
- Input（输入框）
- Select（选择器）
- Button（按钮）
- Form（表单）

### 3. 集成到小程序
如果需要在小程序中使用类似组件：
1. 使用微信小程序原生组件 `<radio>`
2. 或使用第三方UI组件库（如Vant Weapp、iView Weapp）

## 相关资源

- Element UI官方文档：https://element.eleme.cn/#/zh-CN/component/radio
- Vue官方文档：https://cn.vuejs.org/
- 微信小程序官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/
