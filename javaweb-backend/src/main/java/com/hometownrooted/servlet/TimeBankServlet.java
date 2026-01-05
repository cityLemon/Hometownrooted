package com.hometownrooted.servlet;

import com.hometownrooted.dao.TimeBankRecordDAO;
import com.hometownrooted.entity.TimeBankRecord;
import com.hometownrooted.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

public class TimeBankServlet extends HttpServlet {

    private TimeBankRecordDAO timeBankRecordDAO = new TimeBankRecordDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        
        if ("/balance".equals(pathInfo)) {
            getBalance(req, resp);
        } else if ("/records".equals(pathInfo)) {
            getRecords(req, resp);
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid request path"));
        }
    }

    private void getBalance(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String userIdStr = req.getParameter("user_id");
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
        
        BigDecimal balance = timeBankRecordDAO.getBalance(userId);
        
        JsonUtil.writeJsonResponse(resp, JsonUtil.success(balance));
    }

    private void getRecords(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String userIdStr = req.getParameter("user_id");
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
        
        List<TimeBankRecord> records = timeBankRecordDAO.findByUserId(userId);
        
        JsonUtil.writeJsonResponse(resp, JsonUtil.success(records));
    }
}
