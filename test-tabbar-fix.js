/**
 * TabBar修复验证脚本
 * 用于验证tabBar修复效果
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 TabBar修复验证开始...\n');

// 1. 验证app.json配置
console.log('1. 验证app.json配置...');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  
  if (appJson.tabBar) {
    console.log('✅ tabBar配置存在');
    console.log(`   - tabBar项目数量: ${appJson.tabBar.list.length}`);
    console.log(`   - 普通颜色: ${appJson.tabBar.color}`);
    console.log(`   - 选中颜色: ${appJson.tabBar.selectedColor}`);
    console.log(`   - 背景颜色: ${appJson.tabBar.backgroundColor}`);
    console.log(`   - 边框样式: ${appJson.tabBar.borderStyle}`);
    
    // 检查是否启用了自定义tabBar
    if (appJson.tabBar.custom) {
      console.log('⚠️  警告：启用了自定义tabBar，可能影响显示');
    } else {
      console.log('✅ 未启用自定义tabBar');
    }
  } else {
    console.log('❌ tabBar配置不存在');
  }
} catch (error) {
  console.log('❌ app.json解析失败:', error.message);
}

console.log('\n2. 验证图标文件...');
const iconDir = 'images/tabbar';
if (fs.existsSync(iconDir)) {
  const iconFiles = fs.readdirSync(iconDir).filter(file => file.endsWith('.png'));
  console.log(`✅ 找到 ${iconFiles.length} 个图标文件`);
  
  iconFiles.forEach(file => {
    const filePath = path.join(iconDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`   - ${file} (${sizeKB}KB)`);
    
    if (sizeKB > 40) {
      console.log(`   ⚠️  警告：${file} 文件过大，可能影响加载`);
    }
  });
} else {
  console.log('❌ 图标目录不存在:', iconDir);
}

console.log('\n3. 验证页面文件...');
const requiredPages = [
  'pages/index/index',
  'pages/health/profile/profile',
  'pages/time-bank/record/record',
  'pages/life-circle/convenience/convenience',
  'pages/user/profile/profile'
];

requiredPages.forEach(page => {
  const jsFile = `${page}.js`;
  const wxmlFile = `${page}.wxml`;
  
  if (fs.existsSync(jsFile) && fs.existsSync(wxmlFile)) {
    console.log(`✅ ${page}`);
  } else {
    console.log(`❌ ${page} (文件缺失)`);
  }
});

console.log('\n4. 检查关键修复代码...');

// 检查index.js中的修复代码
const indexJs = fs.readFileSync('pages/index/index.js', 'utf8');

// 检查forceShowTabBar函数
if (indexJs.includes('forceShowTabBar')) {
  console.log('✅ forceShowTabBar函数已添加');
} else {
  console.log('❌ forceShowTabBar函数未找到');
}

// 检查switchTab使用
if (indexJs.includes('wx.switchTab')) {
  console.log('✅ 使用了switchTab跳转');
} else {
  console.log('❌ 未找到switchTab使用');
}

// 检查onShow生命周期
if (indexJs.includes('onShow()') && indexJs.includes('forceShowTabBar()')) {
  console.log('✅ onShow生命周期中调用了forceShowTabBar');
} else {
  console.log('❌ onShow生命周期未正确调用forceShowTabBar');
}

// 检查app.js中的logout修复
const appJs = fs.readFileSync('app.js', 'utf8');
if (appJs.includes('/pages/index/index') && appJs.includes('wx.reLaunch')) {
  console.log('✅ app.js中的logout已修复为跳转到首页');
} else {
  console.log('❌ app.js中的logout未正确修复');
}

console.log('\n5. 验证修复建议...');

// 检查是否有wx.hideTabBar调用
if (indexJs.includes('wx.hideTabBar')) {
  console.log('⚠️  警告：发现wx.hideTabBar调用，可能影响显示');
} else {
  console.log('✅ 未发现wx.hideTabBar调用');
}

// 检查是否有自动重定向逻辑
if (indexJs.includes('redirectToRolePage') && indexJs.includes('//')) {
  console.log('✅ 自动重定向逻辑已被注释');
} else if (indexJs.includes('redirectToRolePage')) {
  console.log('⚠️  警告：发现未注释的自动重定向逻辑');
} else {
  console.log('✅ 未发现自动重定向逻辑');
}

console.log('\n📋 修复验证完成！');
console.log('\n🎯 测试建议：');
console.log('1. 清除登录状态，重新进入小程序');
console.log('2. 检查index页面是否显示tabBar');
console.log('3. 点击各个tab项测试切换功能');
console.log('4. 登录后测试是否还能返回看到tabBar');
console.log('\n🔧 如果问题仍然存在，请检查：');
console.log('- 微信开发者工具控制台是否有相关错误');
console.log('- 图标文件是否正确加载');
console.log('- 页面跳转方式是否正确');
console.log('- 是否有其他全局配置影响tabBar显示');