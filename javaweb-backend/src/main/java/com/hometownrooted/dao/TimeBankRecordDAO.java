package com.hometownrooted.dao;

import com.hometownrooted.entity.TimeBankRecord;
import com.hometownrooted.util.DBUtil;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TimeBankRecordDAO {

    public Integer insert(TimeBankRecord record) {
        String sql = "INSERT INTO time_bank_records (user_id, task_id, type, amount, description, balance) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setInt(1, record.getUserId());
            pstmt.setInt(2, record.getTaskId());
            pstmt.setString(3, record.getType());
            pstmt.setBigDecimal(4, record.getAmount());
            pstmt.setString(5, record.getDescription());
            pstmt.setBigDecimal(6, record.getBalance());
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

    public List<TimeBankRecord> findByUserId(Integer userId) {
        List<TimeBankRecord> records = new ArrayList<>();
        String sql = "SELECT * FROM time_bank_records WHERE user_id = ? ORDER BY created_at DESC";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                records.add(extractRecord(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return records;
    }

    public BigDecimal getBalance(Integer userId) {
        String sql = "SELECT balance FROM time_bank_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getBigDecimal("balance");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return BigDecimal.ZERO;
    }

    private TimeBankRecord extractRecord(ResultSet rs) throws SQLException {
        TimeBankRecord record = new TimeBankRecord();
        record.setId(rs.getInt("id"));
        record.setUserId(rs.getInt("user_id"));
        record.setTaskId(rs.getInt("task_id"));
        record.setType(rs.getString("type"));
        record.setAmount(rs.getBigDecimal("amount"));
        record.setDescription(rs.getString("description"));
        record.setBalance(rs.getBigDecimal("balance"));
        record.setCreatedAt(rs.getTimestamp("created_at"));
        return record;
    }
}
