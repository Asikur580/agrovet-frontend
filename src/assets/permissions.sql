-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 08, 2025 at 10:30 PM
-- Server version: 10.6.18-MariaDB
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mollapro_project-preview`
--

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(8, 'Developer', 'sanctum', '2025-01-25 18:38:02', '2025-01-25 18:38:02'),
(9, 'Dashboard-page', 'sanctum', '2025-01-25 18:38:19', '2025-01-25 18:48:02'),
(10, 'Profile-page', 'sanctum', '2025-01-25 18:38:25', '2025-01-25 18:48:11'),
(11, 'Permission-page', 'sanctum', '2025-01-25 18:38:31', '2025-02-05 21:20:45'),
(12, 'Designation-page', 'sanctum', '2025-01-25 18:38:37', '2025-01-25 18:48:41'),
(13, 'Employee-page', 'sanctum', '2025-01-25 18:50:46', '2025-02-05 21:27:10'),
(14, 'User-page', 'sanctum', '2025-01-25 18:51:04', '2025-02-05 22:09:25'),
(15, 'Supplier-page', 'sanctum', '2025-01-25 18:51:25', '2025-02-05 22:13:27'),
(16, 'Brand-page', 'sanctum', '2025-01-25 18:51:49', '2025-02-05 22:23:15'),
(17, 'Category-page', 'sanctum', '2025-01-25 18:54:00', '2025-02-05 22:27:36'),
(18, 'Product-page', 'sanctum', '2025-01-25 18:54:19', '2025-02-05 22:36:43'),
(19, 'Customer-page', 'sanctum', '2025-01-25 18:54:51', '2025-02-05 22:43:25'),
(20, 'Product settings', 'sanctum', '2025-01-25 18:56:52', '2025-01-25 18:56:52'),
(21, 'Order-page', 'sanctum', '2025-01-25 18:57:06', '2025-02-05 22:50:53'),
(22, 'Order-create-page', 'sanctum', '2025-01-25 18:57:21', '2025-02-05 22:53:29'),
(23, 'Sale-page', 'sanctum', '2025-01-25 18:58:41', '2025-02-05 22:55:07'),
(24, 'Sale-create-page', 'sanctum', '2025-01-25 18:58:56', '2025-02-05 23:00:19'),
(25, 'Cost-categories-page', 'sanctum', '2025-01-25 18:59:17', '2025-01-25 18:59:17'),
(26, 'Office-cost-page', 'sanctum', '2025-01-25 18:59:40', '2025-01-25 18:59:40'),
(29, 'Employee-cost-history', 'sanctum', '2025-01-26 10:26:44', '2025-02-05 21:37:06'),
(30, 'Employee-salary-history', 'sanctum', '2025-01-26 10:27:55', '2025-02-05 21:37:52'),
(31, 'Supplier-details-page', 'sanctum', '2025-01-26 10:28:34', '2025-02-05 22:16:26'),
(32, 'Supplier-payment-history', 'sanctum', '2025-01-26 10:29:00', '2025-02-05 22:18:38'),
(33, 'Customer-details-page', 'sanctum', '2025-01-26 10:29:26', '2025-02-05 22:46:49'),
(34, 'Customer-payment-history', 'sanctum', '2025-01-26 10:29:52', '2025-01-26 10:29:52'),
(35, 'Product-details-page', 'sanctum', '2025-01-26 10:30:26', '2025-02-05 22:39:37'),
(36, 'Designation-create', 'sanctum', '2025-01-26 22:17:08', '2025-01-26 22:17:21'),
(37, 'Designation-edit', 'sanctum', '2025-01-26 22:17:28', '2025-01-26 22:17:28'),
(38, 'Designation-delete', 'sanctum', '2025-01-26 22:17:38', '2025-01-26 22:17:38'),
(39, 'Employee-create', 'sanctum', '2025-01-26 22:18:10', '2025-02-05 21:29:46'),
(40, 'Employee-edit', 'sanctum', '2025-01-26 22:18:17', '2025-02-05 21:30:49'),
(41, 'Employee-delete', 'sanctum', '2025-01-26 22:18:28', '2025-02-05 21:31:04'),
(42, 'User-create', 'sanctum', '2025-01-26 22:18:50', '2025-02-05 22:10:22'),
(43, 'User-edit', 'sanctum', '2025-01-26 22:19:27', '2025-02-05 22:11:07'),
(44, 'User-delete', 'sanctum', '2025-01-26 22:19:34', '2025-02-05 22:11:34'),
(45, 'Supplier-create', 'sanctum', '2025-01-26 22:20:16', '2025-02-05 22:14:04'),
(46, 'Supplier-edit', 'sanctum', '2025-01-26 22:20:29', '2025-02-05 22:14:33'),
(47, 'Supplier-delete', 'sanctum', '2025-01-26 22:20:44', '2025-02-05 22:14:50'),
(48, 'Brand-create', 'sanctum', '2025-01-26 22:22:56', '2025-02-05 22:23:38'),
(49, 'Brand-edit', 'sanctum', '2025-01-26 22:25:56', '2025-02-05 22:24:03'),
(50, 'Brand-delete', 'sanctum', '2025-01-26 22:26:04', '2025-02-05 22:24:20'),
(51, 'Category-create', 'sanctum', '2025-01-26 22:26:27', '2025-02-05 22:28:11'),
(52, 'Category-edit', 'sanctum', '2025-01-26 22:26:44', '2025-02-05 22:28:39'),
(53, 'Category-delete', 'sanctum', '2025-01-26 22:26:58', '2025-02-05 22:28:57'),
(54, 'Product-create', 'sanctum', '2025-01-26 22:31:20', '2025-02-05 22:37:43'),
(55, 'Product-edit', 'sanctum', '2025-01-26 22:31:25', '2025-02-05 22:38:07'),
(56, 'Product-delete', 'sanctum', '2025-01-26 22:31:33', '2025-02-05 22:38:27'),
(57, 'Customer-create', 'sanctum', '2025-01-26 22:31:55', '2025-02-05 22:44:11'),
(58, 'Customer-edit', 'sanctum', '2025-01-26 22:32:01', '2025-02-05 22:44:34'),
(59, 'Customer-delete', 'sanctum', '2025-01-26 22:32:08', '2025-02-05 22:44:53'),
(60, 'Order-create', 'sanctum', '2025-01-26 22:32:37', '2025-02-05 22:54:00'),
(61, 'Order-edit', 'sanctum', '2025-01-26 22:32:43', '2025-02-05 22:52:20'),
(62, 'Order-delete', 'sanctum', '2025-01-26 22:32:51', '2025-02-05 22:52:39'),
(66, 'Sale-create', 'sanctum', '2025-01-26 22:35:01', '2025-02-05 22:56:06'),
(67, 'Sale-edit', 'sanctum', '2025-01-26 22:35:13', '2025-02-05 22:57:04'),
(68, 'Sale-delete', 'sanctum', '2025-01-26 22:35:20', '2025-02-05 22:57:28'),
(69, 'Cost-categories-create', 'sanctum', '2025-01-26 22:35:49', '2025-01-26 22:35:49'),
(70, 'Cost-categories-edit', 'sanctum', '2025-01-26 22:35:59', '2025-01-26 22:35:59'),
(71, 'Cost-categories-delete', 'sanctum', '2025-01-26 22:36:20', '2025-01-26 22:36:20'),
(72, 'Office-cost-create', 'sanctum', '2025-01-26 22:36:35', '2025-01-26 22:36:35'),
(73, 'Office-cost-edit', 'sanctum', '2025-01-26 22:36:44', '2025-01-26 22:36:44'),
(74, 'Office-cost-delete', 'sanctum', '2025-01-26 22:36:57', '2025-01-26 22:36:57'),
(75, 'Permission-create', 'sanctum', '2025-01-26 22:44:25', '2025-02-05 21:22:23'),
(76, 'Permission-edit', 'sanctum', '2025-01-26 22:44:37', '2025-02-05 21:24:03'),
(77, 'Permission-delete', 'sanctum', '2025-01-26 22:44:44', '2025-02-05 21:23:01'),
(80, 'Employee-cost-create', 'sanctum', '2025-01-27 08:24:15', '2025-02-05 21:36:39'),
(81, 'Employee-salary-create', 'sanctum', '2025-01-27 08:25:21', '2025-02-05 21:37:38'),
(82, 'Supplier-payment-create', 'sanctum', '2025-01-27 08:44:51', '2025-02-05 22:18:17'),
(83, 'Product-in', 'sanctum', '2025-01-27 08:50:01', '2025-02-05 22:38:55'),
(84, 'Product-out', 'sanctum', '2025-01-27 08:51:14', '2025-02-05 22:39:09'),
(85, 'Customer-payment-create', 'sanctum', '2025-01-27 08:54:35', '2025-01-27 08:54:35'),
(86, 'Sale-invoice', 'sanctum', '2025-01-27 08:57:41', '2025-02-05 22:59:27'),
(87, 'Product-print', 'sanctum', '2025-01-27 15:30:31', '2025-02-05 22:37:25'),
(88, 'Customer-print', 'sanctum', '2025-01-30 03:53:56', '2025-01-30 03:53:56'),
(89, 'Brand-details-page', 'sanctum', '2025-02-05 04:08:09', '2025-02-05 22:25:31'),
(90, 'Brand-details-print', 'sanctum', '2025-02-05 04:33:14', '2025-02-05 04:33:14'),
(91, 'Category-details-page', 'sanctum', '2025-02-05 05:15:21', '2025-02-05 22:29:32'),
(92, 'Category-details-print', 'sanctum', '2025-02-05 21:13:23', '2025-02-05 21:13:23'),
(93, 'Customer-details-print', 'sanctum', '2025-02-05 21:14:44', '2025-02-05 21:14:44'),
(95, 'Employee-relation-create', 'sanctum', '2025-02-05 21:33:34', '2025-02-05 21:33:34'),
(96, 'Employee-details-page', 'sanctum', '2025-02-05 21:34:41', '2025-02-05 21:34:41'),
(97, 'Employee-details-print', 'sanctum', '2025-02-05 22:05:41', '2025-02-05 22:05:41'),
(98, 'Supplier-details-print', 'sanctum', '2025-02-05 22:20:06', '2025-02-05 22:20:06'),
(99, 'Product-details-print', 'sanctum', '2025-02-05 22:40:46', '2025-02-05 22:40:46'),
(100, 'Sale-from-order', 'sanctum', '2025-02-05 22:58:52', '2025-02-05 22:58:52'),
(101, 'Customer-payment-print', 'sanctum', '2025-02-06 04:27:28', '2025-02-06 04:27:28'),
(102, 'Supplier-payment-print', 'sanctum', '2025-02-06 04:27:40', '2025-02-06 04:27:40'),
(103, 'Employee-cost-print', 'sanctum', '2025-02-06 04:40:35', '2025-02-06 04:40:35'),
(105, 'Employee-salary-print', 'sanctum', '2025-02-06 05:08:55', '2025-02-06 05:08:55'),
(106, 'Office-cost-print', 'sanctum', '2025-02-06 05:16:11', '2025-02-06 05:16:11'),
(107, 'Employee-cost-category-page', 'sanctum', '2025-02-06 12:39:33', '2025-02-06 12:39:33'),
(108, 'Employee-cost-category-create', 'sanctum', '2025-02-06 12:39:51', '2025-02-06 12:39:51'),
(109, 'Employee-cost-category-edit', 'sanctum', '2025-02-06 12:39:57', '2025-02-06 12:39:57'),
(110, 'Employee-cost-category-delete', 'sanctum', '2025-02-06 12:40:03', '2025-02-06 12:40:03'),
(111, 'Sms', 'sanctum', '2025-02-08 02:55:33', '2025-02-08 02:55:33'),
(112, 'Sms-send-anyone-page', 'sanctum', '2025-02-08 02:55:55', '2025-02-08 02:57:52'),
(113, 'Sms-send-everyone-page', 'sanctum', '2025-02-08 02:56:06', '2025-02-08 02:57:06'),
(114, 'Sms-template-page', 'sanctum', '2025-02-08 02:56:18', '2025-02-08 02:56:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
