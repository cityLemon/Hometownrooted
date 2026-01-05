package com.hometownrooted.servlet;

import com.hometownrooted.dao.TaskDAO;
import com.hometownrooted.dao.TimeBankRecordDAO;
import com.hometownrooted.entity.Task;
import com.hometownrooted.entity.TimeBankRecord;
import com.hometownrooted.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TaskServlet extends HttpServlet {

    private TaskDAO taskDAO = new TaskDAO();
    private TimeBankRecordDAO timeBankRecordDAO = new TimeBankRecordDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        
        if (pathInfo == null || "/list".equals(pathInfo)) {
            listTasks(req, resp);
        } else if (pathInfo.startsWith("/")) {
            String idStr = pathInfo.substring(1);
            try {
                Integer id = Integer.parseInt(idStr);
                getTask(req, resp, id);
            } catch (NumberFormatException e) {
                JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid task ID"));
            }
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid request path"));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        
        if ("/create".equals(pathInfo)) {
            createTask(req, resp);
        } else if (pathInfo != null && pathInfo.startsWith("/")) {
            String[] parts = pathInfo.split("/");
            if (parts.length == 2 && "accept".equals(parts[1])) {
                String idStr = parts[0].substring(1);
                try {
                    Integer id = Integer.parseInt(idStr);
                    acceptTask(req, resp, id);
                } catch (NumberFormatException e) {
                    JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid task ID"));
                }
            } else if (parts.length == 2 && "complete".equals(parts[1])) {
                String idStr = parts[0].substring(1);
                try {
                    Integer id = Integer.parseInt(idStr);
                    completeTask(req, resp, id);
                } catch (NumberFormatException e) {
                    JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid task ID"));
                }
            }
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid request path"));
        }
    }

    private void listTasks(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String status = req.getParameter("status");
        List<Task> tasks;
        
        if (status != null && !status.isEmpty()) {
            tasks = taskDAO.findByStatus(status);
        } else {
            tasks = taskDAO.findAll();
        }
        
        JsonUtil.writeJsonResponse(resp, JsonUtil.success(tasks));
    }

    private void getTask(HttpServletRequest req, HttpServletResponse resp, Integer id) throws IOException {
        Task task = taskDAO.findById(id);
        if (task != null) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.success(task));
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Task not found"));
        }
    }

    private void createTask(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        BufferedReader reader = req.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        
        String body = sb.toString();
        String[] parts = body.split("&");
        Integer publisherId = null;
        String title = null;
        String description = null;
        String taskType = null;
        Double reward = null;
        String location = null;
        String deadlineStr = null;
        
        for (String part : parts) {
            String[] keyValue = part.split("=");
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = java.net.URLDecoder.decode(keyValue[1], "UTF-8");
                
                if ("publisher_id".equals(key)) {
                    try {
                        publisherId = Integer.parseInt(value);
                    } catch (NumberFormatException e) {
                        publisherId = null;
                    }
                } else if ("title".equals(key)) {
                    title = value;
                } else if ("description".equals(key)) {
                    description = value;
                } else if ("task_type".equals(key)) {
                    taskType = value;
                } else if ("reward".equals(key)) {
                    try {
                        reward = Double.parseDouble(value);
                    } catch (NumberFormatException e) {
                        reward = null;
                    }
                } else if ("location".equals(key)) {
                    location = value;
                } else if ("deadline".equals(key)) {
                    deadlineStr = value;
                }
            }
        }
        
        if (publisherId == null || title == null || reward == null) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("发布者ID、标题和奖励不能为空"));
            return;
        }
        
        Task task = new Task();
        task.setPublisherId(publisherId);
        task.setTitle(title);
        task.setDescription(description);
        task.setTaskType(taskType);
        task.setReward(reward);
        task.setLocation(location);
        if (deadlineStr != null && !deadlineStr.isEmpty()) {
            task.setDeadline(Timestamp.valueOf(deadlineStr));
        }
        task.setStatus("open");
        
        Integer taskId = taskDAO.insert(task);
        if (taskId != null) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.success("任务发布成功", taskDAO.findById(taskId)));
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("任务发布失败"));
        }
    }

    private void acceptTask(HttpServletRequest req, HttpServletResponse resp, Integer id) throws IOException {
        Task task = taskDAO.findById(id);
        if (task == null) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("任务不存在"));
            return;
        }
        
        if (!"open".equals(task.getStatus())) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("任务已被认领或已完成"));
            return;
        }
        
        String volunteerIdStr = req.getParameter("volunteer_id");
        if (volunteerIdStr == null || volunteerIdStr.isEmpty()) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("志愿者ID不能为空"));
            return;
        }
        
        Integer volunteerId;
        try {
            volunteerId = Integer.parseInt(volunteerIdStr);
        } catch (NumberFormatException e) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid volunteer ID"));
            return;
        }
        
        task.setStatus("assigned");
        task.setVolunteerId(volunteerId);
        
        if (taskDAO.update(task)) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.success("任务认领成功", task));
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("任务认领失败"));
        }
    }

    private void completeTask(HttpServletRequest req, HttpServletResponse resp, Integer id) throws IOException {
        Task task = taskDAO.findById(id);
        if (task == null) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("任务不存在"));
            return;
        }
        
        if (!"assigned".equals(task.getStatus())) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("任务状态不正确"));
            return;
        }
        
        task.setStatus("completed");
        
        if (taskDAO.update(task)) {
            BigDecimal reward = BigDecimal.valueOf(task.getReward());
            
            TimeBankRecord record = new TimeBankRecord();
            record.setUserId(task.getVolunteerId());
            record.setTaskId(task.getId());
            record.setType("earn");
            record.setAmount(reward);
            record.setDescription("完成任务：" + task.getTitle());
            
            BigDecimal currentBalance = timeBankRecordDAO.getBalance(task.getVolunteerId());
            BigDecimal newBalance = currentBalance.add(reward);
            record.setBalance(newBalance);
            
            timeBankRecordDAO.insert(record);
            
            JsonUtil.writeJsonResponse(resp, JsonUtil.success("任务完成成功", task));
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("任务完成失败"));
        }
    }
}
