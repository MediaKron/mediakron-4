# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.40)
# Database: mediakron
# Generation Time: 2018-12-12 18:06:15 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table audio
# ------------------------------------------------------------

DROP TABLE IF EXISTS `audio`;

CREATE TABLE `audio` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start` int(11) DEFAULT NULL,
  `stop` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `start` int(11) NOT NULL,
  `end` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `private` tinyint(1) NOT NULL DEFAULT '0',
  `archive` tinyint(1) NOT NULL DEFAULT '0',
  `uri` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `snippet` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table images
# ------------------------------------------------------------

DROP TABLE IF EXISTS `images`;

CREATE TABLE `images` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table items
# ------------------------------------------------------------

DROP TABLE IF EXISTS `items`;

CREATE TABLE `items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `version_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `editor_id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `published` tinyint(1) NOT NULL,
  `archived` tinyint(1) NOT NULL,
  `locked` tinyint(1) NOT NULL,
  `uri` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `template` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `transcript` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `expired_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table logs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `logs`;

CREATE TABLE `logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `edit` tinyint(1) NOT NULL,
  `contribution` tinyint(1) NOT NULL,
  `view` tinyint(1) NOT NULL,
  `visit` tinyint(1) NOT NULL,
  `log` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table maps
# ------------------------------------------------------------

DROP TABLE IF EXISTS `maps`;

CREATE TABLE `maps` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zoom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table menus
# ------------------------------------------------------------

DROP TABLE IF EXISTS `menus`;

CREATE TABLE `menus` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `item_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `external` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;

INSERT INTO `menus` (`id`, `site_id`, `user_id`, `parent_id`, `title`, `url`, `item_id`, `external`, `deleted_at`, `created_at`, `updated_at`)
VALUES
	(1,2,0,0,'','pasting','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(2,2,0,0,'','homepage','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(3,2,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(4,2,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(5,3,0,0,'','pasting','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(6,3,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(7,3,0,0,'','story-test','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(8,3,0,0,'','asdfasdf-1','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(9,3,0,0,'','content','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(10,4,0,0,'','about','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(11,4,0,0,'','topics','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(12,6,0,0,'','testing-contents','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(13,8,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(14,8,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(15,8,0,0,'','test-1','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(16,8,0,0,'','another-one','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(17,8,0,0,'','time-map-2','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(18,8,0,0,'','test-1','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(19,8,0,0,'','new-story','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(20,9,0,0,'','pasting','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(21,9,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(22,9,0,0,'','story-test','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(23,9,0,0,'','asdfasdf-1','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(24,9,0,0,'','content','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(25,10,0,0,'','testing','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(26,11,0,0,'','file-embed','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(27,11,0,0,'','file-embed','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(28,11,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(29,11,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(30,11,0,0,'','contents','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(31,12,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(32,12,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(33,12,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(34,12,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(35,12,0,0,'','development-resources','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(36,12,0,0,'','opportunities','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(37,12,0,0,'','stewardship','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(38,12,0,0,'','marketing-materials','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(39,13,0,0,'','timeline-examples','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(40,13,0,0,'','map-examples','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(41,15,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(42,15,0,0,NULL,NULL,'0',1,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(43,15,0,0,'','391-testing','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(44,18,0,0,'','folder','0',0,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57');

/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table metadata
# ------------------------------------------------------------

DROP TABLE IF EXISTS `metadata`;

CREATE TABLE `metadata` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `source` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `citation` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `published` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `creator` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `publisher` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `contributor` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `format` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `identifier` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverage` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rights` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table migrations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;

INSERT INTO `migrations` (`id`, `migration`, `batch`)
VALUES
	(1,'2014_10_12_100000_create_password_resets_table',1),
	(2,'2018_10_28_015418_create_users_table',1),
	(3,'2018_10_28_015427_create_items_table',1),
	(4,'2018_10_28_015434_create_relationships_table',1),
	(5,'2018_10_28_015453_create_revisions_table',1),
	(6,'2018_10_28_015711_create_comments_table',1),
	(7,'2018_10_28_020157_create_site_user_table',1),
	(8,'2018_10_28_022736_create_images_table',1),
	(9,'2018_10_28_022744_create_videos_table',1),
	(10,'2018_10_28_022753_create_audio_table',1),
	(11,'2018_10_28_022814_create_maps_table',1),
	(12,'2018_10_28_022836_create_timelines_table',1),
	(13,'2018_10_28_022950_create_metadata_table',1),
	(14,'2018_10_28_142833_create_user_stats_table',1),
	(15,'2018_10_28_143301_create_search_table',1),
	(16,'2018_10_28_144029_create_sites_table',1),
	(17,'2018_12_09_152553_create_menus_table',1),
	(18,'2018_12_10_022620_create_texts_table',1);

/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table password_resets
# ------------------------------------------------------------

DROP TABLE IF EXISTS `password_resets`;

CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table relationships
# ------------------------------------------------------------

DROP TABLE IF EXISTS `relationships`;

CREATE TABLE `relationships` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  `attachment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `weight` int(11) NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table revisions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `revisions`;

