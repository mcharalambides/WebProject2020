-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 18, 2020 at 02:05 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Project2020`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `proc` ()  begin
declare flag int;
declare foot int;
declare walking int;
declare running int;
declare vehicle int;
declare exiting int;
declare bicycle int;
declare i int;
declare j int;
declare score float;
declare score1 int;
declare score2 int;
declare month int;
declare user VARCHAR(255);
declare userCursor cursor for select id from Users;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET flag=1;

open userCursor;

DELETE FROM UserScores;

set flag =0;
set j=0;
set score =0;

fetch userCursor into user;
select count(*) into i from Users;
while(j<i) do
  set j = j + 1;
  select count(*) into foot from Activity where user_id = user and type='ON_FOOT' and month(subTimestampMs) = month(curdate()) and year(subTimestampMs) = year(curdate()) group by type;
  select count(*) into vehicle from Activity where user_id = user and type='IN_VEHICLE' and month(subTimestampMs) = month(curdate()) and year(subTimestampMs) = year(curdate()) group by type;
  select count(*) into exiting from Activity where user_id = user and type='EXITING_VEHICLE' and month(subTimestampMs) = month(curdate())  and year(subTimestampMs) = year(curdate()) group by type;
  select count(*) into walking from Activity where user_id = user and type='WALKING' and month(subTimestampMs) = month(curdate()) and year(subTimestampMs) = year(curdate()) group by type;
  select count(*) into running from Activity where user_id = user and type='RUNNING' and month(subTimestampMs) = month(curdate()) and year(subTimestampMs) = year(curdate()) group by type;
  select count(*) into bicycle from Activity where user_id = user and type='ON_BICYCLE' and month(subTimestampMs) = month(curdate()) and year(subTimestampMs) = year(curdate()) group by type;
  if foot is null then
	set foot = 0;
  end if; 
  if vehicle is null then
	set vehicle = 0;
  end if; 
  if walking is null then
	set walking = 0;
  end if; 
  if exiting is null then
	set exiting = 0;
  end if; 
  if running is null then
	set running = 0;
  end if; 
  if bicycle is null then
	set bicycle = 0;
  end if; 
  
  set score1 = foot + walking + running + bicycle;
  set score2 = foot + vehicle + exiting + walking + bicycle + running;

  if(score2 =0) THEN
  	set score = null;
   else
    	set score = score1 / score2;
  end if;
    
  INSERT INTO UserScores VALUES(user,score,month(curdate()));
  fetch userCursor into user;
  set foot =0; set vehicle=0; set exiting=0; set walking =0; set bicycle=0; set running=0;
 end while;

  close userCursor;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `proc2` (IN `user` VARCHAR(255))  begin
declare foot int;
declare walking int;
declare running int;
declare vehicle int;
declare exiting int;
declare bicycle int;
declare j int;
declare score1 int;
declare score2 int;
declare score float;
declare cValue VARCHAR(10);

set j=0;
set score =0;
DELETE FROM UserScores;

while(j<12) do
  select count(*) into foot from Activity where user_id = user and type='ON_FOOT' and month(subTimestampMs) = month(DATE_SUB(curdate(), INTERVAL j MONTH)) and year(subTimestampMs) = year(DATE_SUB(curdate(), INTERVAL j MONTH)) group by type;
  select count(*) into vehicle from Activity where user_id = user and type='IN_VEHICLE' and month(subTimestampMs) = month(DATE_SUB(curdate(), INTERVAL j MONTH)) and year(subTimestampMs) = year(DATE_SUB(curdate(), INTERVAL j MONTH)) group by type;
  select count(*) into exiting from Activity where user_id = user and type='EXITING_VEHICLE' and month(subTimestampMs) = month(DATE_SUB(curdate(), INTERVAL j MONTH)) and year(subTimestampMs) = year(DATE_SUB(curdate(), INTERVAL j MONTH)) group by type;
  select count(*) into walking from Activity where user_id = user and type='WALKING' and month(subTimestampMs) = month(DATE_SUB(curdate(), INTERVAL j MONTH)) and year(subTimestampMs) = year(DATE_SUB(curdate(), INTERVAL j MONTH)) group by type;
  select count(*) into running from Activity where user_id = user and type='RUNNING' and month(subTimestampMs) = month(DATE_SUB(curdate(), INTERVAL j MONTH)) and year(subTimestampMs) = year(DATE_SUB(curdate(), INTERVAL j MONTH)) group by type;
  select count(*) into bicycle from Activity where user_id = user and type='ON_BICYCLE' and month(subTimestampMs) = month(DATE_SUB(curdate(), INTERVAL j MONTH)) and year(subTimestampMs) = year(DATE_SUB(curdate(), INTERVAL j MONTH)) group by type;
  if foot is null then
	set foot = 0;
  end if; 
  if vehicle is null then
	set vehicle = 0;
  end if; 
  if walking is null then
	set walking = 0;
  end if; 
  if exiting is null then
	set exiting = 0;
  end if; 
  if running is null then
	set running = 0;
  end if; 
  if bicycle is null then
	set bicycle = 0;
  end if; 
  
set score1 = foot + walking + running + bicycle;
set score2 = foot + vehicle + exiting + walking + bicycle + running;

  if(score2 =0) THEN
  	set score = null;
  else
    set score = score1 / score2;
  end if;
  
  set cValue = CONCAT(convert(month(DATE_SUB(curdate(), INTERVAL j MONTH)),CHAR),'/',convert(year(DATE_SUB(curdate(), INTERVAL j MONTH)),CHAR));
  INSERT INTO UserScores VALUES(user,score,cValue);
  set foot =0; set vehicle=0; set exiting=0; set walking =0; set bicycle=0; set running=0;
  set j = j + 1;
 end while;

end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Activity`
--

