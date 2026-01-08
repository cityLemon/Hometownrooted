package com.hometownrooted.dao;

import com.hometownrooted.entity.HealthProfile;
import com.hometownrooted.util.DBUtil;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;

public class HealthProfileDAO {

    public HealthProfile findByUserId(Integer userId) {
        String sql = "SELECT * FROM health_profiles WHERE user_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return extractProfile(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Integer save(HealthProfile profile) {
        String sql = "INSERT INTO health_profiles (user_id, height, weight, blood_pressure, blood_sugar, heart_rate, allergies, medications, chronic_diseases, emergency_contact, emergency_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setInt(1, profile.getUserId());
            pstmt.setDouble(2, profile.getHeight());
            pstmt.setDouble(3, profile.getWeight());
            pstmt.setString(4, profile.getBloodPressure());
            pstmt.setString(5, profile.getBloodSugar());
            pstmt.setInt(6, profile.getHeartRate());
            pstmt.setString(7, profile.getAllergies());
            pstmt.setString(8, profile.getMedications());
            pstmt.setString(9, profile.getChronicDiseases());
            pstmt.setString(10, profile.getEmergencyContact());
            pstmt.setString(11, profile.getEmergencyPhone());
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

    public boolean update(HealthProfile profile) {
        String sql = "UPDATE health_profiles SET height = ?, weight = ?, blood_pressure = ?, blood_sugar = ?, heart_rate = ?, allergies = ?, medications = ?, chronic_diseases = ?, emergency_contact = ?, emergency_phone = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setDouble(1, profile.getHeight());
            pstmt.setDouble(2, profile.getWeight());
            pstmt.setString(3, profile.getBloodPressure());
            pstmt.setString(4, profile.getBloodSugar());
            pstmt.setInt(5, profile.getHeartRate());
            pstmt.setString(6, profile.getAllergies());
            pstmt.setString(7, profile.getMedications());
            pstmt.setString(8, profile.getChronicDiseases());
            pstmt.setString(9, profile.getEmergencyContact());
            pstmt.setString(10, profile.getEmergencyPhone());
            pstmt.setInt(11, profile.getUserId());
            int rows = pstmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public Map<String, Object> getHealthDataByUserId(Integer userId) {
        Map<String, Object> healthData = new HashMap<>();

        // 获取基本信息
        HealthProfile profile = findByUserId(userId);
        if (profile != null) {
            Map<String, Object> basicInfo = new HashMap<>();
            basicInfo.put("name", ""); // 从用户表获取
            basicInfo.put("age", 0);
            basicInfo.put("gender", "");
            basicInfo.put("phone", "");
            basicInfo.put("address", "");
            healthData.put("basicInfo", basicInfo);

            Map<String, Object> vitals = new HashMap<>();
            vitals.put("bloodPressure", profile.getBloodPressure());
            vitals.put("heartRate", profile.getHeartRate());
            vitals.put("bloodSugar", profile.getBloodSugar());
            vitals.put("weight", profile.getWeight());
            healthData.put("vitals", vitals);

            Map<String, String> vitalsTrend = new HashMap<>();
            vitalsTrend.put("bloodPressure", "stable");
            vitalsTrend.put("heartRate", "stable");
            vitalsTrend.put("bloodSugar", "stable");
            vitalsTrend.put("weight", "stable");
            healthData.put("vitalsTrend", vitalsTrend);

            healthData.put("lastUpdateDate", profile.getUpdatedAt() != null ? profile.getUpdatedAt().toString() : "今天");

            // 简化处理，将字符串转换为数组
            healthData.put("chronicDiseases", new Object[0]);
            healthData.put("medication", new Object[0]);
            healthData.put("allergies", profile.getAllergies() != null ? profile.getAllergies() : "无");
            healthData.put("medicalHistory", new Object[0]);
        }

        return healthData;
    }

    private HealthProfile extractProfile(ResultSet rs) throws SQLException {
        HealthProfile profile = new HealthProfile();
        profile.setId(rs.getInt("id"));
        profile.setUserId(rs.getInt("user_id"));
        profile.setHeight(rs.getDouble("height"));
        profile.setWeight(rs.getDouble("weight"));
        profile.setBloodPressure(rs.getString("blood_pressure"));
        profile.setBloodSugar(rs.getString("blood_sugar"));
        profile.setHeartRate(rs.getInt("heart_rate"));
        profile.setAllergies(rs.getString("allergies"));
        profile.setMedications(rs.getString("medications"));
        profile.setChronicDiseases(rs.getString("chronic_diseases"));
        profile.setEmergencyContact(rs.getString("emergency_contact"));
        profile.setEmergencyPhone(rs.getString("emergency_phone"));
        profile.setCreatedAt(rs.getTimestamp("created_at"));
        profile.setUpdatedAt(rs.getTimestamp("updated_at"));
        return profile;
    }
}
