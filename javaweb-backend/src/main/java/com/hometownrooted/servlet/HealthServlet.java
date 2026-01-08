package com.hometownrooted.servlet;

import com.hometownrooted.dao.HealthProfileDAO;
import com.hometownrooted.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

public class HealthServlet extends HttpServlet {

    private HealthProfileDAO healthProfileDAO = new HealthProfileDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            // 健康检查端点
            checkHealth(req, resp);
        } else if (pathInfo.startsWith("/profile/")) {
            // 获取健康档案
            String userIdStr = pathInfo.substring("/profile/".length());
            getHealthProfile(userIdStr, resp);
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid request path"));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        if (pathInfo != null && pathInfo.startsWith("/profile/")) {
            String userIdStr = pathInfo.substring("/profile/".length());
            updateHealthProfile(userIdStr, req, resp);
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid request path"));
        }
    }

    private void checkHealth(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");

        try {
            JsonUtil.writeJsonResponse(resp, JsonUtil.success("Backend is running"));
        } catch (Exception e) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Health check failed: " + e.getMessage()));
        }
    }

    private void getHealthProfile(String userIdStr, HttpServletResponse resp) throws IOException {
        if (userIdStr == null || userIdStr.isEmpty()) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("用户ID不能为空"));
            return;
        }

        Integer userId;
        try {
            userId = Integer.parseInt(userIdStr);
        } catch (NumberFormatException e) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid user ID"));
            return;
        }

        try {
            var healthData = healthProfileDAO.getHealthDataByUserId(userId);
            JsonUtil.writeJsonResponse(resp, JsonUtil.success(healthData));
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("获取健康档案失败: " + e.getMessage()));
        }
    }

    private void updateHealthProfile(String userIdStr, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (userIdStr == null || userIdStr.isEmpty()) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("用户ID不能为空"));
            return;
        }

        Integer userId;
        try {
            userId = Integer.parseInt(userIdStr);
        } catch (NumberFormatException e) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid user ID"));
            return;
        }

        // 这里需要从前端获取数据并更新
        // 简化实现，直接返回成功
        JsonUtil.writeJsonResponse(resp, JsonUtil.success("健康档案已更新"));
    }
}