CREATE TABLE `Activity` (
  `user_id` varchar(255) NOT NULL,
  `timestampMs` datetime NOT NULL,
  `subTimestampMs` datetime NOT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`email`, `username`, `password`) VALUES
('admin@gmail.com', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `Arxeio`
--

CREATE TABLE `Arxeio` (
  `user_id` varchar(255) NOT NULL,
  `timestampMs` datetime NOT NULL,
  `heading` int(50) DEFAULT NULL,
  `velocity` int(50) DEFAULT NULL,
  `accuracy` int(50) NOT NULL,
  `altitude` int(50) DEFAULT NULL,
  `latitudeE7` bigint(20) NOT NULL,
  `longitudeE7` bigint(20) NOT NULL,
  `verticalAccuracy` int(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `last_upload` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `username`, `password`, `email`, `FirstName`, `LastName`, `last_upload`) VALUES
('Bkee4I8iTW5fTCkueipzUw==', 'marios', '$2y$10$yjkDkApr8HaLb2SyeaH5uObqu34HW5M6rFnN/7D8DnmbkCZ2wy71y', 'marios@gmail.com', '', '', NULL),
('EduvsSDa3dDgSQLe800m', 'kokos96', '$2y$10$.xitK..oFtOUZJle12on2uyAhbTwqsYu8iHbBhu4LBz.sGPWpcNXW', 'kokos@gmail.com', 'Γιώργος', 'Γεωργίου', NULL),
('GAfQT7jgiiNGBTWYdosQVw==', 'pampos', '$2y$10$W/m61LIQ5dEqgHoj6NxiP.YAf25l3RVoIFiH2AzN5SnSxydcG66Ze', 'pampos@gmail.com', '', '', NULL),
('GEdaaDR1anjnGJrdT6/O', 'kokos', '$2y$10$PKgnrsXhFddChif4D8e8nucP8omc39XqPNLIEdu..82uW//v97otm', 'kokos@gmail.com', '', '', NULL),
('GrLdOIIPInKDHn/w12ZuZQI=', 'andreas', '$2y$10$vUETwzmflXQQvSZKIW1VeO1r9uDBo1TslcnR.ohZ1rI3naeamnEAi', 'andreas@gmail.com', '', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `UserScores`
--

CREATE TABLE `UserScores` (
  `user_id` varchar(255) NOT NULL,
  `score` float DEFAULT NULL,
  `month` varchar(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `UserScores`
--

INSERT INTO `UserScores` (`user_id`, `score`, `month`) VALUES
('24xr3SbEQazGqFNB9UI4', NULL, '9'),
('3mFbyG3svLAaOL2EbHtJEw==', NULL, '9'),
('Bkee4I8iTW5fTCkueipzUw==', NULL, '9'),
('EduvsSDa3dDgSQLe800m', 1, '9'),
('GAfQT7jgiiNGBTWYdosQVw==', NULL, '9'),
('GEdaaDR1anjnGJrdT6/O', NULL, '9'),
('GrLdOIIPInKDHn/w12ZuZQI=', NULL, '9'),
('VBjEpsQulNrUg72GuSpu', NULL, '9'),
('WcFOt3l/D3ML2Wby2drKNoQ=', NULL, '9'),
('j54QB/oGOovyJGYvPDSR', NULL, '9'),
('k3/fYLKtv2XR8kY07sJzkm8=', NULL, '9'),
('z8fbx1r8yLMCUJSwxxfplYk=', NULL, '9');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
