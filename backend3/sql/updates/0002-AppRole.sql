ALTER TABLE role RENAME TO app_role;

SET FOREIGN_KEY_CHECKS=0;
DROP INDEX role_id_index ON member;
ALTER TABLE member DROP FOREIGN KEY member_ibfk_2;
ALTER TABLE member CHANGE role_id app_role_id CHAR(1) NOT NULL DEFAULT 'P';
CREATE INDEX role_id_index ON member (app_role_id);
ALTER TABLE member ADD CONSTRAINT member_ibfk_2 FOREIGN KEY (app_role_id) REFERENCES app_role (id);
SET FOREIGN_KEY_CHECKS=1;

DELETE FROM _db_update WHERE script_name LIKE '0002%';
INSERT INTO _db_update (script_name) VALUES ('0002-AppRole.sql');