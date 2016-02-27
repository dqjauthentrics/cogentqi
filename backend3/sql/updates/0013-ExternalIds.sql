
ALTER TABLE organization
  MODIFY fax  varchar(50) DEFAULT NULL,
  MODIFY state  varchar(50) DEFAULT NULL,
  ADD COLUMN external_id VARCHAR(36);

ALTER TABLE member
  ADD COLUMN external_id VARCHAR(36),
  MODIFY phone varchar(20) DEFAULT NULL,
  MODIFY mobile varchar(20) DEFAULT NULL,
  MODIFY email varchar(100) NOT NULL,
  MODIFY password  varchar(50) NOT NULL ,
  MODIFY address varchar(500) DEFAULT NULL;


DELETE FROM _db_update WHERE script_name LIKE '0013%';
INSERT INTO _db_update (script_name) VALUES ('0013-ExternalIds.sql');
