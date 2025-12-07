// TabBar配置验证脚本
const fs = require('fs');
const path = require('path');

console.log('🔍 验证TabBar配置...\n');

// 读取app.json
const appJsonPath = path.join(__dirname, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// 检查tabBar配置
if (!appJson.tabBar) {
  console.log('❌ 未找到tabBar配置');
  process.exit(1);
}

console.log('✅ 找到tabBar配置');
console.log(`📋 TabBar项目数量: ${appJson.tabBar.list.length}`);

// 检查每个tabBar项目
appJson.tabBar.list.forEach((item, index) => {
  console.log(`\n${index + 1}. ${item.text}`);
  console.log(`   页面路径: ${item.pagePath}`);
  
  // 检查图标文件是否存在
  const iconPath = path.join(__dirname, item.iconPath);
  const selectedIconPath = path.join(__dirname, item.selectedIconPath);
  
  if (fs.existsSync(iconPath)) {
    console.log(`   ✅ 图标存在: ${item.iconPath}`);
  } else {
    console.log(`   ❌ 图标缺失: ${item.iconPath}`);
  }
  
  if (fs.existsSync(selectedIconPath)) {
    console.log(`   ✅ 激活图标存在: ${item.selectedIconPath}`);
  } else {
    console.log(`   ❌ 激活图标缺失: ${item.selectedIconPath}`);
  }
  
  // 检查页面文件是否存在
  const pagePath = path.join(__dirname, item.pagePath + '.js');
  if (fs.existsSync(pagePath)) {
    console.log(`   ✅ 页面文件存在: ${item.pagePath}`);
  } else {
    console.log(`   ❌ 页面文件缺失: ${item.pagePath}`);
  }
});

console.log('\n🎉 TabBar配置验证完成！');
console.log('\n💡 提示:');
console.log('   - 如果图标显示异常，请检查图标文件格式和大小');
console.log('   - 确保所有页面文件都存在且路径正确');
console.log('   - 在微信开发者工具中重新编译项目');