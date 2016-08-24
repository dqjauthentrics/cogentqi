
ALTER TABLE member_event
ADD COLUMN recommendation_made BIT NOT NULL DEFAULT 0;

ALTER TABLE event_alignment
DROP level,
DROP increment;

DELETE FROM _db_update WHERE script_name LIKE '0012%';
INSERT INTO _db_update (script_name) VALUES ('0012-EventRecommended.sql');
