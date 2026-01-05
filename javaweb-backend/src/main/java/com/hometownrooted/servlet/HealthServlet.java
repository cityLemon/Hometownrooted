package com.hometownrooted.servlet;

import com.hometownrooted.dao.UserDAO;
import com.hometownrooted.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

public class HealthServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        
        try {
            JsonUtil.writeJsonResponse(resp, JsonUtil.success("Backend is running"));
        } catch (Exception e) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Health check failed: " + e.getMessage()));
        }
    }
}
