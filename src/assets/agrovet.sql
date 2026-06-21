-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 07, 2025 at 02:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agrovet`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Kessler, Hagenes and Torphy', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(2, 'Murphy-Schimmel', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(3, 'Adams, Boyer and Swaniawski', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(4, 'DuBuque PLC', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(5, 'Infinix', '2025-01-25 04:33:07', '2025-02-06 19:15:03'),
(6, 'Simonis, Runolfsson and Turcotte', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(7, 'Wisoky LLC', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(8, 'Bechtelar-Cronin', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(9, 'Brown-Kshlerin', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(10, 'Apple', '2025-01-25 04:33:07', '2025-02-06 19:07:48'),
(11, 'Chocomas', '2025-02-06 19:08:23', '2025-02-06 19:08:31');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Phone', '2025-01-25 04:33:07', '2025-02-06 19:12:25'),
(2, 'iste', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(3, 'dolorum', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(4, 'non', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(5, 'qui', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(6, 'perferendis', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(7, 'similique', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(8, 'ratione', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(9, 'perspiciatis', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(10, 'explicabo', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(11, 'Nothing', '2025-02-06 19:12:35', '2025-02-06 19:12:44');

-- --------------------------------------------------------

--
-- Table structure for table `costs`
--

CREATE TABLE `costs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cost_cat_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` double NOT NULL,
  `cost_date` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `costs`
--

INSERT INTO `costs` (`id`, `cost_cat_id`, `employee_id`, `amount`, `cost_date`, `created_at`, `updated_at`) VALUES
(1, NULL, 10, 1499.25, '2007-08-17', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(2, NULL, 10, 159.19, '2012-08-25', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(3, NULL, 9, 54.81, '2003-07-11', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(4, 4, NULL, 4018.7, '2022-01-08', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(5, 2, NULL, 2690.74, '2018-07-04', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(6, 4, NULL, 1237.2, '2000-04-22', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(7, NULL, 7, 2114.01, '1973-11-05', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(8, 1, NULL, 3039.45, '1980-09-13', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(9, NULL, 3, 1015.54, '2011-06-11', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(10, 4, NULL, 2755.71, '2017-06-13', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(11, NULL, 10, 661.03, '1994-10-04', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(12, NULL, 3, 2020.04, '1989-05-04', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(13, NULL, 2, 4835.09, '1986-09-02', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(14, 5, NULL, 3382.68, '2020-08-22', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(15, NULL, 10, 534.24, '2003-05-05', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(16, 5, NULL, 4530.22, '2017-01-08', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(17, 7, NULL, 1483.79, '2016-05-02', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(18, 9, NULL, 2191.25, '2021-08-15', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(19, NULL, 2, 3963.09, '1990-05-12', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(20, NULL, 3, 1960.41, '1995-05-11', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(22, NULL, 12, 22000, '2025-01-30', '2025-01-25 05:01:58', '2025-01-25 05:01:58'),
(23, NULL, 3, 1000, '2025-01-27', '2025-01-26 10:20:48', '2025-01-26 10:20:48'),
(24, NULL, 3, 10, '2025-02-25', '2025-02-06 19:31:22', '2025-02-06 19:31:22'),
(25, NULL, 3, 1, '2025-02-28', '2025-02-06 19:31:55', '2025-02-06 19:31:55'),
(26, NULL, 3, 10, '2025-02-28', '2025-02-06 19:36:18', '2025-02-06 19:36:18');

-- --------------------------------------------------------

--
-- Table structure for table `cost_categories`
--

CREATE TABLE `cost_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cost_categories`
--

INSERT INTO `cost_categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'unde', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(2, 'eius', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(3, 'necessitatibus', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(4, 'esse', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(5, 'voluptatem', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(6, 'quis', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(7, 'rerum', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(8, 'quisquam', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(9, 'delectus', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(10, 'sit', '2025-01-25 04:33:08', '2025-01-25 04:33:08');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `proprietor_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `employee_id`, `customer_name`, `proprietor_name`, `phone`, `address`, `image`, `created_at`, `updated_at`) VALUES
(1, 9, 'Cremin, Cummerata and Doyle', 'Lavina Fahey', '+14345136411', '9027 Rossie Prairie\nKemmerhaven, RI 35062', NULL, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(2, 4, 'Stoltenberg, Hettinger and Schaden', 'Devon Towne', '(719) 823-5892', '874 Vicente Junctions\nWest Mittiebury, DE 99333-2412', NULL, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(3, 6, 'Schuppe, Boyer and Heidenreich', 'Julie Koelpin', '+1.838.682.9779', '3728 Batz Forks\nNorth Jovani, LA 76325-3949', 'https://via.placeholder.com/640x480.png/001199?text=esse', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(4, 3, 'Morar, Hyatt and Kiehn', 'Santiago Shields Sr.', '(650) 200-1860', '8370 Stacy Plains\nGeneralfurt, MI 17744', 'https://via.placeholder.com/640x480.png/00bb22?text=nemo', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(5, 6, 'Strosin-Cummerata', 'Prof. Chadrick Daniel III', '458.640.1752', '399 Gabriel Estate Apt. 569\nLegrosview, LA 58028', 'https://via.placeholder.com/640x480.png/00aaff?text=et', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(6, 7, 'Pagac, Borer and West', 'Prof. Irving Monahan DDS', '346-202-5945', '137 Esta Pike Apt. 299\nNew Marcos, NE 31667-5896', NULL, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(7, 7, 'Davis LLC', 'Dr. Mariane Larkin DVM', '+1.857.348.5193', '24323 Lebsack Forges Suite 562\nClementineshire, AL 18315', NULL, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(8, 4, 'Ward, Muller and Ebert', 'Crystal Daniel', '+1.484.415.5661', '8648 Auer Ramp\nKylerfurt, AL 31342-9093', 'https://via.placeholder.com/640x480.png/00ffdd?text=occaecati', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(9, 5, 'Lesch, Mueller and Terry', 'Lonzo Trantow', '+1-947-533-6169', '231 Rath Extensions Suite 144\nNorth Moshefort, AZ 97107-0357', 'https://via.placeholder.com/640x480.png/004499?text=necessitatibus', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(10, 7, 'Rath Inc', 'Mr. Guido Lowe DVM', '262-952-3926', '592 Mohammed Neck Apt. 015\nPort Raina, TN 14964', NULL, '2025-01-25 04:33:07', '2025-01-25 04:33:07');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'copy writer', '2025-01-25 04:33:04', '2025-02-06 19:18:48'),
(2, 'Geological Data Technician', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(3, 'Travel Clerk', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(4, 'Artist', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(5, 'Farm Labor Contractor', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(6, 'Plumber OR Pipefitter OR Steamfitter', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(7, 'Pharmacy Aide', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(8, 'Flight Attendant', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(9, 'Fabric Pressers', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(10, 'Nuclear Power Reactor Operator', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(11, 'admin', NULL, NULL),
(12, 'officer', '2025-01-25 04:50:21', '2025-01-25 04:50:21'),
(13, 'manager', '2025-01-25 04:50:27', '2025-01-25 04:50:27'),
(14, 'rsm', '2025-01-25 04:50:34', '2025-01-25 04:50:34'),
(16, 'nothing', '2025-02-06 19:18:53', '2025-02-06 19:19:01');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` int(11) NOT NULL,
  `designation_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `territory` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `national_id` varchar(255) DEFAULT NULL,
  `blood_group` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `credit_limit` double NOT NULL DEFAULT 0,
  `basic_salary` double NOT NULL DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `status` enum('active','deactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_id`, `designation_id`, `name`, `phone`, `territory`, `district`, `national_id`, `blood_group`, `image`, `credit_limit`, `basic_salary`, `created_by`, `status`, `created_at`, `updated_at`) VALUES
(1, 2616, 8, 'Daisy Hyatt', '607-284-9888', 'New Retachester', 'Rhode Island', '896851352502', 'B+', 'https://via.placeholder.com/640x480.png/001199?text=inventore', 11315.53, 28513.38, 1, 'deactive', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(2, 9442, 4, 'Keanu Grady', '1-503-360-6681', 'Haileyton', 'Hawaii', NULL, NULL, 'https://via.placeholder.com/640x480.png/0011aa?text=eos', 11942.97, 11579.91, 1, 'deactive', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(3, 3486, 1, 'Ellsworth Nolan', '(503) 912-0537', 'North Marceloland', 'Massachusetts', '879489818236', 'AB+', 'employees/employee_3486_1737812843.jpg', 17599.45, 32738.4, 1, 'active', '2025-01-25 04:33:04', '2025-01-25 07:47:23'),
(4, 8788, 8, 'Vicenta Dietrich', '+1-229-783-3945', 'West Laurinestad', 'South Carolina', '137467550378', NULL, NULL, 10395.1, 46256.78, 1, 'active', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(5, 9627, 4, 'Godfrey Kerluke III', '(937) 405-7397', 'Norrisstad', 'West Virginia', NULL, 'B-', 'https://via.placeholder.com/640x480.png/0055cc?text=aperiam', 40111.65, 41645.7, 1, 'deactive', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(6, 1001, 8, 'Dr. Philip Pfannerstill III', '+1-779-419-4671', 'South Wilsonport', 'Louisiana', '192228829818', 'A-', NULL, 9316.08, 21638.04, 1, 'active', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(7, 2976, 7, 'Jonathon Renner II', '+1 (541) 867-1409', 'Thielhaven', 'Utah', '204013759095', NULL, 'https://via.placeholder.com/640x480.png/00ff66?text=ipsa', 48663.85, 16459.56, 1, 'deactive', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(8, 2927, 9, 'Katelyn Fisher II', '501-946-2003', 'West Kellimouth', 'Georgia', '139396832928', 'A+', 'https://via.placeholder.com/640x480.png/0088ff?text=sit', 17853.04, 47502.27, 1, 'active', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(9, 4677, 6, 'Chadrick Batz', '+12188240305', 'South Aron', 'Oklahoma', NULL, 'B+', 'https://via.placeholder.com/640x480.png/004488?text=ipsa', 11741.58, 15591.79, 1, 'active', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(10, 3002, 7, 'Bartholome Doyle DVM', '+1 (217) 488-7066', 'Lake Greta', 'Oklahoma', NULL, 'O-', 'https://via.placeholder.com/640x480.png/004499?text=et', 31147.5, 30622.93, 1, 'deactive', '2025-01-25 04:33:04', '2025-01-25 04:33:04'),
(11, 12, 11, 'Admin', '0123456789', 'Coat', 'Rajshahi', 'N/A', 'N/A', 'employees/employee_12_1738130564.png', 0, 10000, 1, 'active', NULL, '2025-01-29 00:02:45'),
(12, 1254, 12, 'Alif', '01234567890', 'Horogram', 'Rajshahi', '125874', 'N/A', 'employees/employee_1254_1737802493.jpg', 0, 10000, 11, 'active', '2025-01-25 04:53:53', '2025-01-25 14:02:21'),
(13, 5, 13, 'Mujahid', '01234567809', 'Rajabari', 'Rajshahi', 'N/A', 'N/A', NULL, 0, 10000, 11, 'active', '2025-01-25 04:56:06', '2025-01-25 14:02:06'),
(14, 3, 14, 'Efty', '01234567009', 'Rajshahi', 'Rajshahi', 'N/A', 'N/A', NULL, 0, 10000, 11, 'active', '2025-01-25 04:57:35', '2025-01-25 14:01:49'),
(15, 2007, 12, 'Al jubair shovon', '01767692422', 'Horogram', 'Rajshahi', '1510350596', 'N/A', NULL, 100000, 10000, 11, 'active', '2025-02-05 09:29:05', '2025-02-05 09:29:17');

-- --------------------------------------------------------

--
-- Table structure for table `employee_cost_categories`
--

CREATE TABLE `employee_cost_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_cost_categories`
--

INSERT INTO `employee_cost_categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(4, 'Transport', '2025-02-06 19:01:58', '2025-02-06 19:01:58'),
(5, 'House rent', '2025-02-06 19:02:06', '2025-02-06 19:02:06'),
(6, 'Treatment', '2025-02-06 19:02:10', '2025-02-06 19:02:10');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoiceId` varchar(255) NOT NULL,
  `cust_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `total_item` int(11) NOT NULL,
  `total_price` double NOT NULL,
  `discount` double NOT NULL DEFAULT 0,
  `less` double NOT NULL DEFAULT 0,
  `grand_total` double NOT NULL,
  `paid` double NOT NULL DEFAULT 0,
  `due` double NOT NULL DEFAULT 0,
  `sale_date` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoiceId`, `cust_id`, `employee_id`, `total_item`, `total_price`, `discount`, `less`, `grand_total`, `paid`, `due`, `sale_date`, `created_at`, `updated_at`) VALUES
(1, 'INV-9098', 4, 8, 3, 2080.88, 51.68, 33.25, 1995.95, 181.37, 1899.51, '1983-02-23', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(2, 'INV-8862', 8, 6, 3, 1985.89, 74.03, 24.09, 1887.77, 132.7, 1853.19, '1986-11-05', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(3, 'INV-2062', 9, 2, 5, 4516.92, 17.67, 28.77, 4470.48, 733.02, 3783.9, '2013-01-20', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(4, 'INV-4008', 7, 10, 2, 1285.84, 3.76, 1.48, 1280.6, 99.64, 1186.2, '1983-01-03', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(5, 'INV-7400', 4, 10, 3, 1250.24, 98.72, 46.59, 1104.93, 457.67, 792.57, '2020-06-20', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(6, 'INV-5783', 1, 8, 1, 586.46, 15.44, 34.14, 536.88, 456.21, 0, '1980-03-20', '2025-01-25 04:33:08', '2025-01-25 08:32:14'),
(7, 'INV-8349', 1, 4, 5, 3169.75, 27.21, 31.99, 3110.55, 230.09, 1790.41, '1986-02-07', '2025-01-25 04:33:08', '2025-02-06 09:05:51'),
(8, 'INV-5677', 4, 1, 4, 3982.86, 72.32, 23.63, 3886.91, 664.73, 3318.13, '1986-03-12', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(9, 'INV-7971', 5, 1, 4, 4482, 12.77, 29.74, 4439.49, 433.68, 4048.32, '2015-01-26', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(10, 'INV-1164', 5, 4, 5, 4292.02, 62.57, 24.15, 4205.3, 843.05, 3448.97, '1996-04-26', '2025-01-25 04:33:08', '2025-01-25 04:33:08');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_products`
--

CREATE TABLE `invoice_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` double NOT NULL,
  `due_quantity` int(11) NOT NULL DEFAULT 0,
  `bonus_qty` int(11) NOT NULL DEFAULT 0,
  `price_type` enum('tp','flat') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_products`
--

INSERT INTO `invoice_products` (`id`, `invoice_id`, `product_id`, `quantity`, `unit_price`, `due_quantity`, `bonus_qty`, `price_type`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 3, 195.01, 0, 1, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(2, 1, 10, 3, 322.57, 0, 3, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(3, 1, 9, 1, 528.14, 1, 3, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(4, 2, 6, 2, 572.22, 1, 0, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(5, 2, 13, 3, 131.81, 0, 3, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(6, 2, 16, 2, 223.01, 2, 2, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(7, 3, 15, 1, 235.4, 0, 1, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(8, 3, 19, 3, 219.29, 2, 3, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(9, 3, 6, 3, 572.22, 1, 1, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(10, 3, 10, 1, 322.57, 2, 3, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(11, 3, 9, 3, 528.14, 1, 1, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(12, 4, 3, 3, 271.68, 2, 3, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(13, 4, 15, 2, 235.4, 0, 3, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(14, 5, 8, 1, 558.46, 1, 1, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(15, 5, 14, 1, 220.98, 2, 0, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(16, 5, 15, 2, 235.4, 0, 1, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(17, 6, 12, 2, 293.23, 4, 0, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(18, 7, 9, 2, 528.14, 1, 2, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(19, 7, 15, 1, 235.4, 0, 1, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(20, 7, 8, 2, 558.46, 0, 2, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(21, 7, 10, 1, 322.57, 2, 1, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(22, 7, 19, 2, 219.29, 4, 2, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(23, 8, 8, 2, 558.46, 2, 3, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(24, 8, 10, 2, 322.57, 2, 1, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(25, 8, 2, 3, 536.64, 2, 2, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(26, 8, 7, 2, 305.44, 4, 3, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(27, 9, 9, 3, 528.14, 1, 1, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(28, 9, 6, 3, 572.22, 1, 0, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(29, 9, 5, 3, 205.13, 2, 3, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(30, 9, 11, 1, 565.53, 1, 2, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(31, 10, 2, 3, 536.64, 2, 2, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(32, 10, 20, 1, 324.26, 0, 2, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(33, 10, 11, 3, 565.53, 2, 0, 'flat', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(34, 10, 19, 1, 219.29, 0, 3, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(35, 10, 14, 2, 220.98, 1, 2, 'tp', '2025-01-25 04:33:08', '2025-01-25 04:33:08');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2024_11_12_150923_create_personal_access_tokens_table', 1),
(4, '2024_11_12_151503_create_designations_table', 1),
(5, '2024_11_14_131515_create_employees_table', 1),
(6, '2024_11_14_133127_create_users_table', 1),
(7, '2024_11_15_122605_create_relations_table', 1),
(8, '2024_11_26_030504_create_customers_table', 1),
(9, '2024_11_26_081021_create_brands_table', 1),
(10, '2024_11_26_083448_create_categories_table', 1),
(11, '2024_11_26_091036_create_suppliers_table', 1),
(12, '2024_11_26_102954_create_products_table', 1),
(13, '2024_11_26_120653_create_stock_in_outs_table', 1),
(14, '2024_12_11_122728_create_orders_table', 1),
(15, '2024_12_11_123021_create_order_products_table', 1),
(16, '2024_12_16_060045_create_invoices_table', 1),
(17, '2024_12_16_060457_create_invoice_products_table', 1),
(18, '2025_01_08_062646_create_cost_categories_table', 1),
(19, '2025_01_08_063227_create_payments_table', 1),
(20, '2025_01_08_130537_create_costs_table', 1),
(21, '2025_01_15_142008_create_permission_tables', 1),
(22, '2025_01_20_062003_create_salaries_table', 1),
(23, '2025_01_07_130918_create_employee_cost_categories_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_permissions`
--

INSERT INTO `model_has_permissions` (`permission_id`, `model_type`, `model_id`) VALUES
(9, 'App\\Models\\User', 5),
(9, 'App\\Models\\User', 11),
(9, 'App\\Models\\User', 14),
(9, 'App\\Models\\User', 15),
(10, 'App\\Models\\User', 11),
(11, 'App\\Models\\User', 11),
(12, 'App\\Models\\User', 11),
(13, 'App\\Models\\User', 11),
(14, 'App\\Models\\User', 11),
(15, 'App\\Models\\User', 11),
(16, 'App\\Models\\User', 11),
(17, 'App\\Models\\User', 11),
(18, 'App\\Models\\User', 11),
(19, 'App\\Models\\User', 11),
(20, 'App\\Models\\User', 11),
(21, 'App\\Models\\User', 11),
(22, 'App\\Models\\User', 11),
(23, 'App\\Models\\User', 11),
(24, 'App\\Models\\User', 11),
(25, 'App\\Models\\User', 11),
(26, 'App\\Models\\User', 11),
(29, 'App\\Models\\User', 11),
(30, 'App\\Models\\User', 11),
(31, 'App\\Models\\User', 11),
(32, 'App\\Models\\User', 11),
(33, 'App\\Models\\User', 11),
(34, 'App\\Models\\User', 11),
(35, 'App\\Models\\User', 11),
(36, 'App\\Models\\User', 11),
(37, 'App\\Models\\User', 11),
(38, 'App\\Models\\User', 11),
(39, 'App\\Models\\User', 11),
(40, 'App\\Models\\User', 11),
(41, 'App\\Models\\User', 11),
(42, 'App\\Models\\User', 11),
(43, 'App\\Models\\User', 11),
(44, 'App\\Models\\User', 11),
(45, 'App\\Models\\User', 11),
(46, 'App\\Models\\User', 11),
(47, 'App\\Models\\User', 11),
(48, 'App\\Models\\User', 11),
(49, 'App\\Models\\User', 11),
(50, 'App\\Models\\User', 11),
(51, 'App\\Models\\User', 11),
(52, 'App\\Models\\User', 11),
(53, 'App\\Models\\User', 11),
(54, 'App\\Models\\User', 11),
(55, 'App\\Models\\User', 11),
(56, 'App\\Models\\User', 11),
(57, 'App\\Models\\User', 11),
(58, 'App\\Models\\User', 11),
(59, 'App\\Models\\User', 11),
(60, 'App\\Models\\User', 11),
(61, 'App\\Models\\User', 11),
(62, 'App\\Models\\User', 11),
(66, 'App\\Models\\User', 11),
(67, 'App\\Models\\User', 11),
(68, 'App\\Models\\User', 11),
(69, 'App\\Models\\User', 11),
(70, 'App\\Models\\User', 11),
(71, 'App\\Models\\User', 11),
(72, 'App\\Models\\User', 11),
(73, 'App\\Models\\User', 11),
(74, 'App\\Models\\User', 11),
(75, 'App\\Models\\User', 11),
(76, 'App\\Models\\User', 11),
(77, 'App\\Models\\User', 11),
(80, 'App\\Models\\User', 11),
(81, 'App\\Models\\User', 11),
(82, 'App\\Models\\User', 11),
(83, 'App\\Models\\User', 11),
(84, 'App\\Models\\User', 11),
(85, 'App\\Models\\User', 11),
(86, 'App\\Models\\User', 11),
(87, 'App\\Models\\User', 11),
(88, 'App\\Models\\User', 11),
(89, 'App\\Models\\User', 11),
(90, 'App\\Models\\User', 11),
(91, 'App\\Models\\User', 11),
(92, 'App\\Models\\User', 11),
(93, 'App\\Models\\User', 11),
(95, 'App\\Models\\User', 11),
(96, 'App\\Models\\User', 11),
(97, 'App\\Models\\User', 11),
(98, 'App\\Models\\User', 11),
(99, 'App\\Models\\User', 11),
(100, 'App\\Models\\User', 11),
(101, 'App\\Models\\User', 11),
(102, 'App\\Models\\User', 11),
(103, 'App\\Models\\User', 11),
(105, 'App\\Models\\User', 11),
(106, 'App\\Models\\User', 11),
(107, 'App\\Models\\User', 11),
(108, 'App\\Models\\User', 11),
(109, 'App\\Models\\User', 11),
(110, 'App\\Models\\User', 11);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cust_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `cust_id`, `employee_id`, `created_at`, `updated_at`) VALUES
(1, 9, 4, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(2, 3, 8, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(3, 1, 2, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(4, 7, 2, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(5, 10, 7, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(6, 4, 3, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(7, 3, 7, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(8, 7, 5, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(9, 6, 5, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(10, 5, 8, '2025-01-25 04:33:07', '2025-01-25 04:33:07');

-- --------------------------------------------------------

--
-- Table structure for table `order_products`
--

CREATE TABLE `order_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` double NOT NULL,
  `bonus_qty` int(11) NOT NULL DEFAULT 0,
  `price_type` enum('tp','flat') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_products`
--

INSERT INTO `order_products` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `bonus_qty`, `price_type`, `created_at`, `updated_at`) VALUES
(1, 1, 7, 1, 305.44, 3, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(2, 2, 11, 3, 565.53, 3, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(3, 2, 8, 1, 558.46, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(4, 3, 10, 2, 322.57, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(5, 3, 7, 2, 305.44, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(6, 3, 18, 1, 201.57, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(7, 3, 20, 1, 324.26, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(8, 4, 4, 3, 102.64, 3, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(9, 4, 19, 3, 219.29, 0, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(10, 4, 17, 3, 71.32, 0, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(11, 4, 7, 3, 305.44, 0, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(12, 5, 3, 2, 271.68, 1, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(13, 5, 5, 1, 205.13, 1, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(14, 5, 8, 1, 558.46, 3, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(15, 5, 20, 1, 324.26, 1, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(16, 5, 14, 1, 220.98, 3, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(17, 6, 5, 2, 205.13, 3, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(18, 6, 14, 3, 220.98, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(19, 6, 1, 2, 195.01, 3, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(20, 6, 20, 1, 324.26, 3, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(21, 7, 11, 2, 565.53, 3, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(22, 7, 5, 1, 205.13, 1, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(23, 7, 16, 2, 223.01, 2, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(24, 7, 19, 3, 219.29, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(25, 7, 10, 3, 322.57, 1, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(26, 8, 20, 1, 324.26, 3, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(27, 8, 5, 2, 205.13, 2, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(28, 8, 6, 3, 572.22, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(29, 9, 6, 3, 572.22, 1, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(30, 9, 18, 2, 201.57, 0, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(31, 9, 10, 2, 322.57, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(32, 9, 2, 3, 536.64, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(33, 9, 8, 2, 558.46, 1, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(34, 10, 18, 1, 201.57, 1, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(35, 10, 8, 1, 558.46, 0, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(36, 10, 6, 2, 572.22, 3, 'flat', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(37, 10, 13, 2, 131.81, 2, 'tp', '2025-01-25 04:33:07', '2025-01-25 04:33:07');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cust_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` double NOT NULL,
  `payment_method` enum('cash','check') NOT NULL,
  `payment_date` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `cust_id`, `employee_id`, `supplier_id`, `amount`, `payment_method`, `payment_date`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, 1, 600, 'check', '2017-07-19', '2025-01-25 04:33:08', '2025-01-25 07:54:55'),
(2, NULL, NULL, 6, 664.36, 'cash', '2023-11-18', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(3, NULL, NULL, 1, 647.47, 'check', '2003-10-12', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(4, NULL, NULL, 4, 781.2, 'check', '2003-04-09', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(5, 2, 3, NULL, 202.24, 'cash', '2009-02-02', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(6, NULL, NULL, 1, 436.96, 'check', '1979-06-19', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(7, NULL, NULL, 10, 232.1, 'check', '1977-05-17', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(8, 7, 8, NULL, 398.44, 'cash', '1976-08-01', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(9, NULL, NULL, 2, 393.59, 'cash', '2012-01-03', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(10, NULL, NULL, 2, 983.39, 'check', '1991-07-06', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(11, NULL, NULL, 7, 129.83, 'cash', '2012-03-10', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(12, NULL, NULL, 4, 202.3, 'cash', '2009-11-14', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(13, 7, 10, NULL, 665.67, 'check', '1983-02-12', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(14, NULL, NULL, 3, 119.96, 'check', '2003-12-14', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(15, 6, 2, NULL, 618.28, 'check', '1991-10-15', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(16, 10, 5, NULL, 887.03, 'check', '1998-01-01', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(17, 6, 10, NULL, 585.96, 'cash', '1971-01-01', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(18, NULL, NULL, 4, 783.93, 'check', '1981-09-06', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(19, NULL, NULL, 7, 724.48, 'cash', '2014-11-22', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(20, NULL, NULL, 8, 122.37, 'check', '1982-08-20', '2025-01-25 04:33:08', '2025-01-25 04:33:08'),
(21, NULL, NULL, 1, 638, 'cash', '2025-01-01', '2025-01-25 07:55:35', '2025-01-25 07:55:35'),
(22, 1, 9, NULL, 50, 'cash', '01-13-2025', '2025-01-25 08:13:11', '2025-01-25 08:13:11'),
(24, 1, 9, NULL, 50, 'cash', '01-13-2025', '2025-01-25 08:24:52', '2025-01-25 08:24:52'),
(25, 1, 9, NULL, 100, 'cash', '01-13-2025', '2025-01-25 08:28:24', '2025-01-25 08:28:24'),
(26, 1, 9, NULL, 100, 'cash', '01-13-2025', '2025-01-25 08:32:14', '2025-01-25 08:32:14'),
(27, 2, 4, NULL, 1000, 'cash', '2025-01-31', '2025-01-25 10:29:48', '2025-01-25 10:29:48'),
(28, 1, 9, NULL, 1000, 'cash', '2025-01-15', '2025-01-26 10:25:46', '2025-01-26 10:25:46'),
(36, NULL, NULL, 1, 1, 'cash', '2026-02-01', '2025-02-06 09:03:51', '2025-02-06 09:03:51'),
(37, 1, 9, NULL, 10, 'cash', '2026-02-02', '2025-02-06 09:05:51', '2025-02-06 09:05:51');

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
(8, 'Developer', 'sanctum', '2025-01-26 00:38:02', '2025-01-26 00:38:02'),
(9, 'Dashboard-page', 'sanctum', '2025-01-26 00:38:19', '2025-01-26 00:48:02'),
(10, 'Profile-page', 'sanctum', '2025-01-26 00:38:25', '2025-01-26 00:48:11'),
(11, 'Permission-page', 'sanctum', '2025-01-26 00:38:31', '2025-02-06 03:20:45'),
(12, 'Designation-page', 'sanctum', '2025-01-26 00:38:37', '2025-01-26 00:48:41'),
(13, 'Employee-page', 'sanctum', '2025-01-26 00:50:46', '2025-02-06 03:27:10'),
(14, 'User-page', 'sanctum', '2025-01-26 00:51:04', '2025-02-06 04:09:25'),
(15, 'Supplier-page', 'sanctum', '2025-01-26 00:51:25', '2025-02-06 04:13:27'),
(16, 'Brand-page', 'sanctum', '2025-01-26 00:51:49', '2025-02-06 04:23:15'),
(17, 'Category-page', 'sanctum', '2025-01-26 00:54:00', '2025-02-06 04:27:36'),
(18, 'Product-page', 'sanctum', '2025-01-26 00:54:19', '2025-02-06 04:36:43'),
(19, 'Customer-page', 'sanctum', '2025-01-26 00:54:51', '2025-02-06 04:43:25'),
(20, 'Product settings', 'sanctum', '2025-01-26 00:56:52', '2025-01-26 00:56:52'),
(21, 'Order-page', 'sanctum', '2025-01-26 00:57:06', '2025-02-06 04:50:53'),
(22, 'Order-create-page', 'sanctum', '2025-01-26 00:57:21', '2025-02-06 04:53:29'),
(23, 'Sale-page', 'sanctum', '2025-01-26 00:58:41', '2025-02-06 04:55:07'),
(24, 'Sale-create-page', 'sanctum', '2025-01-26 00:58:56', '2025-02-06 05:00:19'),
(25, 'Cost-categories-page', 'sanctum', '2025-01-26 00:59:17', '2025-01-26 00:59:17'),
(26, 'Office-cost-page', 'sanctum', '2025-01-26 00:59:40', '2025-01-26 00:59:40'),
(29, 'Employee-cost-history', 'sanctum', '2025-01-26 16:26:44', '2025-02-06 03:37:06'),
(30, 'Employee-salary-history', 'sanctum', '2025-01-26 16:27:55', '2025-02-06 03:37:52'),
(31, 'Supplier-details-page', 'sanctum', '2025-01-26 16:28:34', '2025-02-06 04:16:26'),
(32, 'Supplier-payment-history', 'sanctum', '2025-01-26 16:29:00', '2025-02-06 04:18:38'),
(33, 'Customer-details-page', 'sanctum', '2025-01-26 16:29:26', '2025-02-06 04:46:49'),
(34, 'Customer-payment-history', 'sanctum', '2025-01-26 16:29:52', '2025-01-26 16:29:52'),
(35, 'Product-details-page', 'sanctum', '2025-01-26 16:30:26', '2025-02-06 04:39:37'),
(36, 'Designation-create', 'sanctum', '2025-01-27 04:17:08', '2025-01-27 04:17:21'),
(37, 'Designation-edit', 'sanctum', '2025-01-27 04:17:28', '2025-01-27 04:17:28'),
(38, 'Designation-delete', 'sanctum', '2025-01-27 04:17:38', '2025-01-27 04:17:38'),
(39, 'Employee-create', 'sanctum', '2025-01-27 04:18:10', '2025-02-06 03:29:46'),
(40, 'Employee-edit', 'sanctum', '2025-01-27 04:18:17', '2025-02-06 03:30:49'),
(41, 'Employee-delete', 'sanctum', '2025-01-27 04:18:28', '2025-02-06 03:31:04'),
(42, 'User-create', 'sanctum', '2025-01-27 04:18:50', '2025-02-06 04:10:22'),
(43, 'User-edit', 'sanctum', '2025-01-27 04:19:27', '2025-02-06 04:11:07'),
(44, 'User-delete', 'sanctum', '2025-01-27 04:19:34', '2025-02-06 04:11:34'),
(45, 'Supplier-create', 'sanctum', '2025-01-27 04:20:16', '2025-02-06 04:14:04'),
(46, 'Supplier-edit', 'sanctum', '2025-01-27 04:20:29', '2025-02-06 04:14:33'),
(47, 'Supplier-delete', 'sanctum', '2025-01-27 04:20:44', '2025-02-06 04:14:50'),
(48, 'Brand-create', 'sanctum', '2025-01-27 04:22:56', '2025-02-06 04:23:38'),
(49, 'Brand-edit', 'sanctum', '2025-01-27 04:25:56', '2025-02-06 04:24:03'),
(50, 'Brand-delete', 'sanctum', '2025-01-27 04:26:04', '2025-02-06 04:24:20'),
(51, 'Category-create', 'sanctum', '2025-01-27 04:26:27', '2025-02-06 04:28:11'),
(52, 'Category-edit', 'sanctum', '2025-01-27 04:26:44', '2025-02-06 04:28:39'),
(53, 'Category-delete', 'sanctum', '2025-01-27 04:26:58', '2025-02-06 04:28:57'),
(54, 'Product-create', 'sanctum', '2025-01-27 04:31:20', '2025-02-06 04:37:43'),
(55, 'Product-edit', 'sanctum', '2025-01-27 04:31:25', '2025-02-06 04:38:07'),
(56, 'Product-delete', 'sanctum', '2025-01-27 04:31:33', '2025-02-06 04:38:27'),
(57, 'Customer-create', 'sanctum', '2025-01-27 04:31:55', '2025-02-06 04:44:11'),
(58, 'Customer-edit', 'sanctum', '2025-01-27 04:32:01', '2025-02-06 04:44:34'),
(59, 'Customer-delete', 'sanctum', '2025-01-27 04:32:08', '2025-02-06 04:44:53'),
(60, 'Order-create', 'sanctum', '2025-01-27 04:32:37', '2025-02-06 04:54:00'),
(61, 'Order-edit', 'sanctum', '2025-01-27 04:32:43', '2025-02-06 04:52:20'),
(62, 'Order-delete', 'sanctum', '2025-01-27 04:32:51', '2025-02-06 04:52:39'),
(66, 'Sale-create', 'sanctum', '2025-01-27 04:35:01', '2025-02-06 04:56:06'),
(67, 'Sale-edit', 'sanctum', '2025-01-27 04:35:13', '2025-02-06 04:57:04'),
(68, 'Sale-delete', 'sanctum', '2025-01-27 04:35:20', '2025-02-06 04:57:28'),
(69, 'Cost-categories-create', 'sanctum', '2025-01-27 04:35:49', '2025-01-27 04:35:49'),
(70, 'Cost-categories-edit', 'sanctum', '2025-01-27 04:35:59', '2025-01-27 04:35:59'),
(71, 'Cost-categories-delete', 'sanctum', '2025-01-27 04:36:20', '2025-01-27 04:36:20'),
(72, 'Office-cost-create', 'sanctum', '2025-01-27 04:36:35', '2025-01-27 04:36:35'),
(73, 'Office-cost-edit', 'sanctum', '2025-01-27 04:36:44', '2025-01-27 04:36:44'),
(74, 'Office-cost-delete', 'sanctum', '2025-01-27 04:36:57', '2025-01-27 04:36:57'),
(75, 'Permission-create', 'sanctum', '2025-01-27 04:44:25', '2025-02-06 03:22:23'),
(76, 'Permission-edit', 'sanctum', '2025-01-27 04:44:37', '2025-02-06 03:24:03'),
(77, 'Permission-delete', 'sanctum', '2025-01-27 04:44:44', '2025-02-06 03:23:01'),
(80, 'Employee-cost-create', 'sanctum', '2025-01-27 14:24:15', '2025-02-06 03:36:39'),
(81, 'Employee-salary-create', 'sanctum', '2025-01-27 14:25:21', '2025-02-06 03:37:38'),
(82, 'Supplier-payment-create', 'sanctum', '2025-01-27 14:44:51', '2025-02-06 04:18:17'),
(83, 'Product-in', 'sanctum', '2025-01-27 14:50:01', '2025-02-06 04:38:55'),
(84, 'Product-out', 'sanctum', '2025-01-27 14:51:14', '2025-02-06 04:39:09'),
(85, 'Customer-payment-create', 'sanctum', '2025-01-27 14:54:35', '2025-01-27 14:54:35'),
(86, 'Sale-invoice', 'sanctum', '2025-01-27 14:57:41', '2025-02-06 04:59:27'),
(87, 'Product-print', 'sanctum', '2025-01-27 21:30:31', '2025-02-06 04:37:25'),
(88, 'Customer-print', 'sanctum', '2025-01-30 09:53:56', '2025-01-30 09:53:56'),
(89, 'Brand-details-page', 'sanctum', '2025-02-05 10:08:09', '2025-02-06 04:25:31'),
(90, 'Brand-details-print', 'sanctum', '2025-02-05 10:33:14', '2025-02-05 10:33:14'),
(91, 'Category-details-page', 'sanctum', '2025-02-05 11:15:21', '2025-02-06 04:29:32'),
(92, 'Category-details-print', 'sanctum', '2025-02-06 03:13:23', '2025-02-06 03:13:23'),
(93, 'Customer-details-print', 'sanctum', '2025-02-06 03:14:44', '2025-02-06 03:14:44'),
(95, 'Employee-relation-create', 'sanctum', '2025-02-06 03:33:34', '2025-02-06 03:33:34'),
(96, 'Employee-details-page', 'sanctum', '2025-02-06 03:34:41', '2025-02-06 03:34:41'),
(97, 'Employee-details-print', 'sanctum', '2025-02-06 04:05:41', '2025-02-06 04:05:41'),
(98, 'Supplier-details-print', 'sanctum', '2025-02-06 04:20:06', '2025-02-06 04:20:06'),
(99, 'Product-details-print', 'sanctum', '2025-02-06 04:40:46', '2025-02-06 04:40:46'),
(100, 'Sale-from-order', 'sanctum', '2025-02-06 04:58:52', '2025-02-06 04:58:52'),
(101, 'Customer-payment-print', 'sanctum', '2025-02-06 10:27:28', '2025-02-06 10:27:28'),
(102, 'Supplier-payment-print', 'sanctum', '2025-02-06 10:27:40', '2025-02-06 10:27:40'),
(103, 'Employee-cost-print', 'sanctum', '2025-02-06 10:40:35', '2025-02-06 10:40:35'),
(105, 'Employee-salary-print', 'sanctum', '2025-02-06 11:08:55', '2025-02-06 11:08:55'),
(106, 'Office-cost-print', 'sanctum', '2025-02-06 11:16:11', '2025-02-06 11:16:11'),
(107, 'Employee-cost-category-page', 'sanctum', '2025-02-06 18:39:33', '2025-02-06 18:39:33'),
(108, 'Employee-cost-category-create', 'sanctum', '2025-02-06 18:39:51', '2025-02-06 18:39:51'),
(109, 'Employee-cost-category-edit', 'sanctum', '2025-02-06 18:39:57', '2025-02-06 18:39:57'),
(110, 'Employee-cost-category-delete', 'sanctum', '2025-02-06 18:40:03', '2025-02-06 18:40:03');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(28, 'App\\Models\\User', 11, 'auth_token', 'c4c03603a7436a196f60d2176516ed6df91ef620b6664b4065cd8645db53ffab', '[\"*\"]', '2025-01-30 03:26:46', NULL, '2025-01-30 02:03:50', '2025-01-30 03:26:46'),
(29, 'App\\Models\\User', 11, 'auth_token', '32696fc40dae2271c84e8a97646be469abdb38ff40c6bd0fa40962d15bba94e4', '[\"*\"]', '2025-01-30 03:47:03', NULL, '2025-01-30 03:27:35', '2025-01-30 03:47:03'),
(33, 'App\\Models\\User', 11, 'auth_token', 'e3e6db81e9c1260feeeacd039c96d5267982749c24a0144e5af4f085e93191ed', '[\"*\"]', '2025-01-30 09:59:00', NULL, '2025-01-30 09:56:06', '2025-01-30 09:59:00'),
(38, 'App\\Models\\User', 11, 'auth_token', 'f8780ee8d42242db97269ccb047230dd1081683e107848f89f673bb8562651ab', '[\"*\"]', '2025-02-05 09:23:18', NULL, '2025-02-05 09:22:31', '2025-02-05 09:23:18'),
(39, 'App\\Models\\User', 11, 'auth_token', '30839c6d5caec85170d5b1f02c6d5847d4ace6c39c5e612c631623aa030bf02e', '[\"*\"]', '2025-02-05 09:29:52', NULL, '2025-02-05 09:26:48', '2025-02-05 09:29:52'),
(41, 'App\\Models\\User', 11, 'auth_token', 'e3500a3757da546544f72d300fff0e852881d5da75c456b4a6902a1ea70a0b62', '[\"*\"]', '2025-02-05 09:31:25', NULL, '2025-02-05 09:30:37', '2025-02-05 09:31:25'),
(42, 'App\\Models\\User', 15, 'auth_token', 'c342ebfa2a7fc0a996d980443a3b0c3aa4b7e36d5ddf751e5a596f52aec88361', '[\"*\"]', '2025-02-05 09:31:53', NULL, '2025-02-05 09:31:46', '2025-02-05 09:31:53'),
(43, 'App\\Models\\User', 15, 'auth_token', 'ef5acaafd54a8c8bc7f02d441995762e033e66adbe1874f3de61a5f950c48915', '[\"*\"]', '2025-02-05 09:32:51', NULL, '2025-02-05 09:32:28', '2025-02-05 09:32:51'),
(44, 'App\\Models\\User', 15, 'auth_token', '80af9861ab24012184c537a8caf5163d415df972ec9c293a3148207a14dc1a1f', '[\"*\"]', '2025-02-05 09:33:09', NULL, '2025-02-05 09:33:03', '2025-02-05 09:33:09'),
(46, 'App\\Models\\User', 15, 'auth_token', 'b85510361f22e012616f12d6853fab8718253aa1b98bd7b60bc9a52dc7cabdbe', '[\"*\"]', '2025-02-05 09:34:31', NULL, '2025-02-05 09:34:26', '2025-02-05 09:34:31'),
(47, 'App\\Models\\User', 11, 'auth_token', '492ebb638406ef111ca5377650d8961352f119bed496d53d2aa6fb2863bb5b0f', '[\"*\"]', '2025-02-05 09:36:05', NULL, '2025-02-05 09:34:55', '2025-02-05 09:36:05'),
(48, 'App\\Models\\User', 15, 'auth_token', '416b78075b46d9c90af182996be01899394402380d75282a065416abb1356f81', '[\"*\"]', '2025-02-05 09:39:13', NULL, '2025-02-05 09:36:27', '2025-02-05 09:39:13'),
(50, 'App\\Models\\User', 15, 'auth_token', 'e895bd9730f691f05d6061fccf4d7d6a011be5c28862038010604a14faabd0de', '[\"*\"]', '2025-02-05 09:40:03', NULL, '2025-02-05 09:40:01', '2025-02-05 09:40:03'),
(51, 'App\\Models\\User', 11, 'auth_token', '8f905cbdb00d19328d2cb48d5b045ed294123054737b83ac4dc1654ed0a05189', '[\"*\"]', '2025-02-05 09:49:37', NULL, '2025-02-05 09:40:10', '2025-02-05 09:49:37'),
(52, 'App\\Models\\User', 15, 'auth_token', 'ccad8159da075c8572816983bbe6044d76e30727018389d5b961f74dbf0263fd', '[\"*\"]', '2025-02-05 09:40:53', NULL, '2025-02-05 09:40:49', '2025-02-05 09:40:53'),
(53, 'App\\Models\\User', 15, 'auth_token', '580c5213b06a9c5204cb0e5cbbd1763ea11d0b82b1e37265022ab66fef07e2f8', '[\"*\"]', '2025-02-05 09:43:19', NULL, '2025-02-05 09:43:16', '2025-02-05 09:43:19'),
(54, 'App\\Models\\User', 15, 'auth_token', 'ce8286daa99cdf771bfae652315c8dc609102e2c8874bba040a60725b1ced177', '[\"*\"]', '2025-02-05 09:44:31', NULL, '2025-02-05 09:44:27', '2025-02-05 09:44:31'),
(55, 'App\\Models\\User', 15, 'auth_token', '8594dcae0ee5d97d3a94810a9347de914e51047b30312697d74a3fd587262377', '[\"*\"]', '2025-02-05 09:45:54', NULL, '2025-02-05 09:45:50', '2025-02-05 09:45:54'),
(59, 'App\\Models\\User', 11, 'auth_token', '32468ca7d483ab5a3ea14cb30bcf78dbdc3ebb220892c45b9c5efc0bf96a1ad4', '[\"*\"]', '2025-02-05 11:12:09', NULL, '2025-02-05 11:11:55', '2025-02-05 11:12:09'),
(60, 'App\\Models\\User', 11, 'auth_token', 'f7c2e0fc7a0fef730e8c8ef6ab7a240ee7e713f0e5b0fb61f33244a2fad4b5a8', '[\"*\"]', '2025-02-05 11:17:09', NULL, '2025-02-05 11:14:19', '2025-02-05 11:17:09'),
(61, 'App\\Models\\User', 11, 'auth_token', 'f1956844810f9c5dbdf4fde24fa395f8526a993ee4738126b16c6b0951776042', '[\"*\"]', '2025-02-05 11:26:25', NULL, '2025-02-05 11:17:24', '2025-02-05 11:26:25'),
(62, 'App\\Models\\User', 11, 'auth_token', '1f4bb550da9d97058a4363d0885b3d6219039d080ab13273ca463f5e3c197392', '[\"*\"]', '2025-02-05 11:27:15', NULL, '2025-02-05 11:27:11', '2025-02-05 11:27:15'),
(63, 'App\\Models\\User', 11, 'auth_token', '9bf8703a9a84f77b730993e7edd32d66329231afbf9765f590864e6a203b3fd1', '[\"*\"]', '2025-02-05 11:41:05', NULL, '2025-02-05 11:35:15', '2025-02-05 11:41:05'),
(66, 'App\\Models\\User', 11, 'auth_token', '702eba685d03b1309ccfc85423512cb1fb472a3873cecffe3ad2ca5431413fe4', '[\"*\"]', '2025-02-05 23:32:59', NULL, '2025-02-05 23:21:18', '2025-02-05 23:32:59'),
(67, 'App\\Models\\User', 11, 'auth_token', '88daac255e0074adc9b2769e03512b5477fd5a6c79baaa9b2a48b54701666998', '[\"*\"]', '2025-02-06 00:39:11', NULL, '2025-02-06 00:25:58', '2025-02-06 00:39:11'),
(68, 'App\\Models\\User', 11, 'auth_token', '004d80c9e80602a66462c8962701e2c27639d32b706c9f111d3430dcba41f834', '[\"*\"]', '2025-02-06 01:11:47', NULL, '2025-02-06 00:44:49', '2025-02-06 01:11:47'),
(70, 'App\\Models\\User', 11, 'auth_token', '737819d57bea9163f95c61d88bf53012882e2652c096cbe00f0d3de95437c0a0', '[\"*\"]', '2025-02-06 03:15:00', NULL, '2025-02-06 02:56:27', '2025-02-06 03:15:00'),
(71, 'App\\Models\\User', 11, 'auth_token', '254386eaf798f4b408cff5ca2b366d61589e2fb25bb99dd959cb1e8aede5b7da', '[\"*\"]', '2025-02-06 03:20:46', NULL, '2025-02-06 03:15:39', '2025-02-06 03:20:46'),
(72, 'App\\Models\\User', 11, 'auth_token', 'f4e72fa5f2d218705e04d1d380ba1609615b13ce9cbb9634cf61df4599007c72', '[\"*\"]', '2025-02-06 03:24:06', NULL, '2025-02-06 03:21:38', '2025-02-06 03:24:06'),
(73, 'App\\Models\\User', 11, 'auth_token', '3cf5e4579b6134ee5af5cd5fa21b9a1ba5d7775e6f39cf10b29eadb355110dd5', '[\"*\"]', '2025-02-06 03:34:41', NULL, '2025-02-06 03:24:14', '2025-02-06 03:34:41'),
(74, 'App\\Models\\User', 11, 'auth_token', '753e273469d4e34d9b7f8c6a688403e4003631b41cd2158c534c18b528e1e370', '[\"*\"]', '2025-02-06 03:38:20', NULL, '2025-02-06 03:35:10', '2025-02-06 03:38:20'),
(76, 'App\\Models\\User', 11, 'auth_token', 'f2f1b4761f894246598abbcafb477ec358d66f34853781b5a5f77be0bf9612f2', '[\"*\"]', '2025-02-06 04:08:08', NULL, '2025-02-06 04:07:19', '2025-02-06 04:08:08'),
(77, 'App\\Models\\User', 11, 'auth_token', '466d925a88f04cb0037aed785235dd2d69bdd410694df53723ccd10045e40def', '[\"*\"]', '2025-02-06 04:11:59', NULL, '2025-02-06 04:08:15', '2025-02-06 04:11:59'),
(78, 'App\\Models\\User', 11, 'auth_token', 'b923e4218e81ac20308f1ce6a868135edd1fe85c164625ce055a3b4be0510824', '[\"*\"]', '2025-02-06 04:20:06', NULL, '2025-02-06 04:12:16', '2025-02-06 04:20:06'),
(81, 'App\\Models\\User', 11, 'auth_token', '056673c4a9c4a40a2f9ec29c64ec291d047212a19e562a7d432a430730b5bcf8', '[\"*\"]', '2025-02-06 04:54:00', NULL, '2025-02-06 04:49:16', '2025-02-06 04:54:00'),
(83, 'App\\Models\\User', 11, 'auth_token', '009bcf5cb51b78136fdb71c786edc1cc77c43003008c73989edd17c4c28bc8ce', '[\"*\"]', '2025-02-06 05:10:43', NULL, '2025-02-06 05:04:15', '2025-02-06 05:10:43'),
(84, 'App\\Models\\User', 11, 'auth_token', 'e23d26e2a6efd5780f1471d2d0bbb9b35de32138814b46c194d662f17e97417e', '[\"*\"]', '2025-02-06 05:32:01', NULL, '2025-02-06 05:31:12', '2025-02-06 05:32:01'),
(85, 'App\\Models\\User', 11, 'auth_token', 'f357e548cd96dfac153cb7425c8df5cec8d2b0ca7354c9382fb71a3e2c807279', '[\"*\"]', '2025-02-06 05:42:20', NULL, '2025-02-06 05:41:30', '2025-02-06 05:42:20'),
(86, 'App\\Models\\User', 11, 'auth_token', '83bc58667288d9bc5b5ebfb8eccab0748366413d958ac1827ab4573f7a1080db', '[\"*\"]', '2025-02-06 05:42:47', NULL, '2025-02-06 05:42:46', '2025-02-06 05:42:47'),
(87, 'App\\Models\\User', 11, 'auth_token', '7790f8a120634f281a7b0970f1802e00012deb04bba7cfa3a608eae84ab8fb8a', '[\"*\"]', '2025-02-06 07:52:04', NULL, '2025-02-06 07:37:13', '2025-02-06 07:52:04'),
(90, 'App\\Models\\User', 11, 'auth_token', '1bc9e624fb9639398a97ba8ae8a8b96a018167c6e1f7f88e36246c2a011b9a09', '[\"*\"]', '2025-02-06 10:56:39', NULL, '2025-02-06 10:53:11', '2025-02-06 10:56:39'),
(91, 'App\\Models\\User', 11, 'auth_token', 'dbce8b9ac330076e1e3b86995654a8146261766b39ff465849bb898760b37305', '[\"*\"]', '2025-02-06 10:59:49', NULL, '2025-02-06 10:55:47', '2025-02-06 10:59:49'),
(93, 'App\\Models\\User', 11, 'auth_token', 'ad2152c1e6615da8947ce7887768380cfbb2dda09e544c4f5859a6a8f8f5beb2', '[\"*\"]', '2025-02-06 11:23:13', NULL, '2025-02-06 11:09:35', '2025-02-06 11:23:13'),
(95, 'App\\Models\\User', 11, 'auth_token', '737358b938b42f02e747cde9b936da8445aafbe30660493e69abe30dba7d4669', '[\"*\"]', '2025-02-06 11:35:58', NULL, '2025-02-06 11:35:29', '2025-02-06 11:35:58'),
(97, 'App\\Models\\User', 11, 'auth_token', '341fc06f887bf03657d9e2579a0e71270842e2ee90035ade87b8ec6d84e6cc9d', '[\"*\"]', '2025-02-06 18:44:42', NULL, '2025-02-06 18:36:45', '2025-02-06 18:44:42');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cat_id` bigint(20) UNSIGNED NOT NULL,
  `brand_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `pack_size` varchar(255) DEFAULT NULL,
  `expire_date` varchar(255) DEFAULT NULL,
  `buy_price` double NOT NULL DEFAULT 0,
  `sell_price` double NOT NULL DEFAULT 0,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `cat_id`, `brand_id`, `name`, `pack_size`, `expire_date`, `buy_price`, `sell_price`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 6, 8, 'illo', NULL, NULL, 56.88, 195.01, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(2, 3, 2, 'inventore', NULL, NULL, 483.95, 536.64, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(3, 9, 7, 'unde', NULL, NULL, 361.28, 271.68, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(4, 9, 10, 'quae', 'Large', NULL, 176.51, 102.64, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(5, 4, 1, 'atque', 'Large', '2029-01-01', 483.67, 205.13, 100, '2025-01-25 04:33:07', '2025-01-25 07:58:15'),
(6, 6, 3, 'laudantium', NULL, '2001-10-26', 257.11, 572.22, 19, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(7, 9, 9, 'sed', NULL, NULL, 134.68, 305.44, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(8, 4, 9, 'nobis', NULL, '1983-10-20', 294.34, 558.46, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(9, 3, 5, 'labore', 'Large', '2001-02-28', 383.15, 528.14, 89, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(10, 2, 7, 'veritatis', NULL, NULL, 130.17, 322.57, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(11, 7, 2, 'qui', 'Small', '2024-04-28', 384.66, 565.53, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(12, 5, 4, 'labore', NULL, '1975-02-03', 374.61, 293.23, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(13, 3, 9, 'modi', 'Medium', NULL, 410.46, 131.81, 15, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(14, 3, 10, 'aut', 'Small', '1973-05-21', 330.65, 220.98, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(15, 9, 8, 'rerum', NULL, '1992-04-30', 144.49, 235.4, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(16, 10, 1, 'vero', 'Medium', '2018-10-18', 31.67, 223.01, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(17, 6, 7, 'et', NULL, '1974-12-18', 110.04, 71.32, 54, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(18, 10, 4, 'recusandae', 'Small', NULL, 197.76, 201.57, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(19, 8, 1, 'rem', NULL, NULL, 32.45, 219.29, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(20, 8, 10, 'consequatur', 'Large', NULL, 159.86, 324.26, 0, '2025-01-25 04:33:07', '2025-01-25 04:33:07');

-- --------------------------------------------------------

--
-- Table structure for table `relations`
--

CREATE TABLE `relations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `relation_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `relations`
--

INSERT INTO `relations` (`id`, `employee_id`, `relation_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 12, 13, 11, '2025-01-25 05:00:08', '2025-01-25 05:00:08'),
(2, 13, 14, 11, '2025-01-25 05:00:20', '2025-01-25 05:00:20');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salaries`
--

CREATE TABLE `salaries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `month_year` varchar(255) NOT NULL,
  `basic_salary` double NOT NULL,
  `paid_amount` double NOT NULL,
  `advance_amount` double NOT NULL DEFAULT 0,
  `due_amount` double NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salaries`
--

INSERT INTO `salaries` (`id`, `employee_id`, `month_year`, `basic_salary`, `paid_amount`, `advance_amount`, `due_amount`, `created_at`, `updated_at`) VALUES
(22, 11, '2024-08', 2485.33, 2457.35, 909.03, 0, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(23, 7, '2024-12', 6759.54, 1832.7, 0, 4001.85, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(24, 1, '2024-07', 3885.81, 1866.68, 826.13, 0, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(25, 1, '2024-04', 7485.28, 1838.51, 0, 8883.91, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(26, 10, '2025-01', 5552.87, 3367.36, 0, 20.12, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(27, 1, '2025-01', 6193.1, 507.47, 0, 505.79, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(28, 6, '2024-09', 5562.44, 3840.54, 0, 226.31, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(29, 7, '2024-03', 2091.97, 67.31, 537.28, 0, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(30, 3, '2024-05', 7977.28, 7671.35, 0, 7607.43, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(31, 6, '2024-07', 2213.94, 1060.1, 0, 5334.69, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(32, 12, '2024-10', 9832.36, 1706.56, 538.44, 0, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(33, 5, '2024-03', 7883.74, 1843.22, 0, 5811.97, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(34, 6, '2024-09', 6222.21, 1795, 730.58, 0, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(35, 4, '2024-02', 9059.51, 5866.85, 0, 4986.61, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(36, 8, '2024-08', 3166.75, 1210.29, 0, 9220.89, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(37, 4, '2024-07', 6845.41, 4182.3, 142.87, 0, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(38, 3, '2024-07', 2869.14, 321.16, 0, 3818.49, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(39, 14, '2024-11', 2819.15, 1242.91, 931.32, 0, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(40, 7, '2024-09', 8001.74, 2580.13, 352.95, 0, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(41, 5, '2024-07', 7065.59, 4812.62, 0, 5375.58, '2025-01-25 14:18:30', '2025-01-25 14:18:30'),
(42, 3, '2025-02', 32738.4, 1000, 0, 43164.32, '2025-01-26 10:21:08', '2025-01-26 10:21:08');

-- --------------------------------------------------------

--
-- Table structure for table `stock_in_outs`
--

CREATE TABLE `stock_in_outs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `buy_price` double DEFAULT NULL,
  `in_out` varchar(255) NOT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `who_take` varchar(255) DEFAULT NULL,
  `in_out_date` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_in_outs`
--

INSERT INTO `stock_in_outs` (`id`, `product_id`, `quantity`, `buy_price`, `in_out`, `purpose`, `supplier_id`, `who_take`, `in_out_date`, `created_at`, `updated_at`) VALUES
(1, 13, 44, 109.67, 'in', NULL, 5, NULL, '1985-09-05', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(2, 7, 26, NULL, 'out', 'Tenetur maxime ut sit autem.', NULL, 'Jasper Cruickshank', '2004-09-10', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(3, 20, 15, NULL, 'out', 'Distinctio aliquid consectetur sit aliquam sed.', NULL, 'Stacy O\'Reilly', '1978-12-01', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(4, 20, 45, 107.4, 'in', NULL, 3, NULL, '1971-01-07', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(5, 4, 3, NULL, 'out', 'Odio non suscipit quia quidem voluptatem pariatur sunt.', NULL, 'Shania Rempel DDS', '1990-07-23', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(6, 11, 45, 314.94, 'in', NULL, 7, NULL, '1978-05-26', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(7, 14, 23, NULL, 'out', 'Porro qui est repudiandae enim laborum velit.', NULL, 'Eliezer Daniel', '2016-11-01', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(8, 1, 41, NULL, 'out', 'Veritatis nam porro ut quidem repellat suscipit ab quaerat.', NULL, 'Joe Kuhlman', '2008-08-17', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(9, 16, 25, NULL, 'out', 'Non omnis laboriosam ducimus blanditiis sint omnis et.', NULL, 'Marjolaine Cassin', '2004-04-14', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(10, 12, 21, NULL, 'out', 'Dolores nihil totam sint suscipit odio.', NULL, 'Prof. Natalie Donnelly', '1983-11-17', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(11, 15, 43, NULL, 'out', 'Suscipit quo autem aut occaecati ab molestiae assumenda.', NULL, 'Miss Glenda Price', '2023-09-23', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(12, 6, 13, 211.04, 'in', NULL, 5, NULL, '1997-05-17', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(13, 6, 6, 163.5, 'in', NULL, 1, NULL, '1973-11-21', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(14, 9, 42, 106.01, 'in', NULL, 1, NULL, '2009-07-11', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(15, 18, 21, NULL, 'out', 'Vitae reprehenderit corrupti necessitatibus nihil cum explicabo molestias est.', NULL, 'Matteo Sawayn', '2010-07-20', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(16, 13, 33, NULL, 'out', 'Maxime omnis ipsa impedit voluptates autem impedit et.', NULL, 'Lamar Beer', '1993-10-25', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(17, 8, 40, 130.32, 'in', NULL, 6, NULL, '2017-06-19', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(18, 15, 28, 138.9, 'in', NULL, 1, NULL, '1975-02-03', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(19, 13, 23, 449.62, 'in', NULL, 2, NULL, '1987-06-19', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(20, 4, 15, 124.91, 'in', NULL, 6, NULL, '1976-05-12', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(21, 9, 47, 325.26, 'in', NULL, 3, NULL, '2008-11-22', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(22, 16, 19, 355.85, 'in', NULL, 4, NULL, '2016-10-10', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(23, 1, 29, 477.37, 'in', NULL, 3, NULL, '1988-04-17', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(24, 3, 7, NULL, 'out', 'In corporis incidunt assumenda maxime vitae iste.', NULL, 'Katelyn Ratke', '1979-06-21', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(25, 11, 45, NULL, 'out', 'Et voluptas ab dolor quisquam tempora fugit sint.', NULL, 'Angeline Huel', '2003-02-16', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(26, 17, 12, 372.51, 'in', NULL, 3, NULL, '2016-06-25', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(27, 5, 20, 317.44, 'in', NULL, 2, NULL, '2021-09-18', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(28, 3, 11, NULL, 'out', 'Veniam natus ea eos deleniti ut impedit qui aut.', NULL, 'Dr. Jorge McClure DVM', '2003-04-01', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(29, 13, 19, NULL, 'out', 'Tempora harum dolor quo esse asperiores quo.', NULL, 'Mrs. Chanel Hill Jr.', '2017-09-28', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(30, 3, 2, NULL, 'out', 'Eveniet aperiam illo numquam deserunt aliquam error officia dolores.', NULL, 'Nickolas Gislason', '1986-09-03', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(31, 7, 1, NULL, 'out', 'Qui maiores quidem in ipsa aliquam quidem.', NULL, 'Cleta Sipes', '1988-12-10', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(32, 2, 19, NULL, 'out', 'Officiis quia id ad saepe sit rem.', NULL, 'Prof. Fern Jaskolski V', '1990-09-21', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(33, 1, 16, NULL, 'out', 'Ratione eos accusantium occaecati possimus soluta.', NULL, 'Luis Botsford', '2018-07-03', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(34, 10, 5, NULL, 'out', 'Eos ea sit harum dolorem non iusto.', NULL, 'Dr. Libby Mosciski', '1982-02-03', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(35, 5, 38, NULL, 'out', 'Et illum eos voluptatem deleniti.', NULL, 'Ryleigh Osinski', '1979-12-15', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(36, 20, 45, NULL, 'out', 'Et rerum placeat quae velit beatae.', NULL, 'Dr. Marion Cruickshank', '2021-04-30', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(37, 16, 18, NULL, 'out', 'Distinctio quod minus dolor tenetur modi qui omnis.', NULL, 'Claudie Purdy', '1988-11-16', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(38, 1, 22, NULL, 'out', 'Occaecati eos ut dolor optio error accusantium.', NULL, 'Hyman McClure III', '2018-12-11', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(39, 16, 49, NULL, 'out', 'Non reiciendis ducimus maxime dicta eum.', NULL, 'Christop Towne', '1984-05-05', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(40, 4, 31, NULL, 'out', 'Qui ut corporis rerum et.', NULL, 'Deondre Bartoletti Jr.', '1984-01-10', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(41, 10, 16, NULL, 'out', 'Quaerat corporis mollitia reprehenderit dolorem.', NULL, 'Ima Kovacek', '1970-03-11', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(42, 15, 42, NULL, 'out', 'Qui sit et alias amet in quo.', NULL, 'Axel McDermott', '1976-06-13', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(43, 20, 19, NULL, 'out', 'Quibusdam culpa sequi incidunt natus.', NULL, 'Maybell Turcotte MD', '2002-01-26', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(44, 17, 42, 10.09, 'in', NULL, 2, NULL, '1980-09-09', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(45, 8, 16, NULL, 'out', 'Dolores dolor aut in et sint dolores.', NULL, 'Craig Parker', '2009-09-20', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(46, 3, 34, NULL, 'out', 'Quia rerum quidem consequatur.', NULL, 'Aida Beatty V', '1993-05-17', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(47, 12, 24, NULL, 'out', 'Dolores maxime aliquam ratione quasi unde sit.', NULL, 'Zola Mann', '1980-12-08', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(48, 12, 12, NULL, 'out', 'Velit est et quo.', NULL, 'Prof. Javon Dicki', '1971-12-08', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(49, 15, 41, NULL, 'out', 'Debitis unde placeat fugit ut.', NULL, 'Stephany Walter', '2015-07-14', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(50, 8, 41, NULL, 'out', 'Natus modi in nulla facere accusamus.', NULL, 'Karley Hessel', '1996-10-24', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(51, 5, 100, 483.67, 'in', NULL, 1, NULL, '2026-12-31', '2025-01-25 07:58:15', '2025-01-25 07:58:15');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `proprietor_name` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `proprietor_name`, `company_name`, `phone`, `email`, `whatsapp`, `country`, `address`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Simone Effertz', 'Emmerich-Keebler', '+1-731-306-1432', 'sofia74@example.com', '563-692-8523', 'Georgia', '4264 Bode Walks Apt. 962\r\nWest Jocelyn, IA 31224-9374', 'suppliers/supplier_1737813189.png', '2025-01-25 04:33:07', '2025-01-25 07:53:09'),
(2, 'Margie Pfeffer', 'Sporer, Cremin and Schulist', '(510) 391-4450', NULL, '+1 (520) 470-6036', 'Mayotte', '1837 Weimann Shoals Apt. 405\nQuentinville, WY 88323-2604', 'https://via.placeholder.com/640x480.png/00ddee?text=nihil', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(3, 'Brionna Howell', 'Rodriguez, Daugherty and Bednar', '+17572448217', 'hahn.ariane@example.org', '+14704578078', 'Chad', '1060 Kerluke Wall Apt. 969\nNew Babyberg, MN 16820', 'https://via.placeholder.com/640x480.png/007799?text=omnis', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(4, 'Damien Bode', 'Effertz-Corwin', '651-597-4117', NULL, '1-785-500-9571', 'Spain', '532 Donnelly Mission\nPacochashire, TX 84607-9962', 'https://via.placeholder.com/640x480.png/00dd99?text=molestiae', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(5, 'Stefanie Wuckert', 'Steuber, Koch and Quigley', '442.985.6277', 'terrell.klein@example.org', '+1 (820) 448-9631', 'Guinea', '6421 Foster Union Apt. 485\nWest Iliana, CO 42207-6514', NULL, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(6, 'Brenna Nikolaus Jr.', 'Osinski, Connelly and Cummerata', '(989) 241-8504', 'tre84@example.net', '+1-352-364-1065', 'Gabon', '858 Nova Brooks\nMetzland, CT 95660-7079', NULL, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(7, 'Wilfredo Hoppe', 'O\'Kon and Sons', '208.563.2549', 'enrico31@example.org', '929-775-0370', 'Malta', '7781 Jacynthe Landing Suite 527\nNew Lesly, UT 41204', NULL, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(8, 'Mr. Finn Gleichner Jr.', 'Marquardt and Sons', '607-441-1367', 'maida91@example.org', '1-360-285-5969', 'Barbados', '611 Howe Shoal\nNorth Neoma, MO 08626-0950', NULL, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(9, 'Mr. Gerardo Fisher Sr.', 'Moore-Ruecker', '+1-412-231-4654', NULL, '(480) 210-0929', 'Czech Republic', '31079 Kuhn Circle Suite 249\nSouth Autumnland, SD 76927', NULL, '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(10, 'Baby Waters', 'McCullough-Kuhn', '1-838-742-9605', NULL, '941.332.3752', 'Mali', '933 Abigayle Creek\nBrendanstad, UT 93811', 'https://via.placeholder.com/640x480.png/00cc88?text=animi', '2025-01-25 04:33:07', '2025-01-25 04:33:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` enum('active','deactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `email`, `password`, `status`, `created_at`, `updated_at`) VALUES
(1, 8, 'ole.feeney@example.com', '$2y$12$Q/ICWpXBV11skU5RdyIwi.FX2f6mJ.5lWmgY9gvNG3s9crj2602U.', 'deactive', '2025-01-25 04:33:07', '2025-01-25 07:52:34'),
(2, 5, 'jimmy.wiza@example.net', '$2y$12$Xd4XAoWxVQ1E4iVNVCqfLOy5VAWdcMqIILQTnz/LtBbtDv5YFVDaK', 'deactive', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(3, 1, 'ron.rempel@example.org', '$2y$12$IqvegQtMiP.aCHc8kj2lQOGIVVtRb3uBZ6gCWLNHyUS15ZyxbDJh.', 'deactive', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(4, 4, 'bkunde@example.net', '$2y$12$99CSsukoTBd6NrK/oBgTTuYQ5w5mI9mBz46m4723K5TFqK3Nq5ef6', 'deactive', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(5, 9, 'calista.rohan@example.org', '$2y$12$Ts08avbmXP6DeZxSI5q5V.PysAyRERIwGmtnyUfJ1Frxcn0K9XrgC', 'active', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(6, 4, 'schuster.mariano@example.org', '$2y$12$uW8UmuBh2nbsRLl2dSeybOZGNHwr29naC7CJVrzAAotpH9khh8r5q', 'deactive', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(7, 2, 'gulgowski.jerad@example.com', '$2y$12$0bQ6ZFiS64Y6a8wcK770ZumsSiwWb1C9FFFVy52MwCW8Dv11Q33ky', 'deactive', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(8, 7, 'hweimann@example.org', '$2y$12$rHctEQZXKxV1.DU3DtWXH.q5tyIjfugMjBzBWPEUeINj80qsEai7.', 'active', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(9, 7, 'keyshawn21@example.net', '$2y$12$NWNJ.RrgBhb58VjzIH.RReMJc2F97hl7rEN/4/z55ujZBSslGfiIa', 'active', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(10, 1, 'sylvester63@example.com', '$2y$12$uzFzk8OvQMStr3QeC8GJbuRCEdzDYjBMQ/44qf6YTC/ODpOkuGmKS', 'active', '2025-01-25 04:33:07', '2025-01-25 04:33:07'),
(11, 11, 'admin@gmail.com', '$2y$12$O4GkXrrk2NtysDrA2msEC.6Xa9bTpbF02kgHnVzFqY./9PhuI45nm', 'active', NULL, NULL),
(12, 12, 'alif@gmail.com', '$2y$12$cwDwcMOqQXHCtS11day4GuBkPxM7W2GRrlCwtpnisAsZZVXayoJpu', 'active', '2025-01-25 04:58:50', '2025-01-25 04:58:50'),
(13, 13, 'mujahid@gmail.com', '$2y$12$y/RT3qJTEYcmXrGYZ6MUber.LJp41.7OGmpUPC.PdJxLmom14Tbwu', 'active', '2025-01-25 04:59:26', '2025-01-25 04:59:26'),
(14, 14, 'efty@gmail.com', '$2y$12$q0UP5hjoWbBfD847pHxJxuWfjGBGTqd05qPd7Vm5ArfLTHaSn0hMi', 'active', '2025-01-25 04:59:55', '2025-01-25 04:59:55'),
(15, 15, 'shovon@gmail.com', '$2y$12$n0Hshc7i5.a/1356UJYbjOQtFYzYg73Qa9YCUOnUQwW79tImGS5du', 'active', '2025-02-05 09:29:51', '2025-02-05 09:29:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `costs`
--
ALTER TABLE `costs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `costs_cost_cat_id_foreign` (`cost_cat_id`),
  ADD KEY `costs_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `cost_categories`
--
ALTER TABLE `cost_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `designations_name_unique` (`name`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_employee_id_unique` (`employee_id`),
  ADD KEY `employees_designation_id_foreign` (`designation_id`);

--
-- Indexes for table `employee_cost_categories`
--
ALTER TABLE `employee_cost_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoices_invoiceid_unique` (`invoiceId`),
  ADD KEY `invoices_cust_id_foreign` (`cust_id`),
  ADD KEY `invoices_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `invoice_products`
--
ALTER TABLE `invoice_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_products_invoice_id_foreign` (`invoice_id`),
  ADD KEY `invoice_products_product_id_foreign` (`product_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_cust_id_foreign` (`cust_id`),
  ADD KEY `orders_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `order_products`
--
ALTER TABLE `order_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_products_order_id_foreign` (`order_id`),
  ADD KEY `order_products_product_id_foreign` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_cust_id_foreign` (`cust_id`),
  ADD KEY `payments_employee_id_foreign` (`employee_id`),
  ADD KEY `payments_supplier_id_foreign` (`supplier_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_cat_id_foreign` (`cat_id`),
  ADD KEY `products_brand_id_foreign` (`brand_id`);

--
-- Indexes for table `relations`
--
ALTER TABLE `relations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `relations_employee_id_unique` (`employee_id`),
  ADD KEY `relations_relation_id_foreign` (`relation_id`),
  ADD KEY `relations_created_by_foreign` (`created_by`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `salaries`
--
ALTER TABLE `salaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salaries_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `stock_in_outs`
--
ALTER TABLE `stock_in_outs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_in_outs_product_id_foreign` (`product_id`),
  ADD KEY `stock_in_outs_supplier_id_foreign` (`supplier_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_employee_id_foreign` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `costs`
--
ALTER TABLE `costs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `cost_categories`
--
ALTER TABLE `cost_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `employee_cost_categories`
--
ALTER TABLE `employee_cost_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `invoice_products`
--
ALTER TABLE `invoice_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_products`
--
ALTER TABLE `order_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `relations`
--
ALTER TABLE `relations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salaries`
--
ALTER TABLE `salaries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `stock_in_outs`
--
ALTER TABLE `stock_in_outs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `costs`
--
ALTER TABLE `costs`
  ADD CONSTRAINT `costs_cost_cat_id_foreign` FOREIGN KEY (`cost_cat_id`) REFERENCES `cost_categories` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `costs_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_designation_id_foreign` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`);

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_cust_id_foreign` FOREIGN KEY (`cust_id`) REFERENCES `customers` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invoices_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `invoice_products`
--
ALTER TABLE `invoice_products`
  ADD CONSTRAINT `invoice_products_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `invoice_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_cust_id_foreign` FOREIGN KEY (`cust_id`) REFERENCES `customers` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_products`
--
ALTER TABLE `order_products`
  ADD CONSTRAINT `order_products_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `order_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_cust_id_foreign` FOREIGN KEY (`cust_id`) REFERENCES `customers` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `products_cat_id_foreign` FOREIGN KEY (`cat_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `relations`
--
ALTER TABLE `relations`
  ADD CONSTRAINT `relations_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `relations_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `relations_relation_id_foreign` FOREIGN KEY (`relation_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `salaries`
--
ALTER TABLE `salaries`
  ADD CONSTRAINT `salaries_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `stock_in_outs`
--
ALTER TABLE `stock_in_outs`
  ADD CONSTRAINT `stock_in_outs_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_in_outs_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
