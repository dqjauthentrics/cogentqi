ALTER TABLE question
  ADD importance double DEFAULT 0 NOT NULL,
  ADD outcome_threshold double DEFAULT 1 NOT NULL,
  ADD event_threshold double DEFAULT 1 NOT NULL;

ALTER TABLE assessment_response
  DROP outcome_factor,
  DROP outcome_weight,
  DROP event_factor,
  DROP event_weight,
  ADD outcome_value double DEFAULT 0 NOT NULL,
  ADD event_value double DEFAULT 0 NOT NULL;

DELETE FROM _db_update WHERE script_name LIKE '0001%';
INSERT INTO _db_update (script_name) VALUES ('0001-RecommendationFields.sql');