-- phpMyAdmin SQL Dump
-- version 4.3.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 04, 2015 at 09:50 AM
-- Server version: 5.6.23-72.1
-- PHP Version: 5.6.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `cogentqi_v1_target`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `RandomInt`(minVal INT, maxVal INT) RETURNS int(11)
BEGIN
    RETURN (minVal + FLOOR(RAND() * ((maxVal - minVal)+1)));
  END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `algorithm_usage`
--

CREATE TABLE IF NOT EXISTS `algorithm_usage` (
  `id` char(1) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `summary` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `algorithm_usage`
--

INSERT INTO `algorithm_usage` (`id`, `name`, `description`, `summary`) VALUES
('N', 'None', NULL, NULL),
('R', 'Recommendations', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `evaluation`
--

CREATE TABLE IF NOT EXISTS `evaluation` (
  `id` int(11) NOT NULL,
  `instrument_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `by_member_id` int(11) NOT NULL,
  `last_saved` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `evaluator_comments` text,
  `member_comments` text,
  `score` double DEFAULT NULL,
  `scoreRank` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `evaluation`
--

INSERT INTO `evaluation` (`id`, `instrument_id`, `member_id`, `by_member_id`, `last_saved`, `last_modified`, `evaluator_comments`, `member_comments`, `score`, `scoreRank`) VALUES
(11, 1, 5, 5, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(12, 1, 7, 7, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(13, 1, 9, 9, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(14, 1, 10, 10, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(15, 1, 11, 11, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(16, 1, 12, 12, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(17, 1, 13, 13, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(18, 1, 17, 17, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(19, 1, 18, 18, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(20, 1, 20, 20, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(21, 1, 21, 21, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(22, 1, 22, 22, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(23, 1, 23, 23, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(24, 1, 24, 24, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(25, 1, 25, 25, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(26, 1, 26, 26, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(27, 1, 27, 27, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(28, 1, 28, 28, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(29, 1, 29, 29, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(30, 1, 30, 30, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(42, 2, 6, 6, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(43, 2, 8, 8, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(44, 2, 14, 14, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(45, 2, 15, 15, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL),
(46, 2, 16, 16, '2015-03-22 11:10:25', '2015-03-22 15:10:25', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_response`
--

CREATE TABLE IF NOT EXISTS `evaluation_response` (
  `id` int(11) NOT NULL,
  `evaluation_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `response` varchar(500) DEFAULT NULL,
  `evaluator_comments` text,
  `member_comments` text,
  `response_index` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1693 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `evaluation_response`
--

INSERT INTO `evaluation_response` (`id`, `evaluation_id`, `question_id`, `response`, `evaluator_comments`, `member_comments`, `response_index`) VALUES
(957, 11, 1, '2', 'These are some evaluator comments.', NULL, 2),
(958, 12, 1, '4', NULL, NULL, 4),
(959, 13, 1, '1', NULL, NULL, 1),
(960, 14, 1, '1', NULL, NULL, 1),
(961, 15, 1, '3', NULL, NULL, 3),
(962, 16, 1, '1', NULL, NULL, 1),
(963, 17, 1, '2', NULL, NULL, 2),
(964, 18, 1, '4', NULL, NULL, 4),
(965, 19, 1, '2', NULL, NULL, 2),
(966, 20, 1, '2', NULL, NULL, 2),
(967, 21, 1, '4', NULL, NULL, 4),
(968, 22, 1, '3', NULL, NULL, 3),
(969, 23, 1, '2', NULL, NULL, 2),
(970, 24, 1, '1', NULL, NULL, 1),
(971, 25, 1, '2', NULL, NULL, 2),
(972, 26, 1, '4', NULL, NULL, 4),
(973, 27, 1, '2', NULL, NULL, 2),
(974, 28, 1, '4', NULL, NULL, 4),
(975, 29, 1, '2', NULL, NULL, 2),
(976, 30, 1, '2', NULL, NULL, 2),
(977, 11, 2, '4', 'This is an exemplary record.', NULL, 4),
(978, 12, 2, '2', NULL, NULL, 2),
(979, 13, 2, '3', NULL, NULL, 3),
(980, 14, 2, '4', NULL, NULL, 4),
(981, 15, 2, '2', NULL, NULL, 2),
(982, 16, 2, '3', NULL, NULL, 3),
(983, 17, 2, '4', NULL, NULL, 4),
(984, 18, 2, '1', NULL, NULL, 1),
(985, 19, 2, '1', NULL, NULL, 1),
(986, 20, 2, '4', NULL, NULL, 4),
(987, 21, 2, '1', NULL, NULL, 1),
(988, 22, 2, '4', NULL, NULL, 4),
(989, 23, 2, '1', NULL, NULL, 1),
(990, 24, 2, '2', NULL, NULL, 2),
(991, 25, 2, '3', NULL, NULL, 3),
(992, 26, 2, '3', NULL, NULL, 3),
(993, 27, 2, '3', NULL, NULL, 3),
(994, 28, 2, '1', NULL, NULL, 1),
(995, 29, 2, '4', NULL, NULL, 4),
(996, 30, 2, '1', NULL, NULL, 1),
(997, 11, 3, '2', NULL, NULL, 2),
(998, 12, 3, '3', NULL, NULL, 3),
(999, 13, 3, '1', NULL, NULL, 1),
(1000, 14, 3, '1', NULL, NULL, 1),
(1001, 15, 3, '2', NULL, NULL, 2),
(1002, 16, 3, '3', NULL, NULL, 3),
(1003, 17, 3, '2', NULL, NULL, 2),
(1004, 18, 3, '3', NULL, NULL, 3),
(1005, 19, 3, '2', NULL, NULL, 2),
(1006, 20, 3, '4', NULL, NULL, 4),
(1007, 21, 3, '3', NULL, NULL, 3),
(1008, 22, 3, '2', NULL, NULL, 2),
(1009, 23, 3, '4', NULL, NULL, 4),
(1010, 24, 3, '3', NULL, NULL, 3),
(1011, 25, 3, '1', NULL, NULL, 1),
(1012, 26, 3, '1', NULL, NULL, 1),
(1013, 27, 3, '1', NULL, NULL, 1),
(1014, 28, 3, '3', NULL, NULL, 3),
(1015, 29, 3, '1', NULL, NULL, 1),
(1016, 30, 3, '1', NULL, NULL, 1),
(1017, 11, 4, '4', NULL, NULL, 4),
(1018, 12, 4, '4', NULL, NULL, 4),
(1019, 13, 4, '1', NULL, NULL, 1),
(1020, 14, 4, '2', NULL, NULL, 2),
(1021, 15, 4, '2', NULL, NULL, 2),
(1022, 16, 4, '4', NULL, NULL, 4),
(1023, 17, 4, '4', NULL, NULL, 4),
(1024, 18, 4, '2', NULL, NULL, 2),
(1025, 19, 4, '4', NULL, NULL, 4),
(1026, 20, 4, '1', NULL, NULL, 1),
(1027, 21, 4, '1', NULL, NULL, 1),
(1028, 22, 4, '2', NULL, NULL, 2),
(1029, 23, 4, '3', NULL, NULL, 3),
(1030, 24, 4, '1', NULL, NULL, 1),
(1031, 25, 4, '3', NULL, NULL, 3),
(1032, 26, 4, '4', NULL, NULL, 4),
(1033, 27, 4, '4', NULL, NULL, 4),
(1034, 28, 4, '2', NULL, NULL, 2),
(1035, 29, 4, '2', NULL, NULL, 2),
(1036, 30, 4, '3', NULL, NULL, 3),
(1037, 11, 5, '1', NULL, NULL, 1),
(1038, 12, 5, '3', NULL, NULL, 3),
(1039, 13, 5, '3', NULL, NULL, 3),
(1040, 14, 5, '4', NULL, NULL, 4),
(1041, 15, 5, '4', NULL, NULL, 4),
(1042, 16, 5, '4', NULL, NULL, 4),
(1043, 17, 5, '1', NULL, NULL, 1),
(1044, 18, 5, '2', NULL, NULL, 2),
(1045, 19, 5, '1', NULL, NULL, 1),
(1046, 20, 5, '3', NULL, NULL, 3),
(1047, 21, 5, '2', NULL, NULL, 2),
(1048, 22, 5, '2', NULL, NULL, 2),
(1049, 23, 5, '4', NULL, NULL, 4),
(1050, 24, 5, '3', NULL, NULL, 3),
(1051, 25, 5, '1', NULL, NULL, 1),
(1052, 26, 5, '4', NULL, NULL, 4),
(1053, 27, 5, '4', NULL, NULL, 4),
(1054, 28, 5, '3', NULL, NULL, 3),
(1055, 29, 5, '1', NULL, NULL, 1),
(1056, 30, 5, '2', NULL, NULL, 2),
(1057, 11, 6, '2', NULL, NULL, 2),
(1058, 12, 6, '4', NULL, NULL, 4),
(1059, 13, 6, '3', NULL, NULL, 3),
(1060, 14, 6, '2', NULL, NULL, 2),
(1061, 15, 6, '1', NULL, NULL, 1),
(1062, 16, 6, '4', NULL, NULL, 4),
(1063, 17, 6, '2', NULL, NULL, 2),
(1064, 18, 6, '1', NULL, NULL, 1),
(1065, 19, 6, '1', NULL, NULL, 1),
(1066, 20, 6, '3', NULL, NULL, 3),
(1067, 21, 6, '4', NULL, NULL, 4),
(1068, 22, 6, '1', NULL, NULL, 1),
(1069, 23, 6, '2', NULL, NULL, 2),
(1070, 24, 6, '3', NULL, NULL, 3),
(1071, 25, 6, '3', NULL, NULL, 3),
(1072, 26, 6, '2', NULL, NULL, 2),
(1073, 27, 6, '2', NULL, NULL, 2),
(1074, 28, 6, '2', NULL, NULL, 2),
(1075, 29, 6, '2', NULL, NULL, 2),
(1076, 30, 6, '1', NULL, NULL, 1),
(1077, 11, 7, '1', NULL, NULL, 1),
(1078, 12, 7, '3', NULL, NULL, 3),
(1079, 13, 7, '4', NULL, NULL, 4),
(1080, 14, 7, '2', NULL, NULL, 2),
(1081, 15, 7, '1', NULL, NULL, 1),
(1082, 16, 7, '2', NULL, NULL, 2),
(1083, 17, 7, '3', NULL, NULL, 3),
(1084, 18, 7, '3', NULL, NULL, 3),
(1085, 19, 7, '3', NULL, NULL, 3),
(1086, 20, 7, '4', NULL, NULL, 4),
(1087, 21, 7, '4', NULL, NULL, 4),
(1088, 22, 7, '1', NULL, NULL, 1),
(1089, 23, 7, '2', NULL, NULL, 2),
(1090, 24, 7, '3', NULL, NULL, 3),
(1091, 25, 7, '1', NULL, NULL, 1),
(1092, 26, 7, '4', NULL, NULL, 4),
(1093, 27, 7, '4', NULL, NULL, 4),
(1094, 28, 7, '3', NULL, NULL, 3),
(1095, 29, 7, '2', NULL, NULL, 2),
(1096, 30, 7, '4', NULL, NULL, 4),
(1097, 11, 8, '4', NULL, NULL, 4),
(1098, 12, 8, '3', NULL, NULL, 3),
(1099, 13, 8, '1', NULL, NULL, 1),
(1100, 14, 8, '3', NULL, NULL, 3),
(1101, 15, 8, '3', NULL, NULL, 3),
(1102, 16, 8, '3', NULL, NULL, 3),
(1103, 17, 8, '1', NULL, NULL, 1),
(1104, 18, 8, '3', NULL, NULL, 3),
(1105, 19, 8, '4', NULL, NULL, 4),
(1106, 20, 8, '4', NULL, NULL, 4),
(1107, 21, 8, '4', NULL, NULL, 4),
(1108, 22, 8, '1', NULL, NULL, 1),
(1109, 23, 8, '2', NULL, NULL, 2),
(1110, 24, 8, '3', NULL, NULL, 3),
(1111, 25, 8, '1', NULL, NULL, 1),
(1112, 26, 8, '1', NULL, NULL, 1),
(1113, 27, 8, '3', NULL, NULL, 3),
(1114, 28, 8, '2', NULL, NULL, 2),
(1115, 29, 8, '2', NULL, NULL, 2),
(1116, 30, 8, '3', NULL, NULL, 3),
(1117, 11, 9, '3', NULL, NULL, 3),
(1118, 12, 9, '4', NULL, NULL, 4),
(1119, 13, 9, '1', NULL, NULL, 1),
(1120, 14, 9, '2', NULL, NULL, 2),
(1121, 15, 9, '4', NULL, NULL, 4),
(1122, 16, 9, '2', NULL, NULL, 2),
(1123, 17, 9, '1', NULL, NULL, 1),
(1124, 18, 9, '4', NULL, NULL, 4),
(1125, 19, 9, '4', NULL, NULL, 4),
(1126, 20, 9, '2', NULL, NULL, 2),
(1127, 21, 9, '1', NULL, NULL, 1),
(1128, 22, 9, '1', NULL, NULL, 1),
(1129, 23, 9, '1', NULL, NULL, 1),
(1130, 24, 9, '3', NULL, NULL, 3),
(1131, 25, 9, '3', NULL, NULL, 3),
(1132, 26, 9, '4', NULL, NULL, 4),
(1133, 27, 9, '3', NULL, NULL, 3),
(1134, 28, 9, '3', NULL, NULL, 3),
(1135, 29, 9, '1', NULL, NULL, 1),
(1136, 30, 9, '3', NULL, NULL, 3),
(1137, 11, 10, '2', NULL, NULL, 2),
(1138, 12, 10, '2', NULL, NULL, 2),
(1139, 13, 10, '1', NULL, NULL, 1),
(1140, 14, 10, '2', NULL, NULL, 2),
(1141, 15, 10, '3', NULL, NULL, 3),
(1142, 16, 10, '1', NULL, NULL, 1),
(1143, 17, 10, '2', NULL, NULL, 2),
(1144, 18, 10, '4', NULL, NULL, 4),
(1145, 19, 10, '3', NULL, NULL, 3),
(1146, 20, 10, '3', NULL, NULL, 3),
(1147, 21, 10, '3', NULL, NULL, 3),
(1148, 22, 10, '1', NULL, NULL, 1),
(1149, 23, 10, '2', NULL, NULL, 2),
(1150, 24, 10, '2', NULL, NULL, 2),
(1151, 25, 10, '4', NULL, NULL, 4),
(1152, 26, 10, '3', NULL, NULL, 3),
(1153, 27, 10, '1', NULL, NULL, 1),
(1154, 28, 10, '4', NULL, NULL, 4),
(1155, 29, 10, '1', NULL, NULL, 1),
(1156, 30, 10, '3', NULL, NULL, 3),
(1157, 11, 11, '3', NULL, NULL, 3),
(1158, 12, 11, '2', NULL, NULL, 2),
(1159, 13, 11, '3', NULL, NULL, 3),
(1160, 14, 11, '1', NULL, NULL, 1),
(1161, 15, 11, '4', NULL, NULL, 4),
(1162, 16, 11, '3', NULL, NULL, 3),
(1163, 17, 11, '4', NULL, NULL, 4),
(1164, 18, 11, '1', NULL, NULL, 1),
(1165, 19, 11, '4', NULL, NULL, 4),
(1166, 20, 11, '4', NULL, NULL, 4),
(1167, 21, 11, '2', NULL, NULL, 2),
(1168, 22, 11, '3', NULL, NULL, 3),
(1169, 23, 11, '4', NULL, NULL, 4),
(1170, 24, 11, '1', NULL, NULL, 1),
(1171, 25, 11, '4', NULL, NULL, 4),
(1172, 26, 11, '4', NULL, NULL, 4),
(1173, 27, 11, '3', NULL, NULL, 3),
(1174, 28, 11, '4', NULL, NULL, 4),
(1175, 29, 11, '3', NULL, NULL, 3),
(1176, 30, 11, '3', NULL, NULL, 3),
(1177, 11, 12, '4', NULL, NULL, 4),
(1178, 12, 12, '2', NULL, NULL, 2),
(1179, 13, 12, '1', NULL, NULL, 1),
(1180, 14, 12, '2', NULL, NULL, 2),
(1181, 15, 12, '4', NULL, NULL, 4),
(1182, 16, 12, '1', NULL, NULL, 1),
(1183, 17, 12, '2', NULL, NULL, 2),
(1184, 18, 12, '1', NULL, NULL, 1),
(1185, 19, 12, '3', NULL, NULL, 3),
(1186, 20, 12, '3', NULL, NULL, 3),
(1187, 21, 12, '1', NULL, NULL, 1),
(1188, 22, 12, '3', NULL, NULL, 3),
(1189, 23, 12, '3', NULL, NULL, 3),
(1190, 24, 12, '3', NULL, NULL, 3),
(1191, 25, 12, '1', NULL, NULL, 1),
(1192, 26, 12, '4', NULL, NULL, 4),
(1193, 27, 12, '2', NULL, NULL, 2),
(1194, 28, 12, '4', NULL, NULL, 4),
(1195, 29, 12, '1', NULL, NULL, 1),
(1196, 30, 12, '3', NULL, NULL, 3),
(1197, 11, 13, '3', NULL, NULL, 3),
(1198, 12, 13, '4', NULL, NULL, 4),
(1199, 13, 13, '1', NULL, NULL, 1),
(1200, 14, 13, '3', NULL, NULL, 3),
(1201, 15, 13, '1', NULL, NULL, 1),
(1202, 16, 13, '1', NULL, NULL, 1),
(1203, 17, 13, '2', NULL, NULL, 2),
(1204, 18, 13, '3', NULL, NULL, 3),
(1205, 19, 13, '4', NULL, NULL, 4),
(1206, 20, 13, '3', NULL, NULL, 3),
(1207, 21, 13, '4', NULL, NULL, 4),
(1208, 22, 13, '2', NULL, NULL, 2),
(1209, 23, 13, '3', NULL, NULL, 3),
(1210, 24, 13, '1', NULL, NULL, 1),
(1211, 25, 13, '1', NULL, NULL, 1),
(1212, 26, 13, '1', NULL, NULL, 1),
(1213, 27, 13, '1', NULL, NULL, 1),
(1214, 28, 13, '4', NULL, NULL, 4),
(1215, 29, 13, '3', NULL, NULL, 3),
(1216, 30, 13, '4', NULL, NULL, 4),
(1217, 11, 14, '3', NULL, NULL, 3),
(1218, 12, 14, '2', NULL, NULL, 2),
(1219, 13, 14, '2', NULL, NULL, 2),
(1220, 14, 14, '4', NULL, NULL, 4),
(1221, 15, 14, '4', NULL, NULL, 4),
(1222, 16, 14, '1', NULL, NULL, 1),
(1223, 17, 14, '4', NULL, NULL, 4),
(1224, 18, 14, '1', NULL, NULL, 1),
(1225, 19, 14, '2', NULL, NULL, 2),
(1226, 20, 14, '1', NULL, NULL, 1),
(1227, 21, 14, '4', NULL, NULL, 4),
(1228, 22, 14, '1', NULL, NULL, 1),
(1229, 23, 14, '4', NULL, NULL, 4),
(1230, 24, 14, '2', NULL, NULL, 2),
(1231, 25, 14, '1', NULL, NULL, 1),
(1232, 26, 14, '3', NULL, NULL, 3),
(1233, 27, 14, '2', NULL, NULL, 2),
(1234, 28, 14, '3', NULL, NULL, 3),
(1235, 29, 14, '2', NULL, NULL, 2),
(1236, 30, 14, '2', NULL, NULL, 2),
(1237, 11, 15, '2', NULL, NULL, 2),
(1238, 12, 15, '2', NULL, NULL, 2),
(1239, 13, 15, '4', NULL, NULL, 4),
(1240, 14, 15, '3', NULL, NULL, 3),
(1241, 15, 15, '4', NULL, NULL, 4),
(1242, 16, 15, '3', NULL, NULL, 3),
(1243, 17, 15, '1', NULL, NULL, 1),
(1244, 18, 15, '2', NULL, NULL, 2),
(1245, 19, 15, '3', NULL, NULL, 3),
(1246, 20, 15, '1', NULL, NULL, 1),
(1247, 21, 15, '4', NULL, NULL, 4),
(1248, 22, 15, '3', NULL, NULL, 3),
(1249, 23, 15, '1', NULL, NULL, 1),
(1250, 24, 15, '4', NULL, NULL, 4),
(1251, 25, 15, '3', NULL, NULL, 3),
(1252, 26, 15, '1', NULL, NULL, 1),
(1253, 27, 15, '1', NULL, NULL, 1),
(1254, 28, 15, '1', NULL, NULL, 1),
(1255, 29, 15, '2', NULL, NULL, 2),
(1256, 30, 15, '4', NULL, NULL, 4),
(1468, 42, 16, '1', NULL, NULL, 1),
(1469, 43, 16, '1', NULL, NULL, 1),
(1470, 44, 16, '2', NULL, NULL, 2),
(1471, 45, 16, '2', NULL, NULL, 2),
(1472, 46, 16, '2', NULL, NULL, 2),
(1473, 42, 17, '1', NULL, NULL, 1),
(1474, 43, 17, '1', NULL, NULL, 1),
(1475, 44, 17, '1', NULL, NULL, 1),
(1476, 45, 17, '2', NULL, NULL, 2),
(1477, 46, 17, '1', NULL, NULL, 1),
(1478, 42, 18, '1', NULL, NULL, 1),
(1479, 43, 18, '1', NULL, NULL, 1),
(1480, 44, 18, '2', NULL, NULL, 2),
(1481, 45, 18, '2', NULL, NULL, 2),
(1482, 46, 18, '2', NULL, NULL, 2),
(1483, 42, 19, '1', NULL, NULL, 1),
(1484, 43, 19, '2', NULL, NULL, 2),
(1485, 44, 19, '1', NULL, NULL, 1),
(1486, 45, 19, '1', NULL, NULL, 1),
(1487, 46, 19, '2', NULL, NULL, 2),
(1488, 42, 20, '2', NULL, NULL, 2),
(1489, 43, 20, '2', NULL, NULL, 2),
(1490, 44, 20, '1', NULL, NULL, 1),
(1491, 45, 20, '2', NULL, NULL, 2),
(1492, 46, 20, '1', NULL, NULL, 1),
(1493, 42, 21, '1', NULL, NULL, 1),
(1494, 43, 21, '2', NULL, NULL, 2),
(1495, 44, 21, '2', NULL, NULL, 2),
(1496, 45, 21, '1', NULL, NULL, 1),
(1497, 46, 21, '1', NULL, NULL, 1),
(1498, 42, 22, '1', NULL, NULL, 1),
(1499, 43, 22, '2', NULL, NULL, 2),
(1500, 44, 22, '2', NULL, NULL, 2),
(1501, 45, 22, '1', NULL, NULL, 1),
(1502, 46, 22, '1', NULL, NULL, 1),
(1503, 42, 23, '2', NULL, NULL, 2),
(1504, 43, 23, '2', NULL, NULL, 2),
(1505, 44, 23, '2', NULL, NULL, 2),
(1506, 45, 23, '2', NULL, NULL, 2),
(1507, 46, 23, '1', NULL, NULL, 1),
(1508, 42, 24, '2', NULL, NULL, 2),
(1509, 43, 24, '2', NULL, NULL, 2),
(1510, 44, 24, '1', NULL, NULL, 1),
(1511, 45, 24, '1', NULL, NULL, 1),
(1512, 46, 24, '2', NULL, NULL, 2),
(1513, 42, 25, '1', NULL, NULL, 1),
(1514, 43, 25, '2', NULL, NULL, 2),
(1515, 44, 25, '1', NULL, NULL, 1),
(1516, 45, 25, '1', NULL, NULL, 1),
(1517, 46, 25, '1', NULL, NULL, 1),
(1518, 42, 26, '2', NULL, NULL, 2),
(1519, 43, 26, '2', NULL, NULL, 2),
(1520, 44, 26, '1', NULL, NULL, 1),
(1521, 45, 26, '1', NULL, NULL, 1),
(1522, 46, 26, '2', NULL, NULL, 2),
(1523, 42, 27, '1', NULL, NULL, 1),
(1524, 43, 27, '1', NULL, NULL, 1),
(1525, 44, 27, '2', NULL, NULL, 2),
(1526, 45, 27, '1', NULL, NULL, 1),
(1527, 46, 27, '1', NULL, NULL, 1),
(1528, 42, 28, '2', NULL, NULL, 2),
(1529, 43, 28, '2', NULL, NULL, 2),
(1530, 44, 28, '1', NULL, NULL, 1),
(1531, 45, 28, '1', NULL, NULL, 1),
(1532, 46, 28, '2', NULL, NULL, 2),
(1533, 42, 29, '1', NULL, NULL, 1),
(1534, 43, 29, '1', NULL, NULL, 1),
(1535, 44, 29, '1', NULL, NULL, 1),
(1536, 45, 29, '2', NULL, NULL, 2),
(1537, 46, 29, '2', NULL, NULL, 2),
(1538, 42, 30, '2', NULL, NULL, 2),
(1539, 43, 30, '1', NULL, NULL, 1),
(1540, 44, 30, '2', NULL, NULL, 2),
(1541, 45, 30, '1', NULL, NULL, 1),
(1542, 46, 30, '2', NULL, NULL, 2),
(1543, 42, 31, '2', NULL, NULL, 2),
(1544, 43, 31, '1', NULL, NULL, 1),
(1545, 44, 31, '2', NULL, NULL, 2),
(1546, 45, 31, '1', NULL, NULL, 1),
(1547, 46, 31, '2', NULL, NULL, 2),
(1548, 42, 32, '1', NULL, NULL, 1),
(1549, 43, 32, '2', NULL, NULL, 2),
(1550, 44, 32, '1', NULL, NULL, 1),
(1551, 45, 32, '1', NULL, NULL, 1),
(1552, 46, 32, '1', NULL, NULL, 1),
(1553, 42, 33, '1', NULL, NULL, 1),
(1554, 43, 33, '1', NULL, NULL, 1),
(1555, 44, 33, '1', NULL, NULL, 1),
(1556, 45, 33, '2', NULL, NULL, 2),
(1557, 46, 33, '1', NULL, NULL, 1),
(1558, 42, 34, '1', NULL, NULL, 1),
(1559, 43, 34, '1', NULL, NULL, 1),
(1560, 44, 34, '2', NULL, NULL, 2),
(1561, 45, 34, '1', NULL, NULL, 1),
(1562, 46, 34, '1', NULL, NULL, 1),
(1563, 42, 35, '2', NULL, NULL, 2),
(1564, 43, 35, '1', NULL, NULL, 1),
(1565, 44, 35, '1', NULL, NULL, 1),
(1566, 45, 35, '2', NULL, NULL, 2),
(1567, 46, 35, '1', NULL, NULL, 1),
(1568, 42, 36, '2', NULL, NULL, 2),
(1569, 43, 36, '1', NULL, NULL, 1),
(1570, 44, 36, '1', NULL, NULL, 1),
(1571, 45, 36, '2', NULL, NULL, 2),
(1572, 46, 36, '2', NULL, NULL, 2),
(1573, 42, 37, '1', NULL, NULL, 1),
(1574, 43, 37, '2', NULL, NULL, 2),
(1575, 44, 37, '1', NULL, NULL, 1),
(1576, 45, 37, '2', NULL, NULL, 2),
(1577, 46, 37, '2', NULL, NULL, 2),
(1578, 42, 38, '2', NULL, NULL, 2),
(1579, 43, 38, '2', NULL, NULL, 2),
(1580, 44, 38, '1', NULL, NULL, 1),
(1581, 45, 38, '1', NULL, NULL, 1),
(1582, 46, 38, '2', NULL, NULL, 2),
(1583, 42, 39, '2', NULL, NULL, 2),
(1584, 43, 39, '1', NULL, NULL, 1),
(1585, 44, 39, '2', NULL, NULL, 2),
(1586, 45, 39, '1', NULL, NULL, 1),
(1587, 46, 39, '2', NULL, NULL, 2),
(1588, 42, 40, '2', NULL, NULL, 2),
(1589, 43, 40, '2', NULL, NULL, 2),
(1590, 44, 40, '1', NULL, NULL, 1),
(1591, 45, 40, '2', NULL, NULL, 2),
(1592, 46, 40, '1', NULL, NULL, 1),
(1593, 42, 41, '2', NULL, NULL, 2),
(1594, 43, 41, '1', NULL, NULL, 1),
(1595, 44, 41, '1', NULL, NULL, 1),
(1596, 45, 41, '1', NULL, NULL, 1),
(1597, 46, 41, '2', NULL, NULL, 2),
(1598, 42, 42, '2', NULL, NULL, 2),
(1599, 43, 42, '1', NULL, NULL, 1),
(1600, 44, 42, '2', NULL, NULL, 2),
(1601, 45, 42, '2', NULL, NULL, 2),
(1602, 46, 42, '1', NULL, NULL, 1),
(1603, 42, 43, '1', NULL, NULL, 1),
(1604, 43, 43, '2', NULL, NULL, 2),
(1605, 44, 43, '2', NULL, NULL, 2),
(1606, 45, 43, '2', NULL, NULL, 2),
(1607, 46, 43, '1', NULL, NULL, 1),
(1608, 42, 44, '2', NULL, NULL, 2),
(1609, 43, 44, '2', NULL, NULL, 2),
(1610, 44, 44, '2', NULL, NULL, 2),
(1611, 45, 44, '1', NULL, NULL, 1),
(1612, 46, 44, '1', NULL, NULL, 1),
(1613, 42, 45, '2', NULL, NULL, 2),
(1614, 43, 45, '2', NULL, NULL, 2),
(1615, 44, 45, '2', NULL, NULL, 2),
(1616, 45, 45, '2', NULL, NULL, 2),
(1617, 46, 45, '2', NULL, NULL, 2),
(1618, 42, 46, '2', NULL, NULL, 2),
(1619, 43, 46, '1', NULL, NULL, 1),
(1620, 44, 46, '1', NULL, NULL, 1),
(1621, 45, 46, '1', NULL, NULL, 1),
(1622, 46, 46, '2', NULL, NULL, 2),
(1623, 42, 47, '2', NULL, NULL, 2),
(1624, 43, 47, '2', NULL, NULL, 2),
(1625, 44, 47, '1', NULL, NULL, 1),
(1626, 45, 47, '2', NULL, NULL, 2),
(1627, 46, 47, '2', NULL, NULL, 2),
(1628, 42, 48, '1', NULL, NULL, 1),
(1629, 43, 48, '1', NULL, NULL, 1),
(1630, 44, 48, '2', NULL, NULL, 2),
(1631, 45, 48, '1', NULL, NULL, 1),
(1632, 46, 48, '2', NULL, NULL, 2),
(1633, 42, 49, '2', NULL, NULL, 2),
(1634, 43, 49, '1', NULL, NULL, 1),
(1635, 44, 49, '2', NULL, NULL, 2),
(1636, 45, 49, '1', NULL, NULL, 1),
(1637, 46, 49, '2', NULL, NULL, 2),
(1638, 42, 50, '1', NULL, NULL, 1),
(1639, 43, 50, '2', NULL, NULL, 2),
(1640, 44, 50, '1', NULL, NULL, 1),
(1641, 45, 50, '2', NULL, NULL, 2),
(1642, 46, 50, '2', NULL, NULL, 2),
(1643, 42, 51, '1', NULL, NULL, 1),
(1644, 43, 51, '2', NULL, NULL, 2),
(1645, 44, 51, '1', NULL, NULL, 1),
(1646, 45, 51, '1', NULL, NULL, 1),
(1647, 46, 51, '1', NULL, NULL, 1),
(1648, 42, 52, '1', NULL, NULL, 1),
(1649, 43, 52, '2', NULL, NULL, 2),
(1650, 44, 52, '1', NULL, NULL, 1),
(1651, 45, 52, '1', NULL, NULL, 1),
(1652, 46, 52, '2', NULL, NULL, 2),
(1653, 42, 53, '2', NULL, NULL, 2),
(1654, 43, 53, '2', NULL, NULL, 2),
(1655, 44, 53, '2', NULL, NULL, 2),
(1656, 45, 53, '1', NULL, NULL, 1),
(1657, 46, 53, '2', NULL, NULL, 2),
(1658, 42, 54, '1', NULL, NULL, 1),
(1659, 43, 54, '2', NULL, NULL, 2),
(1660, 44, 54, '2', NULL, NULL, 2),
(1661, 45, 54, '2', NULL, NULL, 2),
(1662, 46, 54, '2', NULL, NULL, 2),
(1663, 42, 55, '1', NULL, NULL, 1),
(1664, 43, 55, '2', NULL, NULL, 2),
(1665, 44, 55, '2', NULL, NULL, 2),
(1666, 45, 55, '1', NULL, NULL, 1),
(1667, 46, 55, '1', NULL, NULL, 1),
(1668, 42, 56, '2', NULL, NULL, 2),
(1669, 43, 56, '1', NULL, NULL, 1),
(1670, 44, 56, '1', NULL, NULL, 1),
(1671, 45, 56, '1', NULL, NULL, 1),
(1672, 46, 56, '1', NULL, NULL, 1),
(1673, 42, 57, '1', NULL, NULL, 1),
(1674, 43, 57, '2', NULL, NULL, 2),
(1675, 44, 57, '2', NULL, NULL, 2),
(1676, 45, 57, '1', NULL, NULL, 1),
(1677, 46, 57, '2', NULL, NULL, 2),
(1678, 42, 58, '1', NULL, NULL, 1),
(1679, 43, 58, '2', NULL, NULL, 2),
(1680, 44, 58, '2', NULL, NULL, 2),
(1681, 45, 58, '2', NULL, NULL, 2),
(1682, 46, 58, '1', NULL, NULL, 1),
(1683, 42, 59, '2', NULL, NULL, 2),
(1684, 43, 59, '1', NULL, NULL, 1),
(1685, 44, 59, '2', NULL, NULL, 2),
(1686, 45, 59, '1', NULL, NULL, 1),
(1687, 46, 59, '2', NULL, NULL, 2),
(1688, 42, 60, '1', NULL, NULL, 1),
(1689, 43, 60, '2', NULL, NULL, 2),
(1690, 44, 60, '1', NULL, NULL, 1),
(1691, 45, 60, '2', NULL, NULL, 2),
(1692, 46, 60, '2', NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `instrument`
--

CREATE TABLE IF NOT EXISTS `instrument` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `role_id` char(1) NOT NULL DEFAULT 'P',
  `usage_id` char(1) NOT NULL DEFAULT 'R',
  `description` varchar(5000) DEFAULT NULL,
  `summary` varchar(500) DEFAULT NULL,
  `is_uniform` tinyint(1) DEFAULT '1',
  `question_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `instrument`
--

INSERT INTO `instrument` (`id`, `name`, `role_id`, `usage_id`, `description`, `summary`, `is_uniform`, `question_type_id`) VALUES
(1, 'Pharmacy Technician Evaluation', 'T', 'R', NULL, 'Evaluation of technical staff for software development skills.', 1, 1),
(2, 'HCBP Safety Compass', 'P', 'R', NULL, 'This tool is used to gain an understanding of potential team member, process and/or system opportunities.', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `learning_module`
--

CREATE TABLE IF NOT EXISTS `learning_module` (
  `id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `ends` datetime NOT NULL,
  `sched_type` char(1) NOT NULL,
  `starts` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `learning_module`
--

INSERT INTO `learning_module` (`id`, `resource_id`, `ends`, `sched_type`, `starts`) VALUES
(1, 1, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(2, 2, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(3, 3, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(4, 4, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(5, 5, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(6, 6, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(7, 7, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(8, 8, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(9, 9, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(10, 10, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(11, 11, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35'),
(12, 12, '2015-03-31 09:23:35', 'C', '2015-03-31 09:23:35');

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE IF NOT EXISTS `member` (
  `id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `role_id` char(1) NOT NULL DEFAULT 'P',
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `job_title` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `level` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`id`, `organization_id`, `role_id`, `first_name`, `last_name`, `job_title`, `email`, `username`, `password`, `avatar`, `level`) VALUES
(1, 1, 'S', 'David', 'Quinn-Jacobs', 'CTO', 'dqj@cogentqi.com', 'dqj', 'f7ccee363ecaf9199fc3', 'img/avatars/user1.jpg', 4),
(2, 1, 'S', 'JR', 'Hoyer', 'CEO', 'jrhoyer@cogentqi.com', 'jrhoyer', 'f7ccee363ecaf9199fc3', 'img/avatars/user2.jpg', 4),
(3, 2, 'A', 'Melissa', 'Barbache', 'Area Manager', 'admin1@cogentqi.com', 'admin1', 'f7ccee363ecaf9199fc3', 'img/faux/users/1.jpg', 4),
(4, 3, 'M', 'Ben', 'Sycamore', 'Head Pharmacist', 'manager1@cogentqi.com', 'manager1', 'f7ccee363ecaf9199fc3', 'img/faux/users/2.jpg', 3),
(5, 3, 'T', 'Andrea', 'Franklin', 'Pharmacy Technician', 'prof1@cogentqi.com', 'ptech1', 'f7ccee363ecaf9199fc3', 'img/faux/users/3.jpg', 2),
(6, 3, 'P', 'Regina', 'Shipman', 'Pharmacist', 'prof2@cogentqi.com', 'ptech2', 'f7ccee363ecaf9199fc3', 'img/faux/users/4.jpg', 1),
(7, 4, 'T', 'Maggie', 'Westover', 'Pharmacy Technician', 'prof3@cogentqi.com', 'ptech3', 'f7ccee363ecaf9199fc3', 'img/faux/users/5.jpg', 5),
(8, 4, 'P', 'Perry', 'Constable', 'Pharmacist', 'prof4@cogentqi.com', 'ptech4', 'f7ccee363ecaf9199fc3', 'img/faux/users/6.jpg', 2),
(9, 4, 'T', 'Jim', 'Harris', 'Pharmacy Technician', 'prof5@cogentqi.com', 'ptech5', 'f7ccee363ecaf9199fc3', 'img/faux/users/7.jpg', 3),
(10, 4, 'T', 'Marion', 'Wight', 'Pharmacy Technician', 'prof6@cogentqi.com', 'ptech6', 'f7ccee363ecaf9199fc3', 'img/faux/users/8.jpg', 4),
(11, 3, 'T', 'Roger', 'Bitworth', 'Pharmacy Technician', 'ptech9@cogentqi.com', 'ptech9', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/9.jpg', 3),
(12, 3, 'T', 'Greg', 'Abernathy', 'Pharmacy Technician', 'ptech10@cogentqi.com', 'ptech10', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/10.jpg', 4),
(13, 3, 'T', 'Sarah', 'Zinkowksi', 'Pharmacy Technician', 'ptech11@cogentqi.com', 'ptech11', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/11.jpg', 5),
(14, 3, 'P', 'Rachael', 'Creighton', 'Pharmacist', 'pharm12@cogentqi.com', 'pharm12', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/12.jpg', 4),
(15, 3, 'P', 'Bob', 'Waters', 'Pharmacist', 'pharm13@cogentqi.com', 'pharm13', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/13.jpg', 4),
(16, 4, 'P', 'Jerry', 'Rinehart', 'Pharmacist', 'pharm14@cogentqi.com', 'pharm14', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/14.jpg', 4),
(17, 4, 'T', 'Karim', 'Shahir', 'Pharmacy Technician', 'ptech15@cogentqi.com', 'ptech15', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/15.jpg', 5),
(18, 4, 'T', 'Elizabeth', 'Ainsley', 'Pharmacy Technician', 'ptech16@cogentqi.com', 'ptech16', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/16.jpg', 5),
(20, 5, 'T', 'Becky', 'Jackson', 'Pharmacy Technician', 'ptech17@cogentqi.com', 'ptech17', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/17.jpg', 5),
(21, 5, 'T', 'Roxanne', 'Babcock', 'Pharmacy Technician', 'ptech18@cogentqi.com', 'ptech18', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/18.jpg', 5),
(22, 5, 'T', 'Judy', 'Parsons', 'Pharmacy Technician', 'ptech19@cogentqi.com', 'ptech19', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/19.jpg', 5),
(23, 5, 'T', 'Ralph', 'Simpson', 'Head Pharmacist', 'pharm20@cogentqi.com', 'pharm20', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/20.jpg', 5),
(24, 5, 'T', 'Jacob', 'Smith', 'Pharmacy Technician', 'ptech21@cogentqi.com', 'ptech21', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/21.jpg', 5),
(25, 6, 'T', 'Jerry', 'Coleman', 'Pharmacy Technician', 'ptech22@cogentqi.com', 'ptech22', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/22.jpg', 5),
(26, 6, 'T', 'Blake', 'Whitman', 'Head Pharmacist', 'pharm23@cogentqi.com', 'pharm23', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/23.jpg', 5),
(27, 6, 'T', 'Marcia', 'Simonson', 'Pharmacist', 'pharm24@cogentqi.com', 'pharm24', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/24.jpg', 5),
(28, 6, 'T', 'Bob', 'Mason', 'Pharmacy Technician', 'ptech25@cogentqi.com', 'ptech25', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/25.jpg', 5),
(29, 6, 'T', 'Connie', 'Sung', 'Pharmacy Technician', 'ptech26@cogentqi.com', 'ptech26', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/26.jpg', 5),
(30, 4, 'T', 'Bill', 'Hart', 'Pharmacy Technician', 'ptech27@cogentqi.com', 'ptech27', 'fe01ce2a7fbac8fafaed7c982a04e229', 'img/faux/users/27.jpg', 5);

-- --------------------------------------------------------

--
-- Table structure for table `member_badge`
--

CREATE TABLE IF NOT EXISTS `member_badge` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `member_id` int(11) NOT NULL,
  `earned` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `member_badge`
--

INSERT INTO `member_badge` (`id`, `title`, `member_id`, `earned`) VALUES
(1, 'Medicines Management', 2, '2015-03-21 21:12:39'),
(2, 'Prescription Filling', 2, '2015-03-21 21:13:08'),
(3, 'Patient Assessment', 3, '2015-03-21 21:13:46'),
(4, 'Patient Consent', 4, '2015-03-21 21:13:59'),
(5, 'Allergy Identification', 5, '2015-03-21 21:14:15'),
(6, 'Medicines Managemnent', 5, '2015-03-21 21:14:49'),
(7, 'Allergy Identification', 6, '2015-03-21 21:15:03'),
(8, 'Patient Assessment', 7, '2015-03-21 21:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE IF NOT EXISTS `organization` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `summary` varchar(5000) DEFAULT NULL,
  `description` text
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `organization`
--

INSERT INTO `organization` (`id`, `parent_id`, `name`, `summary`, `description`) VALUES
(1, NULL, 'CogentQI', NULL, NULL),
(2, 1, 'Target Pharmacy', NULL, NULL),
(3, 2, 'Store 0001', NULL, NULL),
(4, 2, 'Store 0002', NULL, NULL),
(5, 2, 'Store 0003', NULL, NULL),
(6, 2, 'Store 0004', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `organization_outcome`
--

CREATE TABLE IF NOT EXISTS `organization_outcome` (
  `id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `outcome_id` int(11) NOT NULL,
  `evaluated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `evaluator_id` int(11) DEFAULT NULL,
  `evaluator_comments` varchar(5000) DEFAULT NULL,
  `level` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `organization_outcome`
--

INSERT INTO `organization_outcome` (`id`, `organization_id`, `outcome_id`, `evaluated`, `evaluator_id`, `evaluator_comments`, `level`) VALUES
(32, 3, 1, '2015-03-28 15:48:12', NULL, NULL, 1),
(33, 4, 1, '2015-03-28 15:48:12', NULL, NULL, 1),
(34, 5, 1, '2015-03-28 15:48:12', NULL, NULL, 1),
(35, 6, 1, '2015-03-28 15:48:12', NULL, NULL, 1),
(36, 3, 2, '2015-03-28 15:48:12', NULL, NULL, 1),
(37, 4, 2, '2015-03-28 15:48:12', NULL, NULL, 2),
(38, 5, 2, '2015-03-28 15:48:12', NULL, NULL, 2),
(39, 6, 2, '2015-03-28 15:48:12', NULL, NULL, 2),
(40, 3, 3, '2015-03-28 15:48:12', NULL, NULL, 3),
(41, 4, 3, '2015-03-28 15:48:12', NULL, NULL, 3),
(42, 5, 3, '2015-03-28 15:48:12', NULL, NULL, 1),
(43, 6, 3, '2015-03-28 15:48:12', NULL, NULL, 1),
(44, 3, 4, '2015-03-28 15:48:12', NULL, NULL, 2),
(45, 4, 4, '2015-03-28 15:48:12', NULL, NULL, 3),
(46, 5, 4, '2015-03-28 15:48:12', NULL, NULL, 3),
(47, 6, 4, '2015-03-28 15:48:12', NULL, NULL, 1),
(48, 3, 5, '2015-03-28 15:48:12', NULL, NULL, 3),
(49, 4, 5, '2015-03-28 15:48:12', NULL, NULL, 2),
(50, 5, 5, '2015-03-28 15:48:12', NULL, NULL, 3),
(51, 6, 5, '2015-03-28 15:48:12', NULL, NULL, 1),
(52, 3, 6, '2015-03-28 15:48:12', NULL, NULL, 1),
(53, 4, 6, '2015-03-28 15:48:12', NULL, NULL, 1),
(54, 5, 6, '2015-03-28 15:48:12', NULL, NULL, 1),
(55, 6, 6, '2015-03-28 15:48:12', NULL, NULL, 3);

-- --------------------------------------------------------

--
-- Table structure for table `outcome`
--

CREATE TABLE IF NOT EXISTS `outcome` (
  `id` int(11) NOT NULL,
  `number` varchar(40) DEFAULT NULL,
  `name` varchar(500) NOT NULL,
  `summary` varchar(5000) DEFAULT NULL,
  `calc_method_id` char(1) DEFAULT NULL,
  `method` char(1) NOT NULL DEFAULT 'M',
  `sort_order` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `outcome`
--

INSERT INTO `outcome` (`id`, `number`, `name`, `summary`, `calc_method_id`, `method`, `sort_order`) VALUES
(1, '1.1', 'Incorrect Drug Events', 'The frequency of incorrect medication events.', NULL, 'D', 1),
(2, '1.2', 'Incorrect DAW Events', 'How well we are doing with respect to the frequency of mis-labeled medication events.', NULL, 'D', 2),
(3, '1.8', 'Customer Complaints about Staff', 'How well we are doing with respect to the frequency of customer complaints about staff behavior or treatment.', NULL, 'M', 8),
(4, '1.4', 'Missed Drug Interactions', 'The frequency of missed drug interaction events.', NULL, 'D', 4),
(5, '1.7', 'Preventive Care Opportunities Missed', 'How well we are doing in identifying and acting on preventive care opportunities.', NULL, 'M', 7),
(6, '1.9', 'Time-to Fill for Prescriptions', 'The timelieness of prescription fills.', NULL, 'M', 9),
(7, '1.3', 'Incorrect Directions Events', 'How often we have incorrect directions events.', NULL, 'D', 3),
(8, '1.5', 'Incorrect Dosage Form Events', 'The frequency of incorrect dosage form events.', NULL, 'D', 5),
(9, '1.6', 'Incorrect Release Form Events', 'The frequency of incorrect release form events.', NULL, 'D', 6),
(10, '1.7', 'Timeliness Complaint Events', 'The frequency of customer complaints about timeliness of prescription fills.', NULL, 'M', 0),
(11, NULL, 'Customer Service Complaint Events', 'The frequency of customer complaints about service.', NULL, 'M', 0);

-- --------------------------------------------------------

--
-- Table structure for table `outcome_alignment`
--

CREATE TABLE IF NOT EXISTS `outcome_alignment` (
  `id` int(11) NOT NULL,
  `outcome_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `weight` int(11) NOT NULL DEFAULT '1',
  `rel_wt` double DEFAULT '0.5'
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `outcome_alignment`
--

INSERT INTO `outcome_alignment` (`id`, `outcome_id`, `question_id`, `weight`, `rel_wt`) VALUES
(1, 1, 40, 1, 0.5),
(2, 1, 42, 1, 0.5),
(3, 1, 46, 1, 0.5),
(4, 2, 40, 3, 0.5),
(5, 2, 42, 3, 0.5),
(6, 2, 46, 3, 0.5),
(7, 3, 11, 1, 0.5),
(8, 3, 12, 1, 0.5),
(9, 3, 13, 1, 0.5),
(10, 3, 14, 1, 0.5),
(11, 3, 15, 1, 0.5),
(12, 4, 30, 1, 0.5),
(13, 4, 31, 1, 0.5),
(14, 4, 32, 1, 0.5),
(15, 4, 33, 1, 0.5),
(16, 4, 34, 1, 0.5),
(17, 4, 35, 1, 0.5),
(18, 4, 36, 1, 0.5),
(19, 4, 37, 1, 0.5),
(20, 4, 38, 1, 0.5),
(21, 4, 39, 1, 0.5),
(22, 4, 40, 1, 0.5),
(23, 4, 41, 1, 0.5),
(24, 4, 42, 1, 0.5),
(25, 4, 43, 1, 0.5),
(26, 4, 44, 1, 0.5),
(27, 4, 45, 1, 0.5),
(28, 4, 46, 1, 0.5),
(29, 4, 47, 1, 0.5),
(30, 4, 48, 1, 0.5),
(31, 4, 49, 1, 0.5),
(32, 4, 50, 1, 0.5),
(33, 4, 51, 1, 0.5),
(34, 4, 52, 1, 0.5),
(35, 4, 53, 1, 0.5),
(36, 4, 54, 1, 0.5),
(37, 4, 55, 1, 0.5),
(38, 4, 56, 1, 0.5),
(39, 4, 57, 1, 0.5),
(40, 4, 58, 1, 0.5),
(41, 4, 59, 1, 0.5),
(42, 4, 60, 1, 0.5),
(43, 6, 24, 1, 0.5),
(44, 6, 25, 1, 0.5),
(45, 6, 26, 1, 0.5),
(46, 6, 27, 1, 0.5),
(47, 6, 28, 1, 0.5),
(48, 6, 30, 1, 0.5),
(49, 6, 32, 1, 0.5),
(50, 6, 33, 1, 0.5),
(51, 6, 39, 1, 0.5),
(52, 6, 41, 1, 0.5),
(53, 6, 48, 1, 0.5),
(54, 6, 51, 1, 0.5),
(55, 6, 52, 1, 0.5),
(56, 6, 54, 1, 0.5),
(57, 6, 55, 1, 0.5),
(58, 6, 56, 1, 0.5),
(59, 6, 57, 1, 0.5),
(60, 6, 60, 1, 0.5),
(74, 5, 15, 1, 0.5);

-- --------------------------------------------------------

--
-- Table structure for table `outcome_event`
--

CREATE TABLE IF NOT EXISTS `outcome_event` (
  `id` int(11) NOT NULL,
  `outcome_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `occurred` datetime NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `outcome_event`
--

INSERT INTO `outcome_event` (`id`, `outcome_id`, `member_id`, `occurred`, `name`, `category`) VALUES
(35, 10, 1, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(36, 10, 2, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(37, 10, 3, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(38, 10, 4, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(39, 10, 5, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(40, 10, 6, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(41, 10, 11, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(42, 10, 12, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(43, 10, 13, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(44, 10, 14, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(45, 10, 15, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(46, 10, 7, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(47, 10, 8, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(48, 10, 9, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(49, 10, 10, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(50, 10, 16, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(51, 10, 17, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(52, 10, 18, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(53, 10, 30, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(54, 10, 20, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(55, 10, 21, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(56, 10, 22, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(57, 10, 23, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(58, 10, 24, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(59, 10, 25, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(60, 10, 26, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(61, 10, 27, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(62, 10, 28, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(63, 10, 29, '2015-03-14 12:00:00', 'Customer Service Complaint', 'Code of Conduct'),
(66, 11, 1, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(67, 11, 2, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(68, 11, 3, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(69, 11, 4, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(70, 11, 5, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(71, 11, 6, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(72, 11, 11, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(73, 11, 12, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(74, 11, 13, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(75, 11, 14, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(76, 11, 15, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(77, 11, 7, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(78, 11, 8, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(79, 11, 9, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(80, 11, 10, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(81, 11, 16, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(82, 11, 17, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(83, 11, 18, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(84, 11, 30, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(85, 11, 20, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(86, 11, 21, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(87, 11, 22, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(88, 11, 23, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(89, 11, 24, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(90, 11, 25, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(91, 11, 26, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(92, 11, 27, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(93, 11, 28, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(94, 11, 29, '2015-03-14 12:00:00', 'Timeliness Complaint', 'Filling'),
(97, 1, 6, '2015-01-14 12:00:00', 'Incorrect Drug', 'Filling'),
(98, 1, 14, '2015-01-24 11:00:00', 'Incorrect Drug', 'Filling'),
(99, 1, 15, '2015-03-14 09:00:00', 'Incorrect Drug', 'Filling'),
(100, 1, 16, '2015-03-14 16:00:00', 'Incorrect Drug', 'Filling'),
(101, 8, 6, '2015-03-27 13:00:00', 'Incorrect Strength', 'Filling'),
(102, 8, 8, '2015-03-27 15:00:00', 'Incorrect Strength', 'Filling'),
(103, 8, 16, '2015-03-27 12:00:00', 'Incorrect Strength', 'Filling'),
(104, 2, 8, '2015-01-12 18:00:00', 'Incorrect DAW', 'Filling'),
(105, 2, 14, '2015-01-12 18:00:00', 'Incorrect DAW', 'Filling'),
(106, 2, 15, '2015-01-12 18:00:00', 'Incorrect DAW', 'Filling'),
(107, 2, 16, '2015-01-12 18:00:00', 'Incorrect DAW', 'Filling'),
(108, 9, 6, '2015-03-04 18:00:00', 'Incorrect Release Form', 'Filling'),
(109, 9, 8, '2015-02-18 18:00:00', 'Incorrect Release Form', 'Filling'),
(110, 9, 14, '2015-01-16 18:00:00', 'Incorrect Release Form', 'Filling'),
(111, 9, 15, '2015-01-16 18:00:00', 'Incorrect Release Form', 'Filling'),
(112, 8, 8, '2015-02-18 18:00:00', 'Incorrect Dosage Form', 'Filling'),
(113, 8, 14, '2015-01-16 18:00:00', 'Incorrect Dosage Form', 'Filling'),
(114, 8, 15, '2015-01-16 18:00:00', 'Incorrect Dosage Form', 'Filling'),
(115, 7, 8, '2015-02-22 10:00:00', 'Incorrect Directions', 'Entering'),
(116, 7, 6, '2015-01-19 15:00:00', 'Incorrect Directions', 'Entering'),
(117, 7, 14, '2015-01-08 01:00:00', 'Incorrect Directions', 'Entering'),
(118, 7, 16, '2015-01-10 11:00:00', 'Incorrect Directions', 'Entering');

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE IF NOT EXISTS `question` (
  `id` int(11) NOT NULL,
  `question_group_id` int(11) NOT NULL,
  `question_type_id` int(11) NOT NULL DEFAULT '0',
  `sort_order` int(11) NOT NULL,
  `number` varchar(40) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `summary` varchar(500) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`id`, `question_group_id`, `question_type_id`, `sort_order`, `number`, `name`, `summary`, `description`) VALUES
(1, 1, 1, 1, '1', 'Patient Introduction', NULL, 'The pharmacy technician should be able to: <ul><li>Identify the patient</li><li>Introduce self to patient and explain their role</li></ul>'),
(2, 1, 1, 2, '2', 'Patient Assessment', NULL, 'The pharmacy technician should be able to: <ul><li>Question the patient (parent or carer) or a health care professional to obtain information </li><li>Use a variety of information sources to gather information </li><li>Interpret records made by other health care professionals when appropriate</li><li>Identify if the patient has brought in their medicines and/or encourage medicines to be brought in</li></ul>'),
(3, 1, 1, 3, '3', 'Patient Consent', NULL, 'For ward based pharmacy technicians, the main focus for obtaining patient consent is for using safe and/or removing unsafe Patient’s Own Drugs. This should follow the local process. As pharmacy technicians develop new roles and provide additional services they will require a greater understanding of the issues surrounding consent.'),
(4, 1, 1, 4, '4', 'Relevant Medicines Management Information', NULL, 'During the consultation with the patient, health problems and medicines management background should be identified and documented as per local procedure. Medicines Management background information could include use of compliance aids, information on who usually fills this, need for large print labels, resident of a nursinghome requiring specific discharge instructions, support offered by social services etc. Identification of allergies and poor adherence.'),
(5, 1, 1, 5, '5', 'Identification of Non-Adherence', NULL, 'Pharmacy technicians are ideally placed to identify patient’s with non-adherence to their medicines, such as an inability to use inhalers correctly, a fear of taking medications, or an inability to open clic locs or blister packs. These issues should be resolved and documented by the pharmacy technician or referred according to local policy.'),
(6, 1, 1, 6, '6', 'Identification of Allergies', NULL, 'It is important patient’s do not receive medicines they allergic to, nor be exposed to products that contain substances they are allergic to eg latex or nuts (some topical preparations contain nut oils). A pharmacy technician should:  <ul><li>Ensure that any allergy identified, including the type of reaction, is documented according to local procedure </li><li>Review the prescription to ensure that no culprit medicines have been prescribed.</li><li>Refer any patients who are prescribed medicines to which they have a documented allergy according to local procedure.</li></ul>  Pharmacy technicians should also be aware some patients describe diarrhoea with antibiotics as being allergic to them.'),
(7, 2, 1, 7, '1', 'Knowledge of Laws and Regulations', NULL, 'The member is familiar with pharmacy laws and regulations, especially as they pertain to pharmacy technician responsibilities.'),
(8, 2, 1, 8, '2', 'Drug Enforcement Administration (DEA) Knowledge', NULL, 'The member is knowledgeable of the Drug Enforcement Administration (DEA) and state requirements for controlled substances: the candidate shall be able to identify controlled substance labels, understand the rationale for controlled substances, the need for proper inventory and accountability, and the proper storage of controlled substances.'),
(9, 2, 1, 9, '3', 'Classification of Legend VS OTC', NULL, 'The member is knowledgeable of the Drug Enforcement Administration (DEA) and state requirements for controlled substances: the candidate shall be able to identify controlled substance labels, understand the rationale for controlled substances, the need for proper inventory and accountability, and the proper storage of controlled substances.'),
(10, 2, 1, 10, '4', 'Pharmaceutical Vocabulary', NULL, 'The member demonstrates a thorough knowledge of general pharmaceutical and medical terminology, the apothecary symbols, abbreviations (English and Latin), and the common chemical symbols.'),
(11, 3, 1, 11, '1', 'Prioritization', NULL, 'The technician should be able to prioritize his/her own work and adjust priorities in response to changing circumstances; for example, knowing which patients/tasks take priority. We recognise that it is not possible or necessary to review the pharmaceutical care of every patient, every day.'),
(12, 3, 1, 12, '2', 'Punctuality', NULL, 'The pharmacy technician should ensure satisfactory completion of tasks with appropriate handover and recognise the importance of punctuality and attention to detail.'),
(13, 3, 1, 13, '3', 'Initiative', NULL, 'The pharmacy technician should demonstrate initiative in solving a problem or taking on a new opportunity/task without the prompting from others, and demonstrate the ability to work independently within their limitations.'),
(14, 3, 1, 14, '4', 'Efficiency', NULL, 'This section deals with time management, and the pharmacy technician should demonstrate efficient use of their time. An example could be reviewing the allocated patients in the given time to an appropriate standard.'),
(15, 3, 1, 15, '5', 'Patient and Carer', NULL, 'The "carer" may be a friend or relative as well as a social services or private agency care worker.'),
(16, 4, 2, 1, '1', 'Do all Pharmacy workstations, stock areas, will call, front/back counters and compounding appear neat, clean, organized and free of food/beverages?', NULL, NULL),
(17, 4, 2, 1, '2', 'Is the pharmacy fully staffed and are team members scheduled appropriately (peak days/ times)?', NULL, NULL),
(18, 4, 2, 1, '3', 'Partner with ETL-HR/ETL-Pharmacy and pull training meter report to determine if all team members have completed all required training?', NULL, NULL),
(19, 5, 2, 2, '4', 'Does team member determine if guest/pet is a new or existing patient? (TM should only offer paper patient profile, if requested)', NULL, NULL),
(20, 5, 2, 2, '5', 'Does team member accurately select the correct guest from patient search using last and first name and DOB?', NULL, NULL),
(21, 5, 2, 2, '6', 'Does team member verify that all guest information and maintenance tasks were correctly verified, including name, DOB, address, phone # and allergies?', NULL, NULL),
(22, 5, 2, 2, '7', 'Does team member check on-hands to ensure that the quantity is in stock?', NULL, NULL),
(23, 5, 2, 3, '8', 'Does team member select the correct Pick Up type (Urgent, Waiting, Shopping, Today, Future Date)?', NULL, NULL),
(24, 5, 2, 3, '9', 'If Refill, did the team member complete guest maintenance tasks and let guests know they are out of refills and create an Open Call Queue to alert prescriber?', NULL, NULL),
(25, 5, 2, 3, '10', 'Does team member ensure scan was successful and all relevant information is clearly captured on both sides of the prescription?', NULL, NULL),
(26, 5, 2, 3, '11', 'Does team member place the hard copy prescription in the hard copy container?', NULL, NULL),
(27, 5, 2, 3, '12', 'Does team member add the prescription to the queue to ensure proper prioritization?', NULL, NULL),
(28, 5, 2, 2, '13', 'If a prescription is called in from a prescriber or transferred, did only a pharmacist complete this task? (Pharmacist should use a blank prescription pad for all oral and transferred prescriptions)', NULL, NULL),
(29, 5, 2, 2, '14', 'If guest does not want a safety cap, does team member select NO and scan a waiver form into Patient Info Image?', NULL, NULL),
(30, 6, 2, 3, '15', 'Does team member review all notes associated with the prescription?', NULL, NULL),
(31, 6, 2, 3, '16', 'Does team member accurately select DAW and enter all elements of the hard copy?', NULL, NULL),
(32, 6, 2, 3, '17', 'Does team member search for prescribed drug (Drug Field) and select the right drug based on DAW? (Enter at least the first four letters of the drug name to get a better match)', NULL, NULL),
(33, 6, 2, 3, '18', 'Does team member enter the correct date and prescriber written on the prescription?', NULL, NULL),
(34, 6, 2, 4, '19', 'Does team member get clarification from the pharmacist, if they are unclear or don''t understand hard copy image?', NULL, NULL),
(35, 6, 2, 4, '20', 'Does team member provide notes that are related to the drug, if necessary?', NULL, NULL),
(36, 6, 2, 4, '21', 'Does team member reject the order if review is required or if they need more information?', NULL, NULL),
(37, 6, 2, 4, '22', 'Does team member properly handle any third party rejects/warnings and make any necessary edits?', NULL, NULL),
(38, 6, 2, 4, '23', 'Does team member obtain a white or red basket based on Pick Up type?', NULL, NULL),
(39, 7, 2, 4, '24', 'Does team member start fill task in order of priority? (Red or White basket)v', NULL, NULL),
(40, 7, 2, 4, '25', 'Does team member obtain stock bottle from shelf, scan user barcode, scan the ClearRx label, scan the stock bottle and wait for a positive beep and green light to confirm accuracy?', NULL, NULL),
(41, 7, 2, 4, '26', 'Does same team member fill all prescriptions in order and complete only one order at a time? (Team member should not batch orders)', NULL, NULL),
(42, 7, 2, 4, '27', 'Does team member pull ClearRx bottle, count and measure and label correctly according to quantity field?', NULL, NULL),
(43, 7, 2, 5, '28', 'For liquid dosage form, did team member select the correct dispensing device? (PIBA, syringe)', NULL, NULL),
(44, 7, 2, 5, '29', 'Does team member accurately prepare order for pharmacist verification and immediately return the stock bottle to the shelf? (if unit of use stock bottle, TM should include stock bottle for verificatio', NULL, NULL),
(45, 7, 2, 5, '30', 'Does team member update expiration, if necessary? (Topicals, Liquids, etc.)', NULL, NULL),
(46, 8, 2, 5, '31', 'Does Pharmacist initiate task by scanning the ClearRx bottle label?', NULL, NULL),
(47, 8, 2, 5, '32', 'Does Pharmacist review all notes provided during order/data entry?', NULL, NULL),
(48, 8, 2, 5, '33', 'Does Pharmacist accurately complete seven point check? (Patient, DUR, SIG, Quantity, Prescriber, DAW) by reviewing the information against scanned hardcopy image.', NULL, NULL),
(49, 8, 2, 5, '34', 'Does Pharmacist open the bottle and validate that the product matches drug image as well as product name, appearance, quantity and ring color?', NULL, NULL),
(50, 8, 2, 6, '35', 'Does Pharmacist evaluate all DURs and drug therapy issues and take appropriate action as needed? (Medication Review; Call Doctor or add notes when they override a DUR)', NULL, NULL),
(51, 8, 2, 6, '36', 'Does Pharmacist reject the prescription correctly and select the right reason code if errors were found? (Sent Back to Data Entry by selecting Return to Data Entry for Correction)', NULL, NULL),
(52, 8, 2, 6, '37', 'Does Pharmacist add notes or remove for prescription for this fill or all fills, if needed? Counseling Required? Different generic than previous fill?', NULL, NULL),
(53, 8, 2, 6, '38', 'Did Pharmacist select the correct will call bin for placement? (Bulk/Fridge/Mix/Will Call)', NULL, NULL),
(54, 8, 2, 6, '39', 'Were prescriptions filed in appropriate will call section by using guest''s last name in each section? Did team clip multiple prescriptions for the same guest?', NULL, NULL),
(55, 9, 2, 6, '40', 'Does team member obtain and search the first, last name and DOB of the guest in Will Call from EPS Welcome Screen and determine number of prescription to be picked up?', NULL, NULL),
(56, 9, 2, 6, '41', 'Does team member check screen for any release notes and offere counseling by pharmacist? (pharmacy services, auto-refill)', NULL, NULL),
(57, 9, 2, 6, '42', 'Does team member correctly retrieve the prescription from the correct location? (Fridge/Bulk/ Mix/Will Call)', NULL, NULL),
(58, 9, 2, 6, '43', 'Does team member remove contents of bag and verify order by reviewing guest name, DOB, address, phone number, and that product matches what guest is expecting?', NULL, NULL),
(59, 9, 2, 7, '44', 'Does team member determine if counseling is required and alert the Pharmacist?', NULL, NULL),
(60, 9, 2, 7, '45', 'If counseling is required or requested, does Pharmacist provide counseling? (Counseling should offered on all new prescriptions)', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `question_group`
--

CREATE TABLE IF NOT EXISTS `question_group` (
  `id` int(11) NOT NULL,
  `instrument_id` int(11) NOT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `number` varchar(40) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `summary` varchar(500) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question_group`
--

INSERT INTO `question_group` (`id`, `instrument_id`, `tag`, `number`, `sort_order`, `summary`, `description`) VALUES
(1, 1, 'Delivery of Patient Care', '1', 1, NULL, NULL),
(2, 1, 'Pharmacy Law and Ethics', '2', 2, NULL, NULL),
(3, 1, 'Personal Competencies', '3', 3, NULL, NULL),
(4, 2, 'Brand', '1', 1, NULL, NULL),
(5, 2, 'Create an Order', '2', 2, NULL, NULL),
(6, 2, 'Adding Prescription Information', '3', 3, NULL, NULL),
(7, 2, 'Filling', '4', 4, NULL, NULL),
(8, 2, 'Pharmacist Verification', '5', 5, NULL, NULL),
(9, 2, 'Prescription Pickup', '6', 6, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `question_type`
--

CREATE TABLE IF NOT EXISTS `question_type` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `summary` varchar(500) DEFAULT NULL,
  `min_range` double DEFAULT '0',
  `max_range` double DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question_type`
--

INSERT INTO `question_type` (`id`, `name`, `summary`, `min_range`, `max_range`) VALUES
(1, 'LIKERT5', 'Likert scale, 0 t0 5.', 0, 5),
(2, 'NAYesNo', 'N/A,Yes,No', 0, 2);

-- --------------------------------------------------------

--
-- Table structure for table `question_type_response`
--

CREATE TABLE IF NOT EXISTS `question_type_response` (
  `id` int(11) NOT NULL,
  `question_type_id` int(11) NOT NULL,
  `sort_order` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `value` varchar(500) DEFAULT NULL,
  `rubric` varchar(500) DEFAULT NULL,
  `icon_prefix` varchar(50) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question_type_response`
--

INSERT INTO `question_type_response` (`id`, `question_type_id`, `sort_order`, `name`, `value`, `rubric`, `icon_prefix`) VALUES
(1, 1, 0, '-unset-', '-1', '', 'levelBg'),
(2, 1, 1, 'Unacceptable', '0', '', 'levelBg'),
(3, 1, 2, 'Needs Improvement', '1', '', 'levelBg'),
(4, 1, 3, 'Proficient', '2', '', 'levelBg'),
(5, 1, 4, 'Distinguished', '3', '', 'levelBg'),
(6, 2, 0, '-unset-', '-1', '', 'yesNoBg'),
(7, 2, 1, 'Yes', '2', '', 'yesNoBg'),
(8, 2, 2, 'No', '1', '', 'yesNoBg');

-- --------------------------------------------------------

--
-- Table structure for table `resource`
--

CREATE TABLE IF NOT EXISTS `resource` (
  `id` int(11) NOT NULL,
  `resource_type_id` char(1) DEFAULT 'T',
  `role_ids` varchar(10) DEFAULT 'PM',
  `number` varchar(40) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `location` varchar(500) DEFAULT NULL,
  `summary` varchar(5000) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `resource`
--

INSERT INTO `resource` (`id`, `resource_type_id`, `role_ids`, `number`, `name`, `location`, `summary`, `description`) VALUES
(1, 'T', 'PM', 'PHT001', 'Introduction to the Pharmacy, for Technicians', NULL, 'This module provides a general overview.', NULL),
(2, 'T', 'PM', 'PHT002', 'Allergy Identification', NULL, 'Important characteristics of current and evolving advanced technician practice models\n            include training through an ASHP accredited training program, PTCB certification, and licensure with a Board of Pharmacy.', NULL),
(3, 'T', 'PM', 'PHT003', 'Assessing Patients', NULL, 'This module provides a general overview.', NULL),
(4, 'T', 'PM', 'PHT004', 'Adherence Assessment', NULL, 'This module provides a general overview.', NULL),
(5, 'T', 'PM', 'PHT005', 'Prescription Labeling', NULL, 'This module provides a general overview.', NULL),
(6, 'T', 'PM', 'PHT006', 'Code of Conduct', NULL, 'This module provides a general overview.', NULL),
(7, 'T', 'PM', 'PHT007', 'Drug Interactions', NULL, 'This module provides a general overview.', NULL),
(8, 'T', 'PM', 'PHT008', 'Preventive Care', NULL, 'This module provides a general overview.', NULL),
(9, 'T', 'PM', 'PHT009', 'Calculations', NULL, 'Pharmacy Calculations: An Introduction for Pharmacy Technicians, is designed for pharmacy technician students enrolled in a training program, technicians preparing for the certification exam, and for on-site training. As the role for pharmacy technicians continues to evolve and expand one thing remains constant. The safety of patients is the highest priority for anyone working in pharmacy, whether in hospital, retail, or institutional practices. With a thorough understanding of pharmacy math comes accuracy in computations and safety and quality in practice.', NULL),
(10, 'T', 'PM', 'PHT010', 'Preventing Errors with Look-Alike and Sound-Alike Drug Names', NULL, 'Drug names can often sound similar or appear similar. In addition the appearance of the products can look similar enough to cause confusion. These can easily be confused contributing to adverse medication events.', NULL),
(11, 'T', 'PM', 'PHT011', 'Confusion Pairs and Confusion Categories', NULL, NULL, NULL),
(12, 'T', 'PM', 'PHT012', 'High Risk High Alert Medication Review (Case Studies)', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `resource_alignment`
--

CREATE TABLE IF NOT EXISTS `resource_alignment` (
  `id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `weight` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `resource_alignment`
--

INSERT INTO `resource_alignment` (`id`, `resource_id`, `question_id`, `weight`) VALUES
(1, 1, 1, 1),
(3, 3, 3, 1),
(6, 3, 2, 1),
(7, 4, 5, 1),
(8, 5, 40, 1),
(9, 5, 42, 1),
(10, 5, 46, 1),
(11, 6, 5, 1),
(12, 6, 60, 1),
(13, 7, 8, 1),
(14, 7, 32, 1),
(15, 7, 35, 1),
(16, 7, 49, 1),
(17, 7, 50, 1),
(18, 8, 15, 1),
(19, 9, 4, 1),
(20, 4, 1, 2),
(21, 4, 2, 2),
(22, 4, 3, 3),
(23, 4, 4, 1),
(24, 4, 6, 3),
(25, 4, 8, 2),
(26, 4, 9, 2),
(27, 4, 10, 3),
(28, 4, 11, 3),
(29, 4, 12, 2),
(30, 4, 13, 2),
(31, 4, 59, 2),
(32, 4, 60, 1),
(44, 2, 1, 2),
(45, 2, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `resource_type`
--

CREATE TABLE IF NOT EXISTS `resource_type` (
  `id` char(1) NOT NULL,
  `name` varchar(100) NOT NULL,
  `summary` varchar(500) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `resource_type`
--

INSERT INTO `resource_type` (`id`, `name`, `summary`, `description`) VALUES
('T', 'Template', 'Local HTML template file.', NULL),
('W', 'Web', 'Web URL.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `id` char(1) NOT NULL,
  `name` varchar(100) NOT NULL,
  `summary` varchar(500) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `summary`, `description`) VALUES
('A', 'Administrator', NULL, NULL),
('M', 'Manager', NULL, NULL),
('P', 'Pharmacist', NULL, NULL),
('S', 'Sysadmin', NULL, NULL),
('T', 'Pharmacy Technician', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `algorithm_usage`
--
ALTER TABLE `algorithm_usage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `evaluation`
--
ALTER TABLE `evaluation`
  ADD PRIMARY KEY (`id`), ADD KEY `member_id` (`member_id`), ADD KEY `by_member_id` (`by_member_id`), ADD KEY `instrument_id` (`instrument_id`);

--
-- Indexes for table `evaluation_response`
--
ALTER TABLE `evaluation_response`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_evaluation_responses` (`evaluation_id`,`question_id`), ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `instrument`
--
ALTER TABLE `instrument`
  ADD PRIMARY KEY (`id`), ADD KEY `role_id` (`role_id`), ADD KEY `usage_id` (`usage_id`);

--
-- Indexes for table `learning_module`
--
ALTER TABLE `learning_module`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_id` (`id`), ADD KEY `resource_id` (`resource_id`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `username` (`username`), ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `member_badge`
--
ALTER TABLE `member_badge`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_id` (`id`);

--
-- Indexes for table `organization`
--
ALTER TABLE `organization`
  ADD PRIMARY KEY (`id`), ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `organization_outcome`
--
ALTER TABLE `organization_outcome`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_id` (`id`), ADD KEY `organization_id` (`organization_id`), ADD KEY `outcome_id` (`outcome_id`), ADD KEY `evaluator_id` (`evaluator_id`);

--
-- Indexes for table `outcome`
--
ALTER TABLE `outcome`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_id` (`id`);

--
-- Indexes for table `outcome_alignment`
--
ALTER TABLE `outcome_alignment`
  ADD PRIMARY KEY (`id`), ADD KEY `outcome_id` (`outcome_id`), ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `outcome_event`
--
ALTER TABLE `outcome_event`
  ADD PRIMARY KEY (`id`,`outcome_id`), ADD UNIQUE KEY `unique_id` (`id`), ADD KEY `outcome_id` (`outcome_id`), ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`), ADD KEY `question_group_id` (`question_group_id`);

--
-- Indexes for table `question_group`
--
ALTER TABLE `question_group`
  ADD PRIMARY KEY (`id`), ADD KEY `instrument_id` (`instrument_id`);

--
-- Indexes for table `question_type`
--
ALTER TABLE `question_type`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `question_type_response`
--
ALTER TABLE `question_type_response`
  ADD PRIMARY KEY (`id`), ADD KEY `question_type_id` (`question_type_id`);

--
-- Indexes for table `resource`
--
ALTER TABLE `resource`
  ADD PRIMARY KEY (`id`), ADD KEY `resource_type_id` (`resource_type_id`);

--
-- Indexes for table `resource_alignment`
--
ALTER TABLE `resource_alignment`
  ADD PRIMARY KEY (`id`), ADD KEY `resource_id` (`resource_id`), ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `resource_type`
--
ALTER TABLE `resource_type`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `evaluation`
--
ALTER TABLE `evaluation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=47;
--
-- AUTO_INCREMENT for table `evaluation_response`
--
ALTER TABLE `evaluation_response`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1693;
--
-- AUTO_INCREMENT for table `instrument`
--
ALTER TABLE `instrument`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `learning_module`
--
ALTER TABLE `learning_module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `member_badge`
--
ALTER TABLE `member_badge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `organization`
--
ALTER TABLE `organization`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `organization_outcome`
--
ALTER TABLE `organization_outcome`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=56;
--
-- AUTO_INCREMENT for table `outcome`
--
ALTER TABLE `outcome`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `outcome_alignment`
--
ALTER TABLE `outcome_alignment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=75;
--
-- AUTO_INCREMENT for table `outcome_event`
--
ALTER TABLE `outcome_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=119;
--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=61;
--
-- AUTO_INCREMENT for table `question_group`
--
ALTER TABLE `question_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `question_type`
--
ALTER TABLE `question_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `question_type_response`
--
ALTER TABLE `question_type_response`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `resource`
--
ALTER TABLE `resource`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `resource_alignment`
--
ALTER TABLE `resource_alignment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=46;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `evaluation`
--
ALTER TABLE `evaluation`
ADD CONSTRAINT `evaluation_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
ADD CONSTRAINT `evaluation_ibfk_2` FOREIGN KEY (`by_member_id`) REFERENCES `member` (`id`),
ADD CONSTRAINT `evaluation_ibfk_3` FOREIGN KEY (`instrument_id`) REFERENCES `instrument` (`id`);

--
-- Constraints for table `evaluation_response`
--
ALTER TABLE `evaluation_response`
ADD CONSTRAINT `evaluation_response_ibfk_1` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluation` (`id`),
ADD CONSTRAINT `evaluation_response_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`);

--
-- Constraints for table `instrument`
--
ALTER TABLE `instrument`
ADD CONSTRAINT `instrument_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
ADD CONSTRAINT `instrument_ibfk_2` FOREIGN KEY (`usage_id`) REFERENCES `algorithm_usage` (`id`);

--
-- Constraints for table `learning_module`
--
ALTER TABLE `learning_module`
ADD CONSTRAINT `learning_module_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`);

--
-- Constraints for table `member`
--
ALTER TABLE `member`
ADD CONSTRAINT `member_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`);

--
-- Constraints for table `organization`
--
ALTER TABLE `organization`
ADD CONSTRAINT `organization_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `organization` (`id`);

--
-- Constraints for table `organization_outcome`
--
ALTER TABLE `organization_outcome`
ADD CONSTRAINT `organization_outcome_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
ADD CONSTRAINT `organization_outcome_ibfk_2` FOREIGN KEY (`outcome_id`) REFERENCES `outcome` (`id`),
ADD CONSTRAINT `organization_outcome_ibfk_3` FOREIGN KEY (`evaluator_id`) REFERENCES `member` (`id`);

--
-- Constraints for table `outcome_alignment`
--
ALTER TABLE `outcome_alignment`
ADD CONSTRAINT `outcome_alignment_ibfk_1` FOREIGN KEY (`outcome_id`) REFERENCES `outcome` (`id`),
ADD CONSTRAINT `outcome_alignment_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`);

--
-- Constraints for table `outcome_event`
--
ALTER TABLE `outcome_event`
ADD CONSTRAINT `outcome_event_ibfk_1` FOREIGN KEY (`outcome_id`) REFERENCES `outcome` (`id`),
ADD CONSTRAINT `outcome_event_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`);

--
-- Constraints for table `question`
--
ALTER TABLE `question`
ADD CONSTRAINT `question_ibfk_1` FOREIGN KEY (`question_group_id`) REFERENCES `question_group` (`id`);

--
-- Constraints for table `question_group`
--
ALTER TABLE `question_group`
ADD CONSTRAINT `question_group_ibfk_1` FOREIGN KEY (`instrument_id`) REFERENCES `instrument` (`id`);

--
-- Constraints for table `question_type_response`
--
ALTER TABLE `question_type_response`
ADD CONSTRAINT `question_type_response_ibfk_1` FOREIGN KEY (`question_type_id`) REFERENCES `question_type` (`id`);

--
-- Constraints for table `resource`
--
ALTER TABLE `resource`
ADD CONSTRAINT `resource_ibfk_1` FOREIGN KEY (`resource_type_id`) REFERENCES `resource_type` (`id`);

--
-- Constraints for table `resource_alignment`
--
ALTER TABLE `resource_alignment`
ADD CONSTRAINT `resource_alignment_ibfk_1` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`),
ADD CONSTRAINT `resource_alignment_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
