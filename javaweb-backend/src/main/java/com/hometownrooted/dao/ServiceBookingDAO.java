package com.hometownrooted.dao;

import com.hometownrooted.entity.ServiceBooking;
import com.hometownrooted.util.DBUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ServiceBookingDAO {

    public Integer save(ServiceBooking booking) {
        // 根据数据库结构调整插入语句
        String sql = "INSERT INTO service_bookings (user_id, service_type, service_name, status) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setInt(1, booking.getUserId());
            pstmt.setString(2, "convenience");  // 便民服务类型
            pstmt.setString(3, booking.getServiceName());
            pstmt.setString(4, booking.getStatus());
            pstmt.executeUpdate();
            ResultSet rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<ServiceBooking> findByPage(int page, int pageSize) {
        List<ServiceBooking> bookings = new ArrayList<>();
        int offset = (page - 1) * pageSize;
        String sql = "SELECT id, user_id, service_name, status, created_at FROM service_bookings ORDER BY created_at DESC LIMIT ? OFFSET ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, pageSize);
            pstmt.setInt(2, offset);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                bookings.add(extractBooking(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return bookings;
    }

    private ServiceBooking extractBooking(ResultSet rs) throws SQLException {
        ServiceBooking booking = new ServiceBooking();
        booking.setId(rs.getInt("id"));
        booking.setUserId(rs.getInt("user_id"));
        booking.setServiceName(rs.getString("service_name"));
        booking.setStatus(rs.getString("status"));
        booking.setCreatedAt(rs.getTimestamp("created_at"));
        return booking;
    }
}
