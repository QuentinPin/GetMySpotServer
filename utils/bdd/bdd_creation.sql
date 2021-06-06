CREATE DATABASE IF NOT EXISTS get_my_spot;
USE get_my_spot;

DROP TABLE IF EXISTS COLLECT;
DROP TABLE IF EXISTS USER;

CREATE TABLE USER
(
    pseudo VARCHAR(50)  PRIMARY KEY,
    password VARCHAR(100),
    image MEDIUMTEXT
);

CREATE TABLE COLLECT
(
    id_collect INTEGER  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    battery VARCHAR(10),
    time DATE,
    position_latitude DOUBLE,
    position_longitude DOUBLE,
    pressure VARCHAR(50),
    brightness VARCHAR(50),
    pseudo VARCHAR(50),
    image_spot MEDIUMTEXT NOT NULL,
    FOREIGN KEY(pseudo)  REFERENCES USER(pseudo)
);
