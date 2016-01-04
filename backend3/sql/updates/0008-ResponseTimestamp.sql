ALTER TABLE assessment_response ADD COLUMN time_stamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;

DELETE FROM _db_update WHERE script_name LIKE '0008%';
INSERT INTO _db_update (script_name) VALUES ('0008-ResponseTimestamp.sql');
