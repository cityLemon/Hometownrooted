-- 清空所有表（保留数据库）
SET FOREIGN_KEY_CHECKS = 0;

-- 删除所有表
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS esg_reports;
DROP TABLE IF EXISTS charity_projects;
DROP TABLE IF EXISTS policies;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS convenience_services;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS mall_products;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS time_bank_records;
DROP TABLE IF EXISTS service_bookings;
DROP TABLE IF EXISTS emergency_records;
DROP TABLE IF EXISTS health_profiles;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 现在可以重新导入schema.sql
