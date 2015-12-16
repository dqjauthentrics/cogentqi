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
INSERT INTO badge (name, description, image, issuer)
VALUES ('Member Mebook.eu', 'This badge is awarded to members in a Mebook Club.', 'http://create.openbadges.it/images/badge/3',
        'http://factory.openbadges.it/public/systems/openbadges/issuers/mebook');
ALTER TABLE member_badge ADD badge_id INT NULL;
ALTER TABLE member_badge ADD CONSTRAINT member_badge_badge__fk FOREIGN KEY (badge_id) REFERENCES badge (id);

DELETE FROM _db_update WHERE script_name LIKE '0006%';
INSERT INTO _db_update (script_name) VALUES ('0006-Badges.sql');

