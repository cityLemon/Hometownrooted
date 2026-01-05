package com.hometownrooted.servlet;

import com.hometownrooted.dao.UserDAO;
import com.hometownrooted.entity.User;
import com.hometownrooted.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class AuthServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        
        if ("/login".equals(pathInfo)) {
            login(req, resp);
        } else if ("/register".equals(pathInfo)) {
            register(req, resp);
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid request path"));
        }
    }

    private void login(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        BufferedReader reader = req.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        
        String body = sb.toString();
        String[] parts = body.split("&");
        String username = null;
        String password = null;
        
        for (String part : parts) {
            String[] keyValue = part.split("=");
            if (keyValue.length == 2) {
                if ("username".equals(keyValue[0])) {
                    username = java.net.URLDecoder.decode(keyValue[1], "UTF-8");
                } else if ("password".equals(keyValue[0])) {
                    password = java.net.URLDecoder.decode(keyValue[1], "UTF-8");
                }
            }
        }
        
        if (username == null || password == null) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("用户名和密码不能为空"));
            return;
        }
        
        User user = userDAO.findByUsername(username);
        if (user == null) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("USER_NOT_FOUND", "用户名不存在"));
            return;
        }
        
        if (!password.equals(user.getPassword())) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("INVALID_PASSWORD", "密码错误"));
            return;
        }
        
        if (user.getStatus() == 0) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("USER_DISABLED", "账号已被禁用，请联系客服"));
            return;
        }
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("role_name", user.getRoleName());
        userInfo.put("phone", user.getPhone());
        userInfo.put("gender", user.getGender());
        userInfo.put("age", user.getAge());
        userInfo.put("address", user.getAddress());
        userInfo.put("avatar", user.getAvatar());
        
        Map<String, Object> data = new HashMap<>();
        data.put("token", "token_" + user.getId() + "_" + System.currentTimeMillis());
        data.put("userInfo", userInfo);
        
        JsonUtil.writeJsonResponse(resp, JsonUtil.success("登录成功", data));
    }

    private void register(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        BufferedReader reader = req.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        
        String body = sb.toString();
        String[] parts = body.split("&");
        String username = null;
        String password = null;
        String roleName = null;
        String phone = null;
        String gender = null;
        Integer age = null;
        String address = null;
        
        for (String part : parts) {
            String[] keyValue = part.split("=");
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = java.net.URLDecoder.decode(keyValue[1], "UTF-8");
                
                if ("username".equals(key)) {
                    username = value;
                } else if ("password".equals(key)) {
                    password = value;
                } else if ("role_name".equals(key)) {
                    roleName = value;
                } else if ("phone".equals(key)) {
                    phone = value;
                } else if ("gender".equals(key)) {
                    gender = value;
                } else if ("age".equals(key)) {
                    try {
                        age = Integer.parseInt(value);
                    } catch (NumberFormatException e) {
                        age = null;
                    }
                } else if ("address".equals(key)) {
                    address = value;
                }
            }
        }
        
        if (username == null || password == null || roleName == null) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("用户名、密码和角色不能为空"));
            return;
        }
        
        if (username.length() < 3) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("用户名至少3位"));
            return;
        }
        
        if (password.length() < 6) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("密码至少6位"));
            return;
        }
        
        User existingUser = userDAO.findByUsername(username);
        if (existingUser != null) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("用户名已存在"));
            return;
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setRoleName(roleName);
        user.setPhone(phone);
        user.setGender(gender);
        user.setAge(age);
        user.setAddress(address);
        user.setAvatar("/static/images/avatar/default.jpg");
        
        Integer userId = userDAO.insert(user);
        if (userId != null) {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", userId);
            userInfo.put("username", user.getUsername());
            userInfo.put("role_name", user.getRoleName());
            userInfo.put("phone", user.getPhone());
            userInfo.put("gender", user.getGender());
            userInfo.put("age", user.getAge());
            userInfo.put("address", user.getAddress());
            userInfo.put("avatar", user.getAvatar());
            
            Map<String, Object> data = new HashMap<>();
            data.put("token", "token_" + userId + "_" + System.currentTimeMillis());
            data.put("userInfo", userInfo);
            
            JsonUtil.writeJsonResponse(resp, JsonUtil.success("注册成功", data));
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("注册失败"));
        }
    }
}
