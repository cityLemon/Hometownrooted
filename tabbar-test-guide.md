# TabBar测试指南

## 当前状态
✅ **问题已修复** - 底部导航栏图标不显示的问题已经解决

## 修复内容
1. **禁用自动重定向** - 临时注释掉了自动跳转到其他页面的逻辑
2. **添加调试工具** - 在index页面添加了调试面板
3. **修复语法错误** - 修复了JavaScript语法问题

## 如何测试TabBar功能

### 方法1：直接测试
1. 重新编译微信小程序
2. 进入index页面
3. 查看底部导航栏是否正常显示

### 方法2：使用调试工具
1. 打开index页面
2. 点击右上角的⚙️图标（调试触发器）
3. 点击"清除登录数据"按钮
4. 等待应用自动重启
5. 查看底部导航栏是否显示

### 方法3：检查图标文件
确保以下图标文件存在：
```
images/tabbar/
├── home.png              # 首页图标
├── home-active.png       # 首页激活图标
├── health.png            # 健康守护图标
├── health-active.png     # 健康守护激活图标
├── time.png              # 时间银行图标
├── time-active.png       # 时间银行激活图标
├── life.png              # 生活圈图标
├── life-active.png       # 生活圈激活图标
└── user.png              # 我的图标
└── user-active.png       # 我的激活图标
```

## TabBar配置
在`app.json`中的配置：
```json
"tabBar": {
  "color": "#8898AA",
  "selectedColor": "#2D64F0",
  "backgroundColor": "#FFFFFF",
  "borderStyle": "black",
  "list": [
    {
      "pagePath": "pages/index/index",
      "text": "首页",
      "iconPath": "images/tabbar/home.png",
      "selectedIconPath": "images/tabbar/home-active.png"
    },
    {
      "pagePath": "pages/health/profile/profile",
      "text": "健康守护",
      "iconPath": "images/tabbar/health.png",
      "selectedIconPath": "images/tabbar/health-active.png"
    },
    {
      "pagePath": "pages/time-bank/record/record",
      "text": "时间银行",
      "iconPath": "images/tabbar/time.png",
      "selectedIconPath": "images/tabbar/time-active.png"
    },
    {
      "pagePath": "pages/life-circle/convenience/convenience",
      "text": "生活圈",
      "iconPath": "images/tabbar/life.png",
      "selectedIconPath": "images/tabbar/life-active.png"
    },
    {
      "pagePath": "pages/user/profile/profile",
      "text": "我的",
      "iconPath": "images/tabbar/user.png",
      "selectedIconPath": "images/tabbar/user-active.png"
    }
  ]
}
```

## 预期结果
- 底部导航栏应该显示5个图标
- 点击不同图标可以切换页面
- 当前页面图标应该高亮显示（蓝色）
- 未选中图标显示灰色

## 如果仍然有问题
1. 检查微信开发者工具控制台是否有错误信息
2. 确认所有图标文件存在且路径正确
3. 检查是否有JavaScript语法错误
4. 尝试清除缓存重新编译

## 注意事项
- 调试工具仅供开发测试使用
- 发布前应移除调试相关代码
- 确保后端服务正常运行（http://localhost:3000）