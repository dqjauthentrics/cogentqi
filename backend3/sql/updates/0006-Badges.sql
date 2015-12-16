DROP TABLE IF EXISTS badge;
CREATE TABLE badge (
  id          INT PRIMARY KEY NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(255),
  description VARCHAR(4000),
  image       VARCHAR(500),
  issuer      VARCHAR(500),
  tags        VARCHAR(500),
  module_id   INT             NULL,
  FOREIGN KEY (module_id) REFERENCES module (id)
);
ALTER TABLE member_badge ADD COLUMN badge_id INT NULL;
ALTER TABLE member_badge ADD CONSTRAINT member_badge_badge__fk FOREIGN KEY (badge_id) REFERENCES badge (id);
UPDATE member_badge SET badge_id=NULL;
DELETE FROM badge;
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/css3.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/cup.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/gavel.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/ipv6.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/participation.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/prescriptions.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/security.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/technology.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/telegraph.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/wisdom.png', 'CogentQI.com');
UPDATE member_badge SET badge_id=(SELECT id FROM badge ORDER BY RAND() LIMIT 1);

DELETE FROM _db_update WHERE script_name LIKE '0006%';
INSERT INTO _db_update (script_name) VALUES ('0006-Badges.sql');

