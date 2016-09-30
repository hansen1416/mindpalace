-- MySQL dump 10.13  Distrib 5.7.15, for Linux (x86_64)
--
-- Host: localhost    Database: mindpalace
-- ------------------------------------------------------
-- Server version	5.7.13-0ubuntu0.16.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mp_ctg`
--

DROP TABLE IF EXISTS `mp_ctg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_ctg` (
  `ctg_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `pid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '父分类ID',
  `space_id` int(10) unsigned NOT NULL COMMENT '空间ID',
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `tier` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '层序号',
  `sort` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `path` varchar(255) NOT NULL COMMENT '分类的族谱',
  `title` varchar(255) NOT NULL COMMENT '分类名',
  `private` smallint(1) unsigned NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`ctg_id`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_ctg`
--

LOCK TABLES `mp_ctg` WRITE;
/*!40000 ALTER TABLE `mp_ctg` DISABLE KEYS */;
INSERT INTO `mp_ctg` VALUES (1,0,1,1,0,0,'-0-','PHP',0,'2016-08-07 04:07:03','0000-00-00 00:00:00'),(2,1,1,1,1,0,'-0-1-','函数',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(3,0,2,1,0,0,'-0-','JavaScript',0,'2016-08-07 04:09:28','0000-00-00 00:00:00'),(4,3,2,1,1,0,'-0-3-','变量、作用域和内存',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(5,1,1,1,1,0,'-0-1-','实用技巧',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(6,5,1,1,2,0,'-0-1-5-','无限分类',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(7,1,1,1,1,0,'-0-1-','面向对象',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(8,0,3,1,0,0,'-0-','CSS',0,'2016-08-07 04:09:28','0000-00-00 00:00:00'),(9,8,3,1,1,0,'-0-8-','transform',0,'2016-08-06 20:07:52','0000-00-00 00:00:00'),(10,16,3,1,3,0,'-0-8-9-16-','matrix3d',0,'2016-08-06 20:07:52','0000-00-00 00:00:00'),(11,8,3,1,1,0,'-0-8-','background',0,'2016-08-06 20:07:52','0000-00-00 00:00:00'),(12,34,5,1,2,0,'-0-32-34-','Version Control',0,'2016-08-24 00:14:37','0000-00-00 00:00:00'),(13,12,5,1,3,0,'-0-32-34-12-','Git',0,'2016-08-24 00:14:37','0000-00-00 00:00:00'),(14,12,5,1,3,0,'-0-32-34-12-','SVN',0,'2016-08-24 00:14:37','0000-00-00 00:00:00'),(15,9,3,1,2,0,'-0-8-9-','transform2d',0,'2016-08-06 20:07:52','0000-00-00 00:00:00'),(16,9,3,1,2,0,'-0-8-9-','transform3d',0,'2016-08-06 20:07:52','0000-00-00 00:00:00'),(17,3,2,1,1,0,'-0-3-','函数收集',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(18,3,2,1,1,0,'-0-3-','事件',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(19,18,2,1,2,0,'-0-3-18-','事件类型',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(20,19,2,1,3,0,'-0-3-18-19-','触摸与手势事件',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(21,3,2,1,1,0,'-0-3-','方法',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(22,16,3,1,3,0,'-0-8-9-16-','perspective-origin',0,'2016-08-06 20:07:52','0000-00-00 00:00:00'),(23,4,2,1,2,0,'-0-3-4-','垃圾收集',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(24,4,2,1,2,0,'-0-3-4-','基本类型和引用类型的值',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(25,4,2,1,2,0,'-0-3-4-','执行环境及作用域',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(26,3,2,1,1,0,'-0-3-','Chrome devtools',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(27,26,2,1,2,0,'-0-3-26-','Profile',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(29,0,4,1,0,0,'-0-','HTML5',0,'2016-08-07 04:09:28','0000-00-00 00:00:00'),(30,29,4,1,1,0,'-0-29-','SVG',0,'2016-08-06 20:08:21','0000-00-00 00:00:00'),(32,0,5,1,0,0,'-0-','日常',0,'2016-08-07 04:09:28','0000-00-00 00:00:00'),(34,32,5,1,1,0,'-0-32-','计划',0,'2016-08-06 20:11:07','0000-00-00 00:00:00'),(35,115,5,1,2,0,'-0-32-115-','道',0,'2016-08-24 01:31:55','0000-00-00 00:00:00'),(36,35,5,1,3,0,'-0-32-115-35-','道德经',0,'2016-08-24 01:31:55','0000-00-00 00:00:00'),(37,3,2,1,1,0,'-0-3-','DOM2 和 DOM3',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(38,37,2,1,2,0,'-0-3-37-','DOM变化',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(39,38,2,1,3,0,'-0-3-37-38-','针对XML命名空间的变化',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(40,30,4,1,2,0,'-0-29-30-','Coordinate Systems, Transformations and Units',0,'2016-08-06 20:08:21','0000-00-00 00:00:00'),(41,30,4,1,2,0,'-0-29-30-','Paths',0,'2016-08-06 20:08:21','0000-00-00 00:00:00'),(42,30,4,1,2,0,'-0-29-30-','Text',0,'2016-08-06 20:08:21','0000-00-00 00:00:00'),(43,30,4,1,2,0,'-0-29-30-','Basic Shapes',0,'2016-08-06 20:08:21','0000-00-00 00:00:00'),(44,5,1,1,2,0,'-0-1-5-','冒泡排序',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(45,5,1,1,2,0,'-0-1-5-','自动加载',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(46,5,1,1,2,0,'-0-1-5-','重载与重写',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(47,0,6,1,0,0,'-0-','MySql',0,'2016-08-07 04:09:28','0000-00-00 00:00:00'),(48,47,6,1,1,0,'-0-47-','索引',0,'2016-08-06 20:08:55','0000-00-00 00:00:00'),(49,1,1,1,1,0,'-0-1-','框架',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(50,51,1,1,3,0,'-0-1-49-51-','数据库',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(51,49,1,1,2,0,'-0-1-49-','Yii',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(52,50,1,1,4,0,'-0-1-49-51-50-','AR',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(53,1,1,1,1,0,'-0-1-',' 错误',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(54,53,1,1,2,0,'-0-1-53-','Notice',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(55,2,1,1,2,0,'-0-1-2-','C',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(56,55,1,1,3,0,'-0-1-2-55-','Curl',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(57,5,1,1,2,0,'-0-1-5-','IP',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(58,57,1,1,3,0,'-0-1-5-57-','外网IP',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(59,51,1,1,3,0,'-0-1-49-51-','类',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(60,59,1,1,4,0,'-0-1-49-51-59-','system.web',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(61,60,1,1,5,0,'-0-1-49-51-59-60-','CWebModule',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(62,7,1,1,2,0,'-0-1-7-','魔术方法',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(63,62,1,1,3,0,'-0-1-7-62-','__construct()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(64,62,1,1,3,0,'-0-1-7-62-',' __destruct()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(65,62,1,1,3,0,'-0-1-7-62-','__call()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(66,62,1,1,3,0,'-0-1-7-62-','__callStatic()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(67,62,1,1,3,0,'-0-1-7-62-','__get()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(68,62,1,1,3,0,'-0-1-7-62-','__set()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(69,62,1,1,3,0,'-0-1-7-62-','__isset()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(70,62,1,1,3,0,'-0-1-7-62-','__unset()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(71,62,1,1,3,0,'-0-1-7-62-','__sleep()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(72,62,1,1,3,0,'-0-1-7-62-','__wakeup()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(73,62,1,1,3,0,'-0-1-7-62-','__toString()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(74,62,1,1,3,0,'-0-1-7-62-','__invoke()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(75,62,1,1,3,0,'-0-1-7-62-','__set_state()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(76,62,1,1,3,0,'-0-1-7-62-','__clone()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(77,62,1,1,3,0,'-0-1-7-62-','__debugInfo()',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(78,32,5,1,1,0,'-0-32-','带科通',0,'2016-08-06 20:11:07','0000-00-00 00:00:00'),(79,59,1,1,4,0,'-0-1-49-51-59-','CFilter',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(80,47,6,1,1,0,'-0-47-','JOIN',0,'2016-08-06 20:08:55','0000-00-00 00:00:00'),(81,2,1,1,2,0,'-0-1-2-','D',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(82,3,2,1,1,0,'-0-3-','前端框架',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(83,82,2,1,2,0,'-0-3-82-','BOOTSTRAP',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(84,1,1,1,1,0,'-0-1-','正则',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(86,29,4,1,1,0,'-0-29-','FORM',0,'2016-08-06 20:08:21','0000-00-00 00:00:00'),(87,3,2,1,1,0,'-0-3-','jQuery',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(88,87,2,1,2,0,'-0-3-87-','checkbox',0,'2016-08-06 20:07:34','0000-00-00 00:00:00'),(89,50,1,1,4,0,'-0-1-49-51-50-','Criteria',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(90,2,1,1,2,0,'-0-1-2-','S',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(91,51,1,1,3,0,'-0-1-49-51-','模型',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(92,91,1,1,4,0,'-0-1-49-51-91-','RULES',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(93,47,6,1,1,0,'-0-47-','WHERE',0,'2016-08-06 20:08:55','0000-00-00 00:00:00'),(94,51,1,1,3,0,'-0-1-49-51-','扩展',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(95,1,1,1,1,0,'-0-1-','扩展工具',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(96,95,1,1,2,0,'-0-1-95-','PHPExcel',0,'2016-08-06 20:04:38','0000-00-00 00:00:00'),(97,47,6,1,1,0,'-0-47-','关联查询',0,'2016-08-06 20:08:55','2016-05-03 19:35:47'),(98,47,6,1,1,0,'-0-47-','int类型',0,'2016-08-06 20:08:55','2016-05-03 19:39:08'),(99,78,5,1,2,0,'-0-32-78-','机构经纪人',0,'2016-08-06 20:11:07','2016-05-09 00:20:02'),(100,99,5,1,3,0,'-0-32-78-99-','普通变机构案场确认带访人分配的问题',0,'2016-08-06 20:11:07','2016-05-09 17:58:40'),(101,78,5,1,2,0,'-0-32-78-','测试统计',0,'2016-08-06 20:11:07','2016-06-13 01:50:37'),(102,78,5,1,2,0,'-0-32-78-','私有化测试',0,'2016-08-06 20:11:07','2016-07-14 01:04:01'),(103,102,5,1,3,0,'-0-32-78-102-','心份额里',0,'2016-08-06 20:11:07','2016-07-25 22:20:23'),(104,103,5,1,4,0,'-0-32-78-102-103-','萨达',0,'2016-08-06 20:11:07','2016-07-25 22:28:43'),(105,104,5,1,5,0,'-0-32-78-102-103-104-','P此说',0,'2016-08-06 20:11:07','2016-07-25 22:36:07'),(106,35,5,1,3,0,'-0-32-115-35-','light',0,'2016-08-24 01:31:55','2016-07-27 22:20:33'),(107,35,5,1,3,0,'-0-32-115-35-','koon11',0,'2016-08-24 01:31:55','2016-07-27 22:23:37'),(108,82,2,1,2,0,'-0-3-82-','同类分类1',0,'2016-08-06 20:07:34','2016-07-28 17:42:54'),(109,108,2,1,3,0,'-0-3-82-108-','诺博',0,'2016-08-06 20:07:34','2016-07-28 17:43:53'),(110,108,2,1,3,0,'-0-3-82-108-','李开复',0,'2016-08-06 20:07:34','2016-07-28 17:44:59'),(111,109,2,1,4,0,'-0-3-82-108-109-','惹人温热',0,'2016-08-06 20:07:34','2016-07-28 17:45:17'),(112,114,5,1,6,0,'-0-32-78-101-180-113-114-','A壹',0,'2016-08-24 23:54:04','2016-07-28 17:57:06'),(113,180,5,1,4,0,'-0-32-78-101-180-','A11',0,'2016-08-24 23:54:03','2016-07-28 17:57:18'),(114,113,5,1,5,0,'-0-32-78-101-180-113-','A111',0,'2016-08-24 23:54:04','2016-07-28 17:57:38'),(115,32,5,1,1,0,'-0-32-','2016计划',0,'2016-08-24 01:32:20','2016-07-28 18:10:18'),(116,35,7,1,0,0,'-0-','基础部分',0,'2016-08-08 07:21:55','2016-08-08 06:03:26'),(117,116,7,1,1,0,'-0-116-','五十音',0,'2016-08-23 07:09:07','2016-07-28 17:00:53'),(118,117,7,1,2,1,'-0-116-117-','あ ア a',0,'2016-08-23 07:09:07','2016-07-31 17:01:06'),(119,117,7,1,2,2,'-0-116-117-','い イ i',0,'2016-08-23 07:09:07','2016-07-31 17:01:14'),(120,117,7,1,2,3,'-0-116-117-','う ウ u',0,'2016-08-23 07:09:07','2016-07-31 17:01:19'),(121,117,7,1,2,4,'-0-116-117-','え エ e',0,'2016-08-23 07:09:07','2016-07-31 17:01:23'),(122,117,7,1,2,5,'-0-116-117-','お オ o',0,'2016-08-23 07:09:07','2016-07-31 17:01:26'),(123,0,7,1,0,0,'-0-','ＰＨＰ',0,'2016-08-23 07:09:07','2016-07-31 17:02:38'),(124,116,7,1,1,0,'-0-116-','音调',0,'2016-08-23 07:09:07','2016-07-31 17:02:59'),(125,0,7,1,0,0,'-0-','Database',0,'2016-08-23 07:09:07','2016-07-31 17:03:24'),(126,117,7,1,2,6,'-0-116-117-','か カ ka',0,'2016-08-23 07:09:07','2016-08-02 22:50:02'),(127,117,7,1,2,7,'-0-116-117-','き キ ki',0,'2016-08-23 07:09:07','2016-08-02 22:50:11'),(128,117,7,1,2,8,'-0-116-117-','く ク ku',0,'2016-08-23 07:09:07','2016-08-02 22:50:17'),(129,117,7,1,2,9,'-0-116-117-','け ケ ke',0,'2016-08-23 07:09:07','2016-08-02 22:50:22'),(130,117,7,1,2,10,'-0-116-117-','こ コ ko',0,'2016-08-23 07:09:07','2016-08-02 22:50:59'),(131,117,7,1,2,11,'-0-116-117-','さ サ sa',0,'2016-08-23 07:09:07','2016-08-02 22:51:22'),(132,117,7,1,2,12,'-0-116-117-','し シ shi',0,'2016-08-23 07:09:07','2016-08-02 22:51:32'),(133,117,7,1,2,13,'-0-116-117-','す ス su',0,'2016-08-23 07:09:07','2016-08-02 22:51:40'),(134,117,7,1,2,14,'-0-116-117-','せ セ se',0,'2016-08-23 07:09:07','2016-08-02 22:51:45'),(135,117,7,1,2,15,'-0-116-117-','そ ソ so',0,'2016-08-23 07:09:07','2016-08-02 22:51:51'),(136,117,7,1,2,16,'-0-116-117-','た タ ta',0,'2016-08-23 07:09:07','2016-08-02 22:52:03'),(137,117,7,1,2,17,'-0-116-117-','ち チ chi',0,'2016-08-23 07:09:07','2016-08-02 22:52:08'),(138,117,7,1,2,18,'-0-116-117-','つ ツ tsu',0,'2016-08-23 07:09:07','2016-08-02 22:52:16'),(139,117,7,1,2,19,'-0-116-117-','て テ te',0,'2016-08-23 07:09:07','2016-08-02 22:52:21'),(140,117,7,1,2,20,'-0-116-117-','と ト to',0,'2016-08-23 07:09:07','2016-08-02 22:52:26'),(141,117,7,1,2,21,'-0-116-117-','な ナ na',0,'2016-08-23 07:09:07','2016-08-02 22:52:30'),(142,117,7,1,2,22,'-0-116-117-','に ニ ni',0,'2016-08-23 07:09:07','2016-08-02 22:52:34'),(143,117,7,1,2,23,'-0-116-117-','ぬ ヌ nu',0,'2016-08-23 07:09:07','2016-08-02 22:52:38'),(144,117,7,1,2,24,'-0-116-117-','ね ネ ne',0,'2016-08-23 07:09:07','2016-08-02 22:52:42'),(145,117,7,1,2,25,'-0-116-117-','の ノ no',0,'2016-08-23 07:09:07','2016-08-02 22:52:47'),(146,117,7,1,2,26,'-0-116-117-','は ハ ha',0,'2016-08-23 07:09:07','2016-08-02 22:52:57'),(147,117,7,1,2,27,'-0-116-117-','ひ ヒ hi',0,'2016-08-23 07:09:07','2016-08-02 22:53:02'),(148,117,7,1,2,28,'-0-116-117-','ふ フ fu',0,'2016-08-23 07:09:07','2016-08-02 22:53:07'),(149,117,7,1,2,29,'-0-116-117-','へ ヘ he',0,'2016-08-23 07:09:07','2016-08-02 22:53:14'),(150,117,7,1,2,30,'-0-116-117-','ほ ホ ho',0,'2016-08-23 07:09:07','2016-08-02 22:53:19'),(151,117,7,1,2,31,'-0-116-117-','ま マ ma',0,'2016-08-23 07:09:07','2016-08-02 22:53:25'),(152,117,7,1,2,32,'-0-116-117-','み ミ mi',0,'2016-08-23 07:09:07','2016-08-02 22:53:29'),(153,117,7,1,2,33,'-0-116-117-','む ム mu',0,'2016-08-23 07:09:07','2016-08-02 22:53:35'),(154,117,7,1,2,34,'-0-116-117-','め メ me',0,'2016-08-23 07:09:07','2016-08-02 22:53:39'),(155,117,7,1,2,35,'-0-116-117-','も モ mo',0,'2016-08-23 07:09:07','2016-08-02 22:53:44'),(156,117,7,1,2,36,'-0-116-117-','や ヤ ya',0,'2016-08-23 07:09:07','2016-08-02 22:54:04'),(157,117,7,1,2,37,'-0-116-117-','ゆ ユ yu',0,'2016-08-23 07:09:07','2016-08-02 22:54:09'),(158,117,7,1,2,38,'-0-116-117-','よ ヨ yo',0,'2016-08-23 07:09:07','2016-08-02 22:54:14'),(159,117,7,1,2,39,'-0-116-117-','ら ラ ra',0,'2016-08-23 07:09:07','2016-08-02 22:54:18'),(160,117,7,1,2,40,'-0-116-117-','り リ ri',0,'2016-08-23 07:09:07','2016-08-02 22:54:24'),(161,117,7,1,2,41,'-0-116-117-','る ル ru',0,'2016-08-23 07:09:07','2016-08-02 22:54:29'),(162,117,7,1,2,42,'-0-116-117-','れ レ re',0,'2016-08-23 07:09:07','2016-08-02 22:54:34'),(163,117,7,1,2,43,'-0-116-117-','ろ ロ ro',0,'2016-08-23 07:09:07','2016-08-02 22:54:38'),(164,117,7,1,2,44,'-0-116-117-','わ ワ wa',0,'2016-08-23 07:09:07','2016-08-02 22:54:45'),(165,117,7,1,2,45,'-0-116-117-','を オ o',0,'2016-08-23 07:09:07','2016-08-02 22:54:49'),(166,0,7,1,0,0,'-0-','个人',0,'2016-08-23 07:09:07','2016-08-03 22:12:33'),(167,0,8,1,0,0,'-0-','数据库',0,'2016-08-03 22:12:33','2016-08-03 22:12:33'),(168,116,8,1,1,0,'-0-116-','浊音',0,'2016-08-23 09:28:18','2016-08-22 23:36:07'),(169,116,8,1,1,0,'-0-116-','外来语',0,'2016-08-23 19:00:13','2016-08-23 01:27:19'),(170,116,8,1,1,0,'-0-116-','长音',0,'2016-08-24 10:14:06','2016-08-23 06:26:23'),(171,115,5,1,2,0,'-0-32-115-','dasdasdasd',0,'2016-08-24 10:14:06','2016-08-24 00:54:36'),(172,115,5,1,2,0,'-0-32-115-','adsdads',0,'2016-08-24 10:14:06','2016-08-24 00:54:52'),(173,115,5,1,2,0,'-0-32-115-','zzzzzzz',0,'2016-08-24 10:14:06','2016-08-24 01:12:44'),(174,101,5,1,3,0,'-0-32-78-101-','打萨斯的',0,'2016-08-24 02:15:10','2016-08-24 02:15:10'),(175,101,5,1,3,0,'-0-32-78-101-','打萨斯的',0,'2016-08-24 02:15:11','2016-08-24 02:15:11'),(176,101,5,1,3,0,'-0-32-78-101-','打萨斯的',0,'2016-08-24 02:15:12','2016-08-24 02:15:12'),(177,101,5,1,3,0,'-0-32-78-101-','打萨斯的',0,'2016-08-24 02:15:13','2016-08-24 02:15:13'),(178,101,5,1,3,0,'-0-32-78-101-','打萨斯的',0,'2016-08-24 02:15:13','2016-08-24 02:15:13'),(179,101,5,1,3,0,'-0-32-78-101-','打萨斯的',0,'2016-08-24 02:15:13','2016-08-24 02:15:13'),(180,101,5,1,3,0,'-0-32-78-101-','打萨斯的',0,'2016-08-24 02:15:14','2016-08-24 02:15:14');
/*!40000 ALTER TABLE `mp_ctg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_ctg_item_tags`
--

DROP TABLE IF EXISTS `mp_ctg_item_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_ctg_item_tags` (
  `ctg_id` int(10) unsigned NOT NULL COMMENT '分类ID',
  `item_id` int(10) unsigned NOT NULL COMMENT '内容ID',
  `tag_id` smallint(5) unsigned NOT NULL COMMENT '标签ID',
  KEY `ctg_id` (`ctg_id`),
  KEY `item_id` (`item_id`),
  KEY `tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_ctg_item_tags`
--

LOCK TABLES `mp_ctg_item_tags` WRITE;
/*!40000 ALTER TABLE `mp_ctg_item_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_ctg_item_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_ctg_tag`
--

DROP TABLE IF EXISTS `mp_ctg_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_ctg_tag` (
  `ctg_id` int(10) unsigned NOT NULL COMMENT '分类ID',
  `tag_id` smallint(5) unsigned NOT NULL COMMENT '标签ID',
  KEY `ctg_id` (`ctg_id`),
  KEY `tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_ctg_tag`
--

LOCK TABLES `mp_ctg_tag` WRITE;
/*!40000 ALTER TABLE `mp_ctg_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_ctg_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_item`
--

DROP TABLE IF EXISTS `mp_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_item` (
  `item_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '内容ID',
  `ctg_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '分类ID',
  `content` mediumtext NOT NULL COMMENT '内容',
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `ctg_id_UNIQUE` (`ctg_id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_item`
--

LOCK TABLES `mp_item` WRITE;
/*!40000 ALTER TABLE `mp_item` DISABLE KEYS */;
INSERT INTO `mp_item` VALUES (1,115,'<div>&nbsp;</div><div>重置视角</div><div>自由旋转</div><div>隐藏内层</div><div>只看该层</div><div>隐藏外层</div><div><br></div><div><br></div><div>储存位置数组，创建分类和内容时，动态添加到球体当中</div><div><br></div><div><br></div><div>编辑分类和内容时，同时可以编辑标签和排序，考虑用一个位于下方或右方的界面编辑</div>'),(2,114,'<div><br></div>'),(3,126,'<div>がいこ</div>'),(4,124,'<div>一个单词不会有两次下降,只可能一次或没有下降</div><div><br></div><div>一个单词里面前两个假名的音调一定是相反的</div><div><br></div><div>0 第一个假名是低音,第二个自然就是高的,之后全部是高音</div><div><br></div><div>1 唯一一个从高音开始的发音,第二个自然是低音,之后全部是低音</div><div><br></div><div>2 第一个是低音,第二个升高,第三个是下降,之后全部下降</div><div><br></div><div>3~ 第一个是低音,第二个升高,升到第三个,之后下降.</div><div>之后的以此类推,第一个低音,第二个开始升高,标的是几,就升到第几个,之后下降</div>'),(5,168,'<div>k -&gt; g</div><div>s -&gt; z</div><div>t  -&gt; d</div><div>h -&gt; b </div><div>h -&gt; p</div>'),(6,170,'<div>あ段假名后加 あ　お母さん　おかあさん</div><div>い段假名后加 い　お兄さん　おにいさん</div><div>う段假名后加 う　通訳　　　つうやく</div><div>え段假名后加 え　せんせい　先生</div><div>お段假名后加 お　お父さん　おとうさん</div><div><br></div>'),(7,34,'<div>响应式验证手机</div><div>IE TRANSFORM</div><div>响应式改变布局</div><div>1111111111111</div><div>&nbsp;</div>'),(8,171,'<div>asdasdasd</div>'),(9,173,'<div>zzzzzzzz</div>'),(10,106,'<div>22222222222</div>'),(132,174,'<div><br></div>'),(133,175,'<div><br></div>'),(134,176,'<div><br></div>'),(135,177,'<div><br></div>'),(136,178,'<div><br></div>'),(137,179,'<div><br></div>'),(138,180,'<div><br></div>');
/*!40000 ALTER TABLE `mp_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_migrations`
--

DROP TABLE IF EXISTS `mp_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_migrations`
--

LOCK TABLES `mp_migrations` WRITE;
/*!40000 ALTER TABLE `mp_migrations` DISABLE KEYS */;
INSERT INTO `mp_migrations` VALUES ('2014_10_12_000000_create_users_table',1),('2014_10_12_100000_create_password_resets_table',1);
/*!40000 ALTER TABLE `mp_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_password_resets`
--

DROP TABLE IF EXISTS `mp_password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_password_resets` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  KEY `password_resets_email_index` (`email`),
  KEY `password_resets_token_index` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_password_resets`
--

LOCK TABLES `mp_password_resets` WRITE;
/*!40000 ALTER TABLE `mp_password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_profile`
--

DROP TABLE IF EXISTS `mp_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_profile` (
  `profile_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户详情ID',
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `portrait` varchar(255) NOT NULL COMMENT '头像',
  `theme_id` smallint(5) unsigned NOT NULL DEFAULT '1' COMMENT '主题ID',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `theme_id` (`theme_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_profile`
--

LOCK TABLES `mp_profile` WRITE;
/*!40000 ALTER TABLE `mp_profile` DISABLE KEYS */;
INSERT INTO `mp_profile` VALUES (1,1,'1.png',2,'2016-07-28 17:56:33','0000-00-00 00:00:00'),(2,2,'2.png',2,'2016-08-22 09:19:47','2016-07-08 21:33:03'),(3,3,'1.png',2,'2016-08-22 09:19:47','2016-07-14 00:53:27'),(4,4,'1.png',2,'2016-08-22 09:19:47','2016-07-14 00:55:17');
/*!40000 ALTER TABLE `mp_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_space`
--

DROP TABLE IF EXISTS `mp_space`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_space` (
  `space_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '空间ID',
  `user_id` int(10) unsigned NOT NULL,
  `sort` int(10) unsigned NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL COMMENT '空间名称',
  `private` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`space_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_space`
--

LOCK TABLES `mp_space` WRITE;
/*!40000 ALTER TABLE `mp_space` DISABLE KEYS */;
INSERT INTO `mp_space` VALUES (1,1,0,'PHP',0,'2016-08-06 09:04:33','2016-08-06 09:04:33'),(2,1,0,'Javascript',0,'2016-08-07 04:12:50','2016-08-07 04:12:50'),(3,1,0,'CSS',0,'2016-08-07 04:12:50','2016-08-07 04:12:50'),(4,1,0,'HTML',0,'2016-08-07 04:12:50','2016-08-07 04:12:50'),(5,1,0,'Mes',1,'2016-08-23 06:41:15','2016-08-07 04:12:50'),(6,1,0,'MySQL',0,'2016-08-07 04:12:50','2016-08-07 04:12:50'),(7,1,0,'Japa',1,'2016-08-23 06:41:15','2016-08-08 14:55:20'),(8,1,0,'yg',0,'2016-08-23 06:41:15',NULL);
/*!40000 ALTER TABLE `mp_space` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_tag`
--

DROP TABLE IF EXISTS `mp_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_tag` (
  `tag_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` varchar(255) NOT NULL COMMENT '标签名称',
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_tag`
--

LOCK TABLES `mp_tag` WRITE;
/*!40000 ALTER TABLE `mp_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_tags`
--

DROP TABLE IF EXISTS `mp_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_tags` (
  `tag_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` varchar(255) NOT NULL COMMENT '标签名称',
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_tags`
--

LOCK TABLES `mp_tags` WRITE;
/*!40000 ALTER TABLE `mp_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_theme`
--

DROP TABLE IF EXISTS `mp_theme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_theme` (
  `theme_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '主题ID',
  `name` varchar(12) NOT NULL COMMENT '主题名称',
  PRIMARY KEY (`theme_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_theme`
--

LOCK TABLES `mp_theme` WRITE;
/*!40000 ALTER TABLE `mp_theme` DISABLE KEYS */;
INSERT INTO `mp_theme` VALUES (1,'mono'),(2,'nebula');
/*!40000 ALTER TABLE `mp_theme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mp_users`
--

DROP TABLE IF EXISTS `mp_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_users` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mp_users`
--

LOCK TABLES `mp_users` WRITE;
/*!40000 ALTER TABLE `mp_users` DISABLE KEYS */;
INSERT INTO `mp_users` VALUES (1,'hari','hansen1416@163.com','$2y$10$.OuUC8aHrNKbKEqoIvmUX.LQfAG0GCmnZfVnlsOTUpsSdoUh0QMrO','JCGJXbIEmTwsLxZX9wZiHaAvKcE6yO0T8SaPlRO4bAayfPIqLSsGm8HJiiJp','2016-05-29 22:37:00','2016-08-22 01:19:03'),(2,'aaa','aaa@163.om','$2y$10$1a9ysC7m2pKQMiJgVokMVu.z7uMPS7gUbkoMSGahm1CZjgvW9X5v2','PYoj46Xtu72bb4ImGyoBY47oIW538TfEouTtcyHErxnw1gnD8f3pn1RtJBNu','2016-07-08 21:33:03','2016-08-22 01:22:29'),(3,'bbb','bbb@163.com','$2y$10$v2YwJcnFu13XVpoux/lyUuTD/znkY.He8IVChFYt.rSmz1NgGD1f6','oqnmSx8EXCfm5cUO1GI1IkL8lfO6gwx17auEz8EScrspPXClBHucWWs47mF9','2016-07-14 00:53:27','2016-07-14 00:53:33'),(4,'ccc','ccc@163.com','$2y$10$5zwpEs3iv51Bh6UF5Cm5G.8OFvQpeySrvv9QbJYiPlbbfcBsAPeIy','xs6Ze9G8EUctOY4NPjpjVDLUtIAMl8gJFa9FGseGEVBMeraxu203gWbwC2ai','2016-07-14 00:55:16','2016-07-14 00:55:21');
/*!40000 ALTER TABLE `mp_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-09-29 16:32:58
