package com.hometownrooted.servlet;

import com.hometownrooted.util.DBUtil;
import com.hometownrooted.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

public class DatabaseStatusServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        
        Connection conn = null;
        try {
            conn = DBUtil.getConnection();
            
            if (conn != null) {
                DatabaseMetaData metaData = conn.getMetaData();
                
                String databaseName = conn.getCatalog();
                String databaseType = metaData.getDatabaseProductName();
                String databaseVersion = metaData.getDatabaseProductVersion();
                
                JsonUtil.writeJsonResponse(resp, JsonUtil.success(new java.util.HashMap<String, Object>() {{
                    put("status", "connected");
                    put("databaseType", databaseType);
                    put("databaseName", databaseName);
                    put("databaseVersion", databaseVersion);
                }}));
            } else {
                JsonUtil.writeJsonResponse(resp, JsonUtil.error("Database connection failed"));
            }
        } catch (Exception e) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Database status check failed: " + e.getMessage()));
        } finally {
            DBUtil.closeConnection(conn);
        }
    }
}
