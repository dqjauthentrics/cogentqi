
SET FOREIGN_KEY_CHECKS=0;
ALTER TABLE member DROP FOREIGN KEY member_ibfk_2;
ALTER TABLE instrument_schedule_operation DROP FOREIGN KEY instrument_schedule_operation_ibfk_2;
ALTER TABLE instrument DROP FOREIGN KEY instrument_ibfk_1;
ALTER TABLE app_role RENAME TO role;
DROP INDEX role_id_index ON member;
ALTER TABLE member CHANGE app_role_id role_id char(1) NOT NULL DEFAULT 'P';
ALTER TABLE member ADD CONSTRAINT member_ibfk_2 FOREIGN KEY (role_id) REFERENCES role (id);
ALTER TABLE instrument ADD CONSTRAINT instrument_ibfk_1 FOREIGN KEY (role_id) REFERENCES role (id);
ALTER TABLE instrument_schedule_operation ADD CONSTRAINT instrument_schedule_operation_ibfk_2
FOREIGN KEY (role_id) REFERENCES role (id);SET FOREIGN_KEY_CHECKS=1;
SET FOREIGN_KEY_CHECKS=1;

DELETE FROM _db_update WHERE script_name LIKE '0003%';
INSERT INTO _db_update (script_name) VALUES ('0003-RoleAgain.sql');
