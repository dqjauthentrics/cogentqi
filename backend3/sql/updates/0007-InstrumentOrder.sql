ALTER TABLE instrument ADD COLUMN sort_order INT NOT NULL DEFAULT 0;
UPDATE instrument SET sort_order = id;

DELETE FROM _db_update WHERE script_name LIKE '0007%';
INSERT INTO _db_update (script_name) VALUES ('0007-InstrumentOrder.sql');
