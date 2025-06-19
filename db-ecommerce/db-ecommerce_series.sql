-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: db-ecommerce
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `series`
--

DROP TABLE IF EXISTS `series`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `series` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `number_volumes` smallint DEFAULT NULL,
  `description` text,
  `author` varchar(50) DEFAULT NULL,
  `image_series` varchar(100) DEFAULT NULL,
  `slug` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_UNIQUE` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `series`
--

LOCK TABLES `series` WRITE;
/*!40000 ALTER TABLE `series` DISABLE KEYS */;
INSERT INTO `series` VALUES (1,'Dragon Ball',42,'La trama di Dragon Ball segue Son Goku, un ragazzo con forza incredibile. Insieme a Bulma cerca le Sfere del Drago, capaci di esaudire desideri. Crescendo, Goku si allena e difende la Terra da minacce sempre più potenti, diventando un eroe che protegge amici e l\'\'universo.','Akira Toriyama','dragonballserie.jpg','dragon-ball-serie'),(2,'Demon Slayer',23,'Tanjiro Kamado diventa un Cacciatore di Demoni dopo che la sua famiglia è massacrata e la sorella Nezuko trasformata. Cerca una cura per Nezuko e vendica i suoi cari, affrontando i demoni e il loro temibile capo, Muzan Kibutsuji, con coraggio e determinazione.','Koyoharu Gotouge','demonslayerserie.jpg','demon-slaye-rserie'),(3,'Death Note',13,'Lo studente geniale Light Yagami trova il Death Note, un quaderno che uccide chi vi scrive il nome. Decide di creare un mondo ideale senza criminali come il giustiziere \"Kira\", ma viene braccato dal misterioso detective L, e un mortale gioco di intelletto tra i due.','Tsugumi Ohba','deathnoteserie.jpg','death-note-serie'),(4,'My Hero Academia',42,'In un mondo dove quasi tutti possiedono superpoteri (Quirk), il giovane Izuku Midoriya nasce senza. Nonostante ciò, sogna di diventare un eroe. Eredita il Quirk \"One For All\" dal suo idolo All Might ed entra nella prestigiosa U.A. High, affrontando l\'\'addestramento e la minaccia crescente dei villain.','Kohei Horikoshi','myaserie.jpg','my-hero-academia-serie'),(5,'Naruto',72,'Naruto Uzumaki, un giovane ninja orfano ed l\'\'emarginato che ospita la Volpe a Nove Code, sogna di diventare Hokage, il leader del suo villaggio. Tra l\'\'allenamenti, missioni e amicizie, affronta innumerevoli nemici e sfide, lottando per il riconoscimento, la pace e per proteggere le persone a cui tiene.','Masashi Kishimoto','narutoserie.jpg','naruto-serie'),(6,'One Piece',111,'Monkey D. Luffy, un ragazzo dal corpo di gomma, sogna di diventare il Re dei Pirati. Con la sua ciurma eterogenea, i Cappello di Paglia, naviga per la Rotta Maggiore alla ricerca del leggendario tesoro One Piece, affrontando Marine, temibili pirati e il Governo Mondiale in un\'\'epica avventura di libertà e amicizia.','Eiichiro Oda','onepieceserie.jpg','one-piece-serie'),(7,'Tokyo Ghoul',14,'A Tokyo, i Ghoul si nutrono di umani. Lo studente Ken Kaneki si trasforma in un mezzo-Ghoul dopo un incidente. Bloccato tra due mondi, lotta per accettare la sua nuova natura e sopravvivere, mentre cerca di capire la complessa coesistenza e il conflitto tra Ghoul e investigatori umani.','Sui Ishida','tokyoghoulserie.jpg','tokyo-ghoul-serie'),(8,'Capitan Tsubasa',37,'Tsubasa Ozora (Holly Hutton), un prodigio del calcio, sogna di vincere la Coppa del Mondo con il Giappone. La sua vita ruota attorno al pallone, affrontando rivali leggendari e affinando le sue tecniche in partite epiche. Il suo percorso lo porta dai campi scolastici alle sfide internazionali, sempre con dedizione e spirito di squadra.','Yoichi Takahashi','capitantsubasaserie.jpg','capitan-tsubasa-serie'),(9,'Hajime no Ippo',76,'Ippo Makunouchi, un timido studente vittima di bullismo, scopre la boxe dopo essere stato salvato da un pugile. Decide di dedicarsi anima e corpo a questo sport, sognando di capire cosa significhi essere forte. Inizia il suo percorso come pugile professionista, affrontando allenamenti durissimi e avversari temibili.','George Morikawa','hajimenoipposerie.jpg','hajime-no-ippo-serie'),(10,'Attack on Titan',34,'In un mondo assediato da giganti mangia-uomini, i Titani, l\'\'umanità si barrica dietro alte mura. Dopo la distruzione della sua casa e la morte della madre, Eren Yeager giura di sterminare ogni Titano. Si unisce al Corpo di Ricerca, scoprendo oscure verità sul mondo e sulla propria origine e un conflitto ben più grande.','Hajime Isayama','attackontitanserie.jpg','attack-on-titan-serie');
/*!40000 ALTER TABLE `series` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-29 13:25:09
