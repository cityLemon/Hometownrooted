package com.hometownrooted.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RoleSelectionServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html;charset=UTF-8");
        
        // 转发到角色选择页面
        req.getRequestDispatcher("/role-selection.html").forward(req, resp);
    }
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        
        // 处理角色选择提交
        String selectedRole = req.getParameter("role");
        
        if (selectedRole != null && !selectedRole.isEmpty()) {
            resp.getWriter().write("{\"success\":true,\"message\":\"角色选择成功\",\"role\":\"" + selectedRole + "\"}");
        } else {
            resp.getWriter().write("{\"success\":false,\"message\":\"请选择角色\"}");
        }
    }
}
