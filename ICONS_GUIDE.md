# TabBar 图标创建指南

## 当前状态
已移除原有图标配置，tabBar 现在只显示纯文本。

## 图标要求

微信小程序 tabBar 图标必须满足以下要求：
- **尺寸**: 81px × 81px
- **格式**: PNG
- **颜色**: 灰色图标（未选中状态）和蓝色图标（选中状态）
- **背景**: 透明背景

## 需要创建的图标

### 1. 首页
- 未选中: `home.png` - 灰色房屋图标
- 选中: `home-active.png` - 蓝色房屋图标

### 2. 健康守护
- 未选中: `health.png` - 灰色心形/医疗图标
- 选中: `health-active.png` - 蓝色心形/医疗图标

### 3. 时间银行
- 未选中: `time.png` - 灰色时钟/沙漏图标
- 选中: `time-active.png` - 蓝色时钟/沙漏图标

### 4. 生活圈
- 未选中: `life.png` - 灰色社区/圈子图标
- 选中: `life-active.png` - 蓝色社区/圈子图标

### 5. 我的
- 未选中: `user.png` - 灰色用户图标
- 选中: `user-active.png` - 蓝色用户图标

## 颜色规范

- **未选中颜色**: `#8898AA` (灰色)
- **选中颜色**: `#409EFF` (Element UI 蓝色)

## 创建方法

### 方法1: 使用在线图标库
1. 访问 [Iconfont](https://www.iconfont.cn/)
2. 搜索需要的图标（如：首页、健康、时间、生活、用户）
3. 选择合适的图标
4. 下载时设置：
   - 尺寸: 81px × 81px
   - 格式: PNG
   - 颜色: 分别下载灰色和蓝色版本

### 方法2: 使用 Element UI 图标
1. 访问 [Element UI Icons](https://element.eleme.cn/#/zh-CN/component/icon)
2. 找到对应的图标：
   - 首页: `el-icon-s-home`
   - 健康: `el-icon-s-flag` 或 `el-icon-first-aid-kit`
   - 时间: `el-icon-time`
   - 生活: `el-icon-s-grid` 或 `el-icon-s-cooperation`
   - 我的: `el-icon-user`
3. 使用截图工具截取图标
4. 使用图片编辑器调整尺寸为 81px × 81px
5. 分别保存为灰色和蓝色版本

### 方法3: 使用 SVG 转 PNG
1. 使用现有的 SVG 文件（在 images/tabbar/ 目录下）
2. 使用在线转换工具：[SVG 转 PNG](https://cloudconvert.com/svg-to-png)
3. 设置尺寸为 81px × 81px
4. 设置颜色为灰色 (#8898AA) 或蓝色 (#409EFF)
5. 下载并保存到 `images/tabbar/` 目录

## 文件放置位置

创建好的图标文件需要放置在：
```
c:\Users\City\Desktop\content\images\tabbar\
```

## 配置步骤

图标创建完成后，需要更新 `app.json` 文件：

```json
"tabBar": {
  "color": "#8898AA",
  "selectedColor": "#409EFF",
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

## 验证步骤

1. 在微信开发者工具中点击"编译"按钮
2. 检查底部 tabBar 是否正确显示图标
3. 点击不同的 tab，验证图标颜色变化
4. 如果图标不显示，尝试清除缓存：
   - 点击"工具" → "清除缓存" → "全部清除"
   - 重新编译项目

## 常见问题

### 图标不显示
- 检查文件路径是否正确
- 确认图标尺寸是否为 81px × 81px
- 确认图标格式是否为 PNG
- 尝试清除缓存并重新编译

### 图标显示模糊
- 确保图标尺寸正确
- 使用高分辨率的原始图标进行转换
- 避免过度压缩

### 图标颜色不对
- 确认未选中图标颜色为 #8898AA
- 确认选中图标颜色为 #409EFF
- 检查图标背景是否为透明

## 快速开始

如果您想立即看到效果，可以先使用纯文本配置（当前已配置），然后再逐步添加图标。