CREATE TABLE `revisions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `uri` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table search
# ------------------------------------------------------------

DROP TABLE IF EXISTS `search`;

CREATE TABLE `search` (
  `word` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sid` int(10) unsigned NOT NULL,
  `score` double(10,10) NOT NULL DEFAULT '0.0000000000',
  `boost` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`word`,`type`,`sid`,`position`),
  KEY `search_word_index` (`word`),
  KEY `search_type_index` (`type`),
  KEY `search_sid_index` (`sid`),
  KEY `word` (`word`),
  KEY `type` (`type`),
  KEY `sid` (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table site_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `site_user`;

CREATE TABLE `site_user` (
  `site_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `ldap` tinyint(1) NOT NULL DEFAULT '0',
  `granted_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`site_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table sites
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sites`;

CREATE TABLE `sites` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creator_id` int(11) NOT NULL DEFAULT '0',
  `administrator_id` int(11) NOT NULL DEFAULT '0',
  `institution_id` int(11) NOT NULL DEFAULT '0',
  `comment` tinyint(1) DEFAULT '0',
  `download` tinyint(1) DEFAULT '0',
  `author` tinyint(1) DEFAULT '0',
  `view` tinyint(1) DEFAULT '0',
  `public` tinyint(1) DEFAULT '0',
  `initialized` tinyint(1) DEFAULT '0',
  `production` tinyint(1) DEFAULT '0',
  `indexed` tinyint(1) DEFAULT '0',
  `sso` tinyint(1) DEFAULT '0',
  `uri` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `subtitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `ga` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `algorithm` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `navigation_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `link_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `banner_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `banner_link_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `skin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `font` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `item_id` int(11) NOT NULL DEFAULT '0',
  `item_uri` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `description` text COLLATE utf8mb4_unicode_ci,
  `layout` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `alt` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `navigation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `browse` tinyint(1) NOT NULL DEFAULT '0',
  `tags` tinyint(1) NOT NULL DEFAULT '0',
  `search` tinyint(1) NOT NULL DEFAULT '0',
  `mklogo` tinyint(1) NOT NULL DEFAULT '0',
  `login` tinyint(1) NOT NULL DEFAULT '0',
  `user` tinyint(1) NOT NULL DEFAULT '0',
  `fullscreen` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `sites` WRITE;
/*!40000 ALTER TABLE `sites` DISABLE KEYS */;

INSERT INTO `sites` (`id`, `creator_id`, `administrator_id`, `institution_id`, `comment`, `download`, `author`, `view`, `public`, `initialized`, `production`, `indexed`, `sso`, `uri`, `title`, `subtitle`, `logo`, `ga`, `algorithm`, `navigation_color`, `link_color`, `banner_color`, `banner_link_color`, `skin`, `font`, `item_id`, `item_uri`, `description`, `layout`, `image`, `alt`, `navigation`, `browse`, `tags`, `search`, `mklogo`, `login`, `user`, `fullscreen`, `deleted_at`, `created_at`, `updated_at`)
VALUES
	(1,0,0,0,0,1,NULL,1,0,1,0,0,0,'release.3.3','Release 3.3','Release 3.3',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'default.css',NULL,0,NULL,NULL,NULL,NULL,NULL,'default',0,0,0,0,0,0,0,NULL,'2015-11-06 01:11:22','2018-12-12 18:05:57'),
	(2,0,0,0,0,1,0,1,0,1,0,0,0,'release33','Release 3.4 with a super long title at the top','Release 3.4 with a super long title at the top','release33_B0V9Uz.png','','default',NULL,NULL,'#990000','#ffffff','default.css','Helvetica Neue (sans serif)',0,'homepage-folder','','basic','','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2015-11-06 01:26:07','2018-12-12 18:05:57'),
	(3,0,0,0,0,1,0,1,1,1,0,0,0,'release34','3.4 Old','3.4 Old','','','default',NULL,NULL,'#030303','#ffffff','default.css',NULL,0,'','<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur fermentum tellus sit amet tellus. Quisque placerat, ipsum ut vehicula mollis, orci dui eleifend sem, accumsan hendrerit pede lorem et lorem. Morbi id ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Morbi ipsum lacus, tristique a, placerat et, dapibus nec, erat. Proin ac ante vitae justo dictum mollis. Quisque dictum metus nec ante. Aenean nulla pede, luctus ac, aliquet in, eleifend eget, justo. Sed felis arcu, ultrices et, imperdiet et, euismod adipiscing, leo. Ut tortor urna, ornare nec, interdum molestie, tincidunt vitae, ante. Pellentesque massa nibh, rutrum eget, varius sed, euismod sit amet, pede. Morbi diam.</p><p>Phasellus sed est in arcu luctus malesuada. Mauris non nisl. Pellentesque iaculis sapien a lacus. Sed tristique commodo mauris. Mauris dapibus urna nec lectus. In dui. Aliquam sed purus. Vivamus vel metus. Mauris pharetra augue sed pede. Etiam ornare, urna id posuere viverra, metus justo tincidunt justo, ut porta nunc dui id nulla. Aenean hendrerit libero sit amet sem rhoncus tempor.</p><p></p>','half','release33_IErg2p.jpg','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2015-11-06 01:26:07','2018-12-12 18:05:57'),
	(4,0,0,0,0,0,0,1,1,1,1,0,0,'demo','Demo','Demo','','','default',NULL,NULL,NULL,NULL,'default.css',NULL,0,'topics','','nobanner','demo_hrheoM.jpg','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2016-01-19 14:26:30','2018-12-12 18:05:57'),
	(5,0,0,0,0,0,0,1,1,1,1,0,0,'demo2','Demo2','Demo2','','','default',NULL,NULL,NULL,NULL,'default.css',NULL,0,'','<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur fermentum tellus sit amet tellus. Quisque placerat, ipsum ut vehicula mollis, orci dui eleifend sem, accumsan hendrerit pede lorem et lorem. Morbi id ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Morbi ipsum lacus, tristique a, placerat et, dapibus nec, erat. Proin ac ante vitae justo dictum mollis. Quisque dictum metus nec ante. Aenean nulla pede, luctus ac, aliquet in, eleifend eget, justo. Sed felis arcu, ultrices et, imperdiet et, euismod adipiscing, leo. Ut tortor urna, ornare nec, interdum molestie, tincidunt vitae, ante. Pellentesque massa nibh, rutrum eget, varius sed, euismod sit amet, pede. Morbi diam.</p><p>Phasellus sed est in arcu luctus malesuada. Mauris non nisl. Pellentesque iaculis sapien a lacus. Sed tristique commodo mauris. Mauris dapibus urna nec lectus. In dui. Aliquam sed purus. Vivamus vel metus. Mauris pharetra augue sed pede. Etiam ornare, urna id posuere viverra, metus justo tincidunt justo, ut porta nunc dui id nulla. Aenean hendrerit libero sit amet sem rhoncus tempor.</p><p></p>','half','demo_Lf0t9q.jpg','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2016-01-19 14:26:30','2018-12-12 18:05:57'),
	(6,0,0,0,0,0,0,1,0,1,0,0,0,'release342','Release 3.4.2','Release 3.4.2','','','ua',NULL,NULL,'#030303','#ffffff','default.css','Georgia (serif)',0,'','','nobanner','release342_g4ibrP.jpg','','menu-vertical',1,1,1,1,0,1,1,NULL,'2016-03-10 21:07:55','2018-12-12 18:05:57'),
	(7,0,0,0,0,0,0,1,0,1,0,0,0,'ryan','Sample Site','Sample Site','','','default',NULL,NULL,'#030303','#ffffff','default.css',NULL,0,'','','nobanner','','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2016-03-22 13:40:47','2018-12-12 18:05:57'),
	(8,0,0,0,0,1,0,1,1,1,1,0,0,'atig2016S','ATIG Development','ATIG Development','','','default',NULL,NULL,'#030303','#ffffff','default.css','Helvetica Neue (sans serif)',0,'','','half','atig2016S_c5LsAd.png','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2015-11-06 01:26:07','2018-12-12 18:05:57'),
	(9,0,0,0,0,1,0,1,1,1,0,0,0,'release35','3.5 Release','3.5 Release','','','default',NULL,NULL,'#030303','#ffffff','default.css',NULL,0,'','<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur fermentum tellus sit amet tellus. Quisque placerat, ipsum ut vehicula mollis, orci dui eleifend sem, accumsan hendrerit pede lorem et lorem. Morbi id ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Morbi ipsum lacus, tristique a, placerat et, dapibus nec, erat. Proin ac ante vitae justo dictum mollis. Quisque dictum metus nec ante. Aenean nulla pede, luctus ac, aliquet in, eleifend eget, justo. Sed felis arcu, ultrices et, imperdiet et, euismod adipiscing, leo. Ut tortor urna, ornare nec, interdum molestie, tincidunt vitae, ante. Pellentesque massa nibh, rutrum eget, varius sed, euismod sit amet, pede. Morbi diam.</p><p>Phasellus sed est in arcu luctus malesuada. Mauris non nisl. Pellentesque iaculis sapien a lacus. Sed tristique commodo mauris. Mauris dapibus urna nec lectus. In dui. Aliquam sed purus. Vivamus vel metus. Mauris pharetra augue sed pede. Etiam ornare, urna id posuere viverra, metus justo tincidunt justo, ut porta nunc dui id nulla. Aenean hendrerit libero sit amet sem rhoncus tempor.</p><p></p>','half','release33_IErg2p.jpg','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2015-11-06 01:26:07','2018-12-12 18:05:57'),
	(10,0,0,0,0,0,0,1,0,1,0,0,0,'resease_353','3.5.3 Release','3.5.3 Release','','','default',NULL,NULL,'#030303','#ffffff','default.css',NULL,0,'ff-collab-folder','<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet egestas nunc. Sed commodo libero vel lacus consectetur feugiat. Phasellus ac vestibulum turpis, ac sollicitudin erat. Etiam venenatis auctor mi, sit amet iaculis libero feugiat tristique. Mauris sed sem quis ligula elementum pretium quis ut turpis. Donec in finibus lacus. Aliquam placerat sit amet dolor vel auctor. Nam pulvinar in odio sed venenatis. Suspendisse pharetra sapien mauris, id placerat enim condimentum vel.</p><p><br></p><p>Aliquam a nisi in lorem posuere eleifend ut eget risus. Quisque molestie diam sed porttitor maximus. In a auctor est, id facilisis nibh. Aliquam at diam aliquam eros euismod sollicitudin. Praesent sit amet dui luctus ante efficitur volutpat sit amet non neque. Fusce ac ex vitae ipsum vulputate suscipit. Nam non consectetur nibh, quis lobortis magna. Integer accumsan erat eu purus dictum, eget rutrum lectus mollis.</p><p><br></p><p>Sed lorem risus, molestie nec aliquam feugiat, mattis quis arcu. Nunc nisi enim, vehicula ut rhoncus et, malesuada sed massa. Aliquam pulvinar felis nec molestie vestibulum. Vivamus sed velit eget lacus lobortis eleifend. Phasellus nisi nulla, hendrerit vel tristique at, tincidunt nec sem. Cras quis lacus nec eros tincidunt tempor. Aenean sem nulla, faucibus vel luctus eu, placerat vitae justo. Ut et nulla at libero pretium imperdiet. Cras nulla massa, dictum non massa vitae, commodo varius nisi. Sed a risus ac urna convallis ultricies. Sed metus purus, posuere nec efficitur dignissim, lobortis eu massa. Pellentesque dignissim purus vel est cursus, sit amet imperdiet magna elementum. Donec volutpat enim id urna dapibus, id consequat libero volutpat.</p><p><br></p><p>Sed ut pellentesque tellus. In dictum tristique risus, vel lacinia elit ultricies ut. Proin eros nisl, facilisis at risus nec, sagittis venenatis nisl. Nam odio lectus, fringilla ultrices nibh et, vestibulum viverra orci. Quisque luctus nunc ac consectetur accumsan. Maecenas ante metus, laoreet malesuada augue volutpat, efficitur commodo augue. Duis pharetra leo sit amet diam tincidunt, nec commodo magna molestie.</p><p><br></p><p></p>','half','resease_353_G7A31E.jpg','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2016-11-17 15:23:10','2018-12-12 18:05:57'),
	(11,0,0,0,0,1,0,1,1,1,0,0,0,'release36','Release 3.6 - Annotations','Release 3.6 - Annotations','','','default',NULL,NULL,'#030303','#ffffff','default.css','Helvetica Neue (sans serif)',0,'','','menus-basic','','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2017-01-07 20:27:04','2018-12-12 18:05:57'),
	(12,0,0,0,0,1,0,1,1,1,0,0,0,'uademo','UA Demo','UA Demo','','','default',NULL,NULL,'#660000','#ffffff','default.css','Roboto (san serif)',0,'','','updates-half','release36_mnTuP8.jpg','','menu-vertical',1,1,1,1,0,1,1,NULL,'2017-01-07 20:27:04','2018-12-12 18:05:57'),
	(13,0,0,0,1,0,0,1,1,1,0,0,0,'timeline','Release 3.8 Timeline +','Release 3.8 Timeline +','timeline_dMZ4sd.jpg','58027189-2','default',NULL,NULL,'#030303','#ffffff','default.css','Roboto',0,'map-1','','menus-half','timeline_owUpTw.jpg','','menu-horizontal',0,1,1,1,0,1,1,NULL,'2017-04-24 00:07:42','2018-12-12 18:05:57'),
	(14,0,0,0,0,0,NULL,1,0,1,1,0,0,'examples','MediaKron Example Content','MediaKron Example Content',NULL,NULL,'default',NULL,NULL,NULL,NULL,'default.css',NULL,0,NULL,NULL,NULL,NULL,NULL,'default',0,0,0,0,0,0,0,NULL,'2017-10-19 15:48:02','2018-12-12 18:05:57'),
	(15,0,0,0,0,1,0,1,0,1,1,0,0,'release38','Release 3.8 legacy testing','Release 3.8 legacy testing','release33_B0V9Uz.png',NULL,'default',NULL,NULL,'#990000','#ffffff','default.css','Roboto (san serif)',0,'','<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet egestas nunc. Sed commodo libero vel lacus consectetur feugiat. Phasellus ac vestibulum turpis, ac sollicitudin erat. Etiam venenatis auctor mi, sit amet iaculis libero feugiat tristique. Mauris sed sem quis ligula elementum pretium quis ut turpis. Donec in finibus lacus. Aliquam placerat sit amet dolor vel auctor. Nam pulvinar in odio sed venenatis. Suspendisse pharetra sapien mauris, id placerat enim condimentum vel.</p><p><br></p><p>Aliquam a nisi in lorem posuere eleifend ut eget risus. Quisque molestie diam sed porttitor maximus. In a auctor est, id facilisis nibh. Aliquam at diam aliquam eros euismod sollicitudin. Praesent sit amet dui luctus ante efficitur volutpat sit amet non neque. Fusce ac ex vitae ipsum vulputate suscipit. Nam non consectetur nibh, quis lobortis magna. Integer accumsan erat eu purus dictum, eget rutrum lectus mollis.</p><p><br></p><p>Sed lorem risus, molestie nec aliquam feugiat, mattis quis arcu. Nunc nisi enim, vehicula ut rhoncus et, malesuada sed massa. Aliquam pulvinar felis nec molestie vestibulum. Vivamus sed velit eget lacus lobortis eleifend. Phasellus nisi nulla, hendrerit vel tristique at, tincidunt nec sem. Cras quis lacus nec eros tincidunt tempor. Aenean sem nulla, faucibus vel luctus eu, placerat vitae justo. Ut et nulla at libero pretium imperdiet. Cras nulla massa, dictum non massa vitae, commodo varius nisi. Sed a risus ac urna convallis ultricies. Sed metus purus, posuere nec efficitur dignissim, lobortis eu massa. Pellentesque dignissim purus vel est cursus, sit amet imperdiet magna elementum. Donec volutpat enim id urna dapibus, id consequat libero volutpat.</p><p><br></p><p>Sed ut pellentesque tellus. In dictum tristique risus, vel lacinia elit ultricies ut. Proin eros nisl, facilisis at risus nec, sagittis venenatis nisl. Nam odio lectus, fringilla ultrices nibh et, vestibulum viverra orci. Quisque luctus nunc ac consectetur accumsan. Maecenas ante metus, laoreet malesuada augue volutpat, efficitur commodo augue. Duis pharetra leo sit amet diam tincidunt, nec commodo magna molestie.</p><p><br></p><p></p>','menus-full','release38_khPxF2.jpg','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2015-11-06 01:26:07','2018-12-12 18:05:57'),
	(16,0,0,0,0,0,NULL,1,0,NULL,0,0,0,'overlay-fix','Test Site Overlay','Test Site Overlay',NULL,NULL,'default',NULL,NULL,NULL,NULL,'default.css',NULL,0,NULL,NULL,NULL,NULL,NULL,'default',0,0,0,0,0,0,0,NULL,'2017-11-14 16:01:17','2018-12-12 18:05:57'),
	(17,0,0,0,0,0,NULL,1,0,1,0,0,0,'overlayfix','Test Site Overlay','Test Site Overlay',NULL,NULL,'default',NULL,NULL,NULL,NULL,'default.css',NULL,0,NULL,NULL,NULL,NULL,NULL,'default',0,0,0,0,0,0,0,NULL,'2017-11-14 16:01:30','2018-12-12 18:05:57'),
	(18,0,0,0,1,1,0,1,1,1,0,0,0,'release39','Release 3.9 +','Release 3.9 +','','ziggy','default',NULL,NULL,'#0b5394','#ffffff','default.css','Helvetica Neue (sans serif)',0,'','<p>Sed ut pellentesque tellus. In dictum tristique risus, vel lacinia elit ultricies ut. Proin eros nisl, facilisis at risus nec, sagittis venenatis nisl. Nam odio lectus, fringilla ultrices nibh et, vestibulum viverra orci. Quisque luctus nunc ac consectetur accumsan. Maecenas ante metus, laoreet malesuada augue volutpat, efficitur commodo augue. Duis pharetra leo sit amet diam tincidunt, nec commodo magna molestie.ASDasdASD<br></p><p></p>','menus-half','release39_ffvEKm.jpg','','menu-horizontal',1,1,1,1,0,1,1,NULL,'2017-12-05 22:36:27','2018-12-12 18:05:57');

/*!40000 ALTER TABLE `sites` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table texts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `texts`;

CREATE TABLE `texts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extension` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table timelines
# ------------------------------------------------------------

DROP TABLE IF EXISTS `timelines`;

CREATE TABLE `timelines` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` double(8,2) DEFAULT NULL,
  `month` double(8,2) DEFAULT NULL,
  `day` double(8,2) DEFAULT NULL,
  `hour` double(8,2) DEFAULT NULL,
  `minute` double(8,2) DEFAULT NULL,
  `second` double(8,2) DEFAULT NULL,
  `timestamp` double(8,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `v3_id` int(11) NOT NULL DEFAULT '0',
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `salt` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `canvas_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  `expired` tinyint(1) NOT NULL DEFAULT '0',
  `bc` tinyint(1) DEFAULT '0',
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `last_login` timestamp NULL DEFAULT NULL,
  `expired_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `v3_id`, `username`, `display_name`, `email`, `salt`, `password`, `canvas_token`, `enabled`, `locked`, `expired`, `bc`, `admin`, `last_login`, `expired_at`, `deleted_at`, `created_at`, `updated_at`)
VALUES
	(1,1,'brad.mering',NULL,'brad.mering@gmail.com','dkruhqoztuogocwckksck0wccgoggw','Qx5+47K6svbbzIg5u5NwLv/86IwVrrI37ZVbj90tUeFgF05c3EpbNHszEe8aO1MLmgEtnypfq+y8V0JlrOC3XA==',NULL,1,0,0,0,0,'2018-12-12 16:23:27',NULL,NULL,'2018-12-12 18:05:56','2018-12-12 18:05:56'),
	(2,2,'tim.lindgren','tim.lindgren','lindgret@bc.edu','bsqhfvb3tts0ogc8ocskwogwwcgo88o','TiMcTN0qS5mEk2ataiiPt8l4ET3jFfuq7gxkL6xfDIz2+G5PdvjGbA8TEhp14AHhGSly8rqPAAwKxwYKlyFuJQ==',NULL,1,0,0,0,0,'2018-12-11 20:21:40',NULL,NULL,'2018-12-12 18:05:56','2018-12-12 18:05:56'),
	(3,3,'FF Test User','FF Test User','contact@timlindgren.com','gk0lv2d2u4o4kos44808cwsswsocw8s','8/AoVB4uYInWxTAgfASPo2TBbipeR5Rzo74MKc30IDHXyyCSBo6mJoYjrVFauWRAJcvyCk2LUn1DP/lRDRLRvQ==',NULL,1,0,0,0,0,'2017-01-31 19:34:19',NULL,NULL,'2018-12-12 18:05:56','2018-12-12 18:05:56'),
	(4,4,'brad.mering+test1@gmail.com',NULL,'brad.mering+test1@gmail.com','h5xlmn9gk740ccks48c8c4s4gkko8g0','7364933520e68d4b525a',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:56','2018-12-12 18:05:56'),
	(5,5,'brad.mering+test2@gmail.com',NULL,'brad.mering+test2@gmail.com','ji9rsmugphc0sosscckk40ccog0ww0o','0a21277c924fa3dc0fb8',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:56','2018-12-12 18:05:56'),
	(6,6,'brad.mering+test232@gmail.com',NULL,'brad.mering+test232@gmail.com','rvijiy2igqow88cg0c8cccwoko4wk40','0da6c5d0b3d5eac9f147',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(7,7,'brad.mering+234@gmail.com',NULL,'brad.mering+234@gmail.com','ttybe1xkqqs4wsckkss44s4gok08o88','51efa159ca14822dca45',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(8,8,'brad.mering+test12445g@gmail.com',NULL,'brad.mering+test12445g@gmail.com','oph0wtznm1w44gko08wk4oc40cwo40g','786ce17143ff1c6b0b69',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(9,9,'brad.mering+damn@gmail.com',NULL,'brad.mering+damn@gmail.com','n5zpy4q1i0gsss4wokc8sko4wcko8c4','37070ba554a90d889d2c',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(10,10,'brad.mering+tes343@gmail.com',NULL,'brad.mering+tes343@gmail.com','bcoyqh0dd9ckww4sookk4scswcgs8ck','aab639570015f900d4f7',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(11,11,'brad.mering+damn123',NULL,'brad.mering+damn123@gmail.com','7tmgr2gekxs0ws4ssogk0k8wwk8wg08','9ab5aa92e16dd14494ce',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(12,12,'brad.mering+test12344455',NULL,'brad.mering+test12344455@gmail.com','hmrvfyl2z1ckg8oook4ks0480gwc0cg','7c0cffe1e6d4b0a16f59',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(13,13,'brad.mering+test2111',NULL,'brad.mering+test2111@gmail.com','5qnmt7xhm38cg80s08o0gwg0gcw4kgg','18eae8b0738d290a8ada',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(14,14,'brad.mering+234233',NULL,'brad.mering+234233@gmail.com','meh7s4g12zkk4ck84coo4sw0gok0k8s','3b39a610fae60707834a',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(15,15,'walkerjj',NULL,'walkerjj@bc.edu','ftlqlj5m5jc4o8cgkoco4swgggko0wg','lt8sj6zVlG3l6i8MTRaWf85k+GTTvffMQQGniCrSA4zbsPU1cgfagFQ4b2jM/dWa4C1K79/3aWSwx7BCSZ4d4w==',NULL,1,0,0,NULL,0,'2016-01-14 22:39:19',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(16,16,'bestsa',NULL,'bestsa@bc.edu','nb220aze8kgk8kwkcgcg0wkw4k8ko8s','QM97YfXvto0mNHPIqx0o7ULRMeOvnWcXUdfUbe9gHqrnUV1ptE2Bg5lOBOwOkOOOxpFgEND0A3KnmVmdpf0v5g==',NULL,1,0,0,0,0,'2017-01-11 16:09:24',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(17,17,'wanderingswede',NULL,'wanderingswede@gmail.com','q58ki5ffxbks8ock0skc8w808scow0o','62cd77f88baf0dbdd434',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(18,18,'mail',NULL,'mail@timlindgren.com','6ymb64afop8oskkccsoso840ookswg4','34ed24d7e42cf0309ed8',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(19,19,'brad.mering+test123',NULL,'brad.mering+test123@gmail.com','42g88a42jtk4w008w0wowow0ggosgk4','0a87b31f076a03e5430a',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(20,20,'clavellr',NULL,'clavellr@bc.edu','jrs57tgv5tsw8ko0sw4s0kswscwkskk','jv8Rs4FGEWg33j6sI5F8CSx02LDb6Ydqww99jnQE1FayEayMBTDojlYs7l2m7vWxqeoytwHHVYCYZjSMroZEBA==',NULL,1,0,0,1,0,'2016-07-13 17:26:30',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(21,21,'ascenzo','Margaret Ascenzo','ascenzo@bc.edu','bs2mnsf11ugcc8w4s4ckwg0ckgo888w','VHIzwAGmUgWyp1uuODJyNZ9nGV+3wcsXazo3OLM1xvsLHExNNYK+m7zVZ5K8ZC9i5rMoN5hrs8Q06YOZDGOy6A==',NULL,1,0,0,1,0,'2017-01-13 16:29:32',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(22,22,'Safari Test User','Safari Test User','timlindgren@gmail.com','4xm0jqnj8w4k808wcog4sgsck8808s8','q6ZT3kvKEDJ88rSvvWAUTXZVragd7iDpIYkV03Sgs+rD314K0z1M95qHyJIPg6YnWuiGMhTrSH0Cz2ooavI27Q==',NULL,1,0,0,0,0,'2018-03-13 18:24:05',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(23,23,'timmonan',NULL,'timmonan@bc.edu','tic8qv3tt68swcg0ocg8sg8kw4kskwk','BcyZkIekFyS93Sr5Y2h1TdsceFRBLOinVKen7kSy7yTX/eVck0kU5DxTPQWtj5Vs8cUxE0Jb65odJ1cy+bFdYA==',NULL,1,0,0,0,0,'2017-01-19 17:24:00',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(24,24,'christopher.wilson@bc.edu',NULL,'christopher.wilson@bc.edu','h21hpvgqdd4owsgoggoc0wcw880w0ow','pTcQgU6ifdHyvesJrsG1jGwEf5HGS/FZD9WB9KaV8M/qUu5Evv+kR6BdesPlHVjPj7JNXHcNtj2JR/Ci3IqujQ==',NULL,1,0,0,0,0,'2017-01-19 14:25:59',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(25,25,'devbc',NULL,'devbc@bc.edu','5wlfeyo9mko4gcwcwc48ggw44ws008c','3835a7b799ab5f0afd6f',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(26,26,'brad.mering+test1234',NULL,'brad.mering+test1234@gmail.com','t3blvylwmcggs8o4wo0c0gc0wc4004c','91cb70d479c91cd12823',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(27,27,'brad.mering+edit124',NULL,'brad.mering+edit124@gmail.com','p44yctwdvwg48co0k8sw4g4k88okss4','017e4fa79b2d6ac97c74',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(28,28,'brad.mering+membertrack',NULL,'brad.mering+membertrack@gmail.com','hnzitldp01wk4ok44w0sk48ckc4swso','29018ee7b69bc9ac31df',NULL,1,0,0,NULL,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(29,29,'brad.mering+membertrack2',NULL,'brad.mering+membertrack2@gmail.com','m5019390n5s4484w04ggsg0ck48c0ow','fSx9lfKd/qQFKSgcRxf6HxFk5Url8gtP9WTY/EwxHT0a3uizRDWSe8nL8a6tU4XOPmjZrremX/3CuHBDa+5yMg==',NULL,1,0,0,NULL,0,'2017-01-31 17:05:50',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(30,30,'guest1',NULL,'guest1@mediakron.33mail.com','symd3cf5fr40k8cgcc0c0s8k4wwo8c4','pHpmx6iF7PwjkO7gO1Xj1w0sgo1ZR1MIbNrJ9DtJQRikE0SKuB9HMG8VS0W2Cb6DWBuJte8FPncwgve28C6fgQ==',NULL,1,0,0,0,0,'2018-04-10 19:19:47',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(31,31,'guest2',NULL,'guest2@mediakron.33mail.com','dbo1u5t0114w04gkggkok8cok0cg4wk','kkX4vdTvTjOSSJaKM50USeUYh9c/FIB9W+BwaEcFGl/5qsJQ8KyCzsWE3h6XClLGrAnJSTA5tGm95IxvuvB3vQ==',NULL,1,0,0,NULL,0,'2018-04-10 19:51:46',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(32,32,'brad.mering+testuser1',NULL,'brad.mering+testuser1@gmail.com','1j1ovfajslgk8os8sgssgk0o44w08cs','sPGLC1C2gMzkl4VXZ9K8bvBTGPltPxmiphAHHeMlycKhXnzhL+50tYV5NWtkvvqgl+7B2SaGY/ZR7S/BfQ1DiA==',NULL,1,0,0,0,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(33,33,'brad.mering+memberpie',NULL,'brad.mering+memberpie@gmail.com','dm1jzywnbcgso0csc0s08gw0s4gowc8','MTMbJpJ9YsjPntQDtCpG8HZbAdyvDatgbzQqyjuJEXVrFcqsJ8kk7kz/9Wvr7NtlYjZWB/6Fyc23mJo4pl/nOw==',NULL,1,0,0,NULL,0,'2018-03-26 19:42:13',NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57'),
	(34,34,'test.student','Test Student','brad.mering+teststudent@gmail.com','gdq8cros4c0s4cows80koo8o4gws0gw','bXii1h53tHpCF20e49DkkvvrocLvNMZXZ0iRunzCb8VoNcJHHhWmQKjjNL8fPnNDfkpaV9/NQ1Z/fw1Ro8h4bQ==',NULL,1,0,0,0,0,NULL,NULL,NULL,'2018-12-12 18:05:57','2018-12-12 18:05:57');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table videos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `videos`;

CREATE TABLE `videos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start` int(11) DEFAULT NULL,
  `stop` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
