import os
import struct
import zlib

# 创建图标目录
icon_dir = 'images/tabbar'
os.makedirs(icon_dir, exist_ok=True)

# PNG文件头
PNG_HEADER = b'\x89PNG\r\n\x1a\n'

# 创建一个简单的16x16红色圆形PNG

def create_simple_png(filename, color=(255, 0, 0)):
    width = 16
    height = 16
    
    # 创建像素数据
    pixels = []
    for y in range(height):
        row = []
        row.append(0)  # 过滤类型
        for x in range(width):
            # 创建一个简单的圆形
            dx = x - width//2
            dy = y - height//2
            if dx*dx + dy*dy <= (width//3)*(width//3):
                row.extend(color + (255,))  # RGBA
            else:
                row.extend((255, 255, 255, 0))  # 透明背景
        pixels.append(bytes(row))
    
    # 压缩像素数据
    compressed_data = zlib.compress(b''.join(pixels))
    
    # 创建PNG块
    def create_chunk(chunk_type, chunk_data):
        chunk_length = struct.pack('!I', len(chunk_data))
        chunk_crc = zlib.crc32(chunk_type + chunk_data) & 0xffffffff
        return chunk_length + chunk_type + chunk_data + struct.pack('!I', chunk_crc)
    
    # IHDR块
    ihdr_data = struct.pack('!IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_chunk = create_chunk(b'IHDR', ihdr_data)
    
    # IDAT块
    idat_chunk = create_chunk(b'IDAT', compressed_data)
    
    # IEND块
    iend_chunk = create_chunk(b'IEND', b'')
    
    # 组合所有块
    png_data = PNG_HEADER + ihdr_chunk + idat_chunk + iend_chunk
    
    # 保存文件
    with open(filename, 'wb') as f:
        f.write(png_data)

# 图标名称列表
icon_names = ['home', 'health', 'time', 'life', 'user']

# 普通状态颜色 (灰色)
normal_color = (192, 192, 192)
# 激活状态颜色 (橙色)
active_color = (255, 120, 0)  # #ff7800

# 创建所有图标
for name in icon_names:
    # 创建普通状态图标
    create_simple_png(os.path.join(icon_dir, f'{name}.png'), normal_color)
    # 创建激活状态图标
    create_simple_png(os.path.join(icon_dir, f'{name}-active.png'), active_color)

print('所有图标已创建完成！')
