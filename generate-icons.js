const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZE = 81;
const GRAY_COLOR = '#8898AA';
const BLUE_COLOR = '#409EFF';

const icons = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="81" height="81">
    <path d="M50 20 L10 60 L20 60 L20 85 L40 85 L40 65 L60 65 L60 85 L80 85 L80 60 L90 60 Z" 
          fill="none" stroke="COLOR" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  health: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="81" height="81">
    <path d="M50 85 C20 65 20 35 35 25 C45 18 50 25 50 25 C50 25 55 18 65 25 C80 35 80 65 50 85 Z" 
          fill="none" stroke="COLOR" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  time: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="81" height="81">
    <circle cx="50" cy="50" r="35" fill="none" stroke="COLOR" stroke-width="6"/>
    <line x1="50" y1="50" x2="50" y2="25" stroke="COLOR" stroke-width="6" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="70" y2="50" stroke="COLOR" stroke-width="6" stroke-linecap="round"/>
  </svg>`,
  
  life: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="81" height="81">
    <circle cx="50" cy="30" r="12" fill="none" stroke="COLOR" stroke-width="6"/>
    <circle cx="25" cy="70" r="12" fill="none" stroke="COLOR" stroke-width="6"/>
    <circle cx="75" cy="70" r="12" fill="none" stroke="COLOR" stroke-width="6"/>
    <line x1="50" y1="42" x2="25" y2="58" stroke="COLOR" stroke-width="6" stroke-linecap="round"/>
    <line x1="50" y1="42" x2="75" y2="58" stroke="COLOR" stroke-width="6" stroke-linecap="round"/>
  </svg>`,
  
  user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="81" height="81">
    <circle cx="50" cy="30" r="15" fill="none" stroke="COLOR" stroke-width="6"/>
    <path d="M20 90 C20 65 35 55 50 55 C65 55 80 65 80 90" 
          fill="none" stroke="COLOR" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
};

async function createIcons() {
  const outputDir = path.join(__dirname, 'images', 'tabbar');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const [iconName, svgTemplate] of Object.entries(icons)) {
    const graySvg = svgTemplate.replace(/COLOR/g, GRAY_COLOR);
    const blueSvg = svgTemplate.replace(/COLOR/g, BLUE_COLOR);
    
    const grayBuffer = Buffer.from(graySvg);
    const blueBuffer = Buffer.from(blueSvg);
    
    await sharp(grayBuffer)
      .resize(ICON_SIZE, ICON_SIZE)
      .png()
      .toFile(path.join(outputDir, `${iconName}.png`));
    
    await sharp(blueBuffer)
      .resize(ICON_SIZE, ICON_SIZE)
      .png()
      .toFile(path.join(outputDir, `${iconName}-active.png`));
    
    console.log(`✅ 已生成 ${iconName} 图标`);
  }

  console.log('\n✅ 所有图标生成完成！');
  console.log('📁 图标已保存到: images/tabbar/');
  console.log('📋 请更新 app.json 配置以使用这些图标');
}

createIcons().catch(console.error);