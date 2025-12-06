import os
import struct
import zlib
import math

# 创建图标目录
icon_dir = 'images/tabbar'
os.makedirs(icon_dir, exist_ok=True)

# PNG文件头
PNG_HEADER = b'\x89PNG\r\n\x1a\n'

def create_home_icon(filename, color=(255, 0, 0)):
    """创建房屋形状的首页图标"""
    width = 81
    height = 81
    
    pixels = []
    for y in range(height):
        row = []
        row.append(0)  # 过滤类型
        for x in range(width):
            # 房屋形状：屋顶 + 正方形
            center_x = width // 2
            center_y = height // 2
            
            # 屋顶（三角形）
            if y < height // 3:
                roof_left = center_x - (height // 3 - y)
                roof_right = center_x + (height // 3 - y)
                if roof_left <= x <= roof_right:
                    row.extend(color + (255,))  # RGBA
                else:
                    row.extend((255, 255, 255, 0))  # 透明背景
            # 房屋主体（正方形）
            else:
                house_left = width // 4
                house_right = 3 * width // 4
                house_bottom = 3 * height // 4
                
                if house_left <= x <= house_right and y <= house_bottom:
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

def create_health_icon(filename, color=(255, 0, 0)):
    """创建十字形状的爱心图标"""
    width = 81
    height = 81
    
    pixels = []
    for y in range(height):
        row = []
        row.append(0)  # 过滤类型
        for x in range(width):
            center_x = width // 2
            center_y = height // 2
            
            # 十字形状（医疗十字）
            vertical_bar = abs(x - center_x) <= 8
            horizontal_bar = abs(y - center_y) <= 8
            
            if vertical_bar or horizontal_bar:
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

def create_time_icon(filename, color=(255, 0, 0)):
    """创建时钟形状的时间银行图标"""
    width = 81
    height = 81
    
    pixels = []
    for y in range(height):
        row = []
        row.append(0)  # 过滤类型
        for x in range(width):
            center_x = width // 2
            center_y = height // 2
            
            # 计算到中心的距离
            dx = x - center_x
            dy = y - center_y
            distance = math.sqrt(dx*dx + dy*dy)
            
            # 外圆（时钟边框）
            if 28 <= distance <= 32:
                row.extend(color + (255,))  # RGBA
            # 时针（短针）
            elif abs(dx) <= 2 and -15 <= dy <= 0:
                row.extend(color + (255,))  # RGBA
            # 分针（长针）
            elif abs(dy) <= 2 and 0 <= dx <= 20:
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

def create_life_icon(filename, color=(255, 0, 0)):
    """创建圆环形状的生活圈图标"""
    width = 81
    height = 81
    
    pixels = []
    for y in range(height):
        row = []
        row.append(0)  # 过滤类型
        for x in range(width):
            center_x = width // 2
            center_y = height // 2
            
            # 计算到中心的距离
            dx = x - center_x
            dy = y - center_y
            distance = math.sqrt(dx*dx + dy*dy)
            
            # 外圆环
            if 25 <= distance <= 30:
                row.extend(color + (255,))  # RGBA
            # 内圆环（小一点）
            elif 15 <= distance <= 18:
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

def create_user_icon(filename, color=(255, 0, 0)):
    """创建人形形状的我的图标"""
    width = 81
    height = 81
    
    pixels = []
    for y in range(height):
        row = []
        row.append(0)  # 过滤类型
        for x in range(width):
            center_x = width // 2
            center_y = height // 2
            
            # 头部（圆形）
            head_dx = x - center_x
            head_dy = y - (center_y - 15)
            head_distance = math.sqrt(head_dx*head_dx + head_dy*head_dy)
            
            # 身体（矩形）
            body_left = center_x - 10
            body_right = center_x + 10
            body_top = center_y - 5
            body_bottom = center_y + 15
            
            if head_distance <= 12:  # 头部
                row.extend(color + (255,))  # RGBA
            elif body_left <= x <= body_right and body_top <= y <= body_bottom:  # 身体
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

# 普通状态颜色 (灰色)
normal_color = (192, 192, 192)
# 激活状态颜色 (橙色)
active_color = (255, 120, 0)  # #ff7800

# 创建所有图标
def create_all_icons():
    # 首页图标 - 房屋形状
    create_home_icon(os.path.join(icon_dir, 'home.png'), normal_color)
    create_home_icon(os.path.join(icon_dir, 'home-active.png'), active_color)
    
    # 健康守护图标 - 十字形状
    create_health_icon(os.path.join(icon_dir, 'health.png'), normal_color)
    create_health_icon(os.path.join(icon_dir, 'health-active.png'), active_color)
    
    # 时间银行图标 - 时钟形状
    create_time_icon(os.path.join(icon_dir, 'time.png'), normal_color)
    create_time_icon(os.path.join(icon_dir, 'time-active.png'), active_color)
    
    # 生活圈图标 - 圆环形状
    create_life_icon(os.path.join(icon_dir, 'life.png'), normal_color)
    create_life_icon(os.path.join(icon_dir, 'life-active.png'), active_color)
    
    # 我的图标 - 人形形状
    create_user_icon(os.path.join(icon_dir, 'user.png'), normal_color)
    create_user_icon(os.path.join(icon_dir, 'user-active.png'), active_color)

create_all_icons()
print('所有图标已创建完成！')
