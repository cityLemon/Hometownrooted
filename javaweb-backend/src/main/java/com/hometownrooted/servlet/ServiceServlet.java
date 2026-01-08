package com.hometownrooted.servlet;

import com.hometownrooted.dao.ServiceDAO;
import com.hometownrooted.dao.ServiceBookingDAO;
import com.hometownrooted.entity.ServiceBooking;
import com.hometownrooted.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ServiceServlet extends HttpServlet {

    private ServiceDAO serviceDAO = new ServiceDAO();
    private ServiceBookingDAO bookingDAO = new ServiceBookingDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        if ("/services".equals(pathInfo)) {
            getServices(req, resp);
        } else if ("/bookings".equals(pathInfo)) {
            getBookings(req, resp);
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid request path"));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        if ("/bookings".equals(pathInfo)) {
            createBooking(req, resp);
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("Invalid request path"));
        }
    }

    private void getServices(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pageStr = req.getParameter("page");
        String pageSizeStr = req.getParameter("pageSize");
        String category = req.getParameter("type");  // 前端传的是type，对应数据库的category
        String keyword = req.getParameter("keyword");

        int page = pageStr != null && !pageStr.isEmpty() ? Integer.parseInt(pageStr) : 1;
        int pageSize = pageSizeStr != null && !pageSizeStr.isEmpty() ? Integer.parseInt(pageSizeStr) : 10;

        JsonUtil.writeJsonResponse(resp, JsonUtil.success(serviceDAO.findServices(page, pageSize, category, keyword)));
    }

    private void getBookings(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pageStr = req.getParameter("page");
        String pageSizeStr = req.getParameter("pageSize");

        int page = pageStr != null && !pageStr.isEmpty() ? Integer.parseInt(pageStr) : 1;
        int pageSize = pageSizeStr != null && !pageSizeStr.isEmpty() ? Integer.parseInt(pageSizeStr) : 10;

        JsonUtil.writeJsonResponse(resp, JsonUtil.success(bookingDAO.findByPage(page, pageSize)));
    }

    private void createBooking(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String serviceName = req.getParameter("serviceName");

        if (serviceName == null || serviceName.isEmpty()) {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("服务名称不能为空"));
            return;
        }

        ServiceBooking booking = new ServiceBooking();
        booking.setUserId(1);  // 临时使用固定用户ID，应该从token中获取
        booking.setServiceName(serviceName);
        booking.setStatus("pending");

        Integer id = bookingDAO.save(booking);

        if (id != null) {
            booking.setId(id);
            JsonUtil.writeJsonResponse(resp, JsonUtil.success(booking));
        } else {
            JsonUtil.writeJsonResponse(resp, JsonUtil.error("预约失败"));
        }
    }
}
