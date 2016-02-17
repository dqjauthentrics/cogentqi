
ALTER TABLE organization
ADD COLUMN external_id VARCHAR(36);

DELETE FROM _db_update WHERE script_name LIKE '0013%';
INSERT INTO _db_update (script_name) VALUES ('0013-ExternalIds.sql');
