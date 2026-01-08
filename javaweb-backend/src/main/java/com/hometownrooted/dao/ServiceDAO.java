package com.hometownrooted.dao;

import com.hometownrooted.entity.Service;
import com.hometownrooted.util.DBUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ServiceDAO {

    public Map<String, Object> findServices(int page, int pageSize, String category, String keyword) {
        List<Service> services = new ArrayList<>();
        int total = 0;
        int offset = (page - 1) * pageSize;

        StringBuilder sql = new StringBuilder("SELECT * FROM convenience_services WHERE status = 'active'");
        List<Object> params = new ArrayList<>();

        if (category != null && !category.isEmpty() && !"all".equals(category)) {
            sql.append(" AND category = ?");
            params.add(category);
        }

        if (keyword != null && !keyword.isEmpty()) {
            sql.append(" AND (title LIKE ? OR description LIKE ?)");
            params.add("%" + keyword + "%");
            params.add("%" + keyword + "%");
        }

        // 先获取总数
        String countSql = "SELECT COUNT(*) FROM convenience_services WHERE status = 'active'";
        StringBuilder countParams = new StringBuilder();
        if (category != null && !category.isEmpty() && !"all".equals(category)) {
            countSql += " AND category = ?";
        }
        if (keyword != null && !keyword.isEmpty()) {
            countSql += " AND (title LIKE ? OR description LIKE ?)";
        }

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(countSql)) {
            int paramIndex = 1;
            if (category != null && !category.isEmpty() && !"all".equals(category)) {
                pstmt.setString(paramIndex++, category);
            }
            if (keyword != null && !keyword.isEmpty()) {
                pstmt.setString(paramIndex++, "%" + keyword + "%");
                pstmt.setString(paramIndex++, "%" + keyword + "%");
            }
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                total = rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // 获取分页数据
        sql.append(" ORDER BY id LIMIT ? OFFSET ?");
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            int paramIndex = 1;
            for (Object param : params) {
                pstmt.setObject(paramIndex++, param);
            }
            pstmt.setInt(paramIndex++, pageSize);
            pstmt.setInt(paramIndex, offset);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                services.add(extractService(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("services", services);
        result.put("total", total);
        return result;
    }

    private Service extractService(ResultSet rs) throws SQLException {
        Service service = new Service();
        service.setId(rs.getInt("id"));
        service.setTitle(rs.getString("title"));
        service.setDescription(rs.getString("description"));
        service.setCategory(rs.getString("category"));
        service.setProviderName(rs.getString("provider_name"));
        service.setPhone(rs.getString("phone"));
        service.setAddress(rs.getString("address"));
        service.setStatus(rs.getString("status"));
        return service;
    }
}
