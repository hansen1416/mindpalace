/*
SQLyog Ultimate v11.27 (32 bit)
MySQL - 5.7.12-log : Database - mindpalace
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`mindpalace` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `mindpalace`;

/*Table structure for table `mp_ctg` */

DROP TABLE IF EXISTS `mp_ctg`;

CREATE TABLE `mp_ctg` (
  `ctg_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `pid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '父分类ID',
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `tier` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '层序号',
  `sort` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `path` varchar(255) NOT NULL COMMENT '分类的族谱',
  `title` varchar(255) NOT NULL COMMENT '分类名',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建时间',
  PRIMARY KEY (`ctg_id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8;

/*Table structure for table `mp_ctg_item_tags` */

DROP TABLE IF EXISTS `mp_ctg_item_tags`;

CREATE TABLE `mp_ctg_item_tags` (
  `ctg_id` int(10) unsigned NOT NULL COMMENT '分类ID',
  `item_id` int(10) unsigned NOT NULL COMMENT '内容ID',
  `tags_id` smallint(5) unsigned NOT NULL COMMENT '标签ID'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `mp_item` */

DROP TABLE IF EXISTS `mp_item`;

CREATE TABLE `mp_item` (
  `item_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '内容ID',
  `ctg_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '分类ID',
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `sort` mediumint(8) unsigned NOT NULL COMMENT '排序',
  `title` varchar(255) NOT NULL COMMENT '内容标题',
  `content` mediumtext NOT NULL COMMENT '内容',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建时间',
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8;

/*Table structure for table `mp_migrations` */

DROP TABLE IF EXISTS `mp_migrations`;

CREATE TABLE `mp_migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `mp_password_resets` */

DROP TABLE IF EXISTS `mp_password_resets`;

CREATE TABLE `mp_password_resets` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  KEY `password_resets_email_index` (`email`),
  KEY `password_resets_token_index` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `mp_profile` */

DROP TABLE IF EXISTS `mp_profile`;

CREATE TABLE `mp_profile` (
  `profile_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户详情ID',
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `portrait` varchar(255) NOT NULL COMMENT '头像',
  `theme_id` smallint(5) unsigned NOT NULL DEFAULT '1' COMMENT '主题ID',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建时间',
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `theme_id` (`theme_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

/*Table structure for table `mp_tags` */

DROP TABLE IF EXISTS `mp_tags`;

CREATE TABLE `mp_tags` (
  `tag_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` varchar(255) NOT NULL COMMENT '标签名称',
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `mp_theme` */

DROP TABLE IF EXISTS `mp_theme`;

CREATE TABLE `mp_theme` (
  `theme_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '主题ID',
  `name` varchar(12) NOT NULL COMMENT '主题名称',
  PRIMARY KEY (`theme_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Table structure for table `mp_users` */

DROP TABLE IF EXISTS `mp_users`;

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

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
