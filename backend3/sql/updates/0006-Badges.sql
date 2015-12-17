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
ALTER TABLE badge DROP column module_id;
DROP TABLE IF EXISTS module_badge;
CREATE TABLE module_badge (
  id        INT PRIMARY KEY NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
  module_id INT             NULL,
  badge_id  INT             NULL,
  FOREIGN KEY (module_id) REFERENCES module (id),
  FOREIGN KEY (badge_id) REFERENCES badge (id)
);

ALTER TABLE member_badge ADD COLUMN badge_id INT NULL;
ALTER TABLE member_badge ADD CONSTRAINT member_badge_badge__fk FOREIGN KEY (badge_id) REFERENCES badge (id);
UPDATE member_badge SET badge_id = NULL;
DELETE FROM badge;
INSERT INTO badge (name, description, image, issuer) VALUES ('CSS3', 'CSS3 mastery module.', '/site/default/badges/css3.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer)
VALUES ('Caring Workplace', 'Developing a caring workplace environment.', '/site/default/badges/cup.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer)
VALUES ('Legal Issues', 'Legal issues in our profession.', '/site/default/badges/gavel.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer)
VALUES ('Internet Technology', 'How the Internet affects our workplace.', '/site/default/badges/ipv6.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer)
VALUES ('Team Participation', 'Working as a member of a professional team.', '/site/default/badges/participation.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer)
VALUES ('Prescription Management', 'Managing prescriptions safely, optimally and accurately.', '/site/default/badges/prescriptions.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer)
VALUES ('Security 101', 'Security awareness in the workplace.', '/site/default/badges/security.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer)
VALUES ('Support Technologies', 'Technologies that can help you do your job better.', '/site/default/badges/technology.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer)
VALUES ('Communication', 'Basic communications skills.', '/site/default/badges/telegraph.png', 'CogentQI.com');
INSERT INTO badge (name, description, image, issuer)
VALUES ('Planning', 'Wise planning and time management.', '/site/default/badges/wisdom.png', 'CogentQI.com');
UPDATE member_badge SET badge_id = (SELECT id FROM badge ORDER BY RAND() LIMIT 1);
UPDATE member_badge mb SET title = (SELECT name FROM badge WHERE badge.id = mb.badge_id);

DELETE FROM module_badge;
INSERT INTO module_badge (module_id, badge_id)
  SELECT
    m.id, b.id FROM module m, (SELECT id FROM badge ORDER BY rand() LIMIT 1) as b;
UPDATE module_badge SET badge_id = (SELECT id FROM badge ORDER BY rand() LIMIT 1);

DELETE FROM _db_update WHERE script_name LIKE '0006%';
INSERT INTO _db_update (script_name) VALUES ('0006-Badges.sql');

