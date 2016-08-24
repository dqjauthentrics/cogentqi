ALTER TABLE organization_outcome
DROP level;
ALTER TABLE organization_outcome
ADD COLUMN level FLOAT NOT NULL DEFAULT 0.0;

DELETE FROM _db_update WHERE script_name LIKE '0010%';
INSERT INTO _db_update (script_name) VALUES ('0010-ChangeLevelType.sql');
