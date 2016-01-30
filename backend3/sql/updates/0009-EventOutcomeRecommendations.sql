ALTER TABLE event_alignment ADD COLUMN weight int(11) NOT NULL DEFAULT 1;
ALTER TABLE event ADD COLUMN threshold int(11) NOT NULL DEFAULT 1;
ALTER TABLE assessment_response
  DROP outcome_value,
  DROP event_value;
ALTER TABLE question
  DROP outcome_threshold,
  DROP event_threshold;
ALTER TABLE resource_alignment
  DROP weight;

CREATE TABLE resource_alignment_map (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  resource_alignment_id int(11) NOT NULL,
  response int(11) NOT NULL,
  utility int(11) NOT NULL DEFAULT 0,
  KEY resource_alignment_id_index (resource_alignment_id),
  UNIQUE (resource_alignment_id, response),
  CONSTRAINT resource_alignment_maps_ibfk_1 FOREIGN KEY (resource_alignment_id) REFERENCES resource_alignment (id)
    ON DELETE CASCADE
);

DELETE FROM _db_update WHERE script_name LIKE '0009%';
INSERT INTO _db_update (script_name) VALUES ('0009-EventOutcomeRecommendations.sql');
