DROP TABLE IF EXISTS outcome_event;

CREATE TABLE event (
  id  INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Generic',
  PRIMARY KEY (id)
);

CREATE TABLE event_alignment (
  id INT NOT NULL AUTO_INCREMENT,
  increment INT NOT NULL DEFAULT 1,
  event_id INT NOT NULL,
  question_id INT NOT NULL,
  CONSTRAINT event_alignment.event_key FOREIGN KEY (event_id) REFERENCES event (id),
  CONSTRAINT event_alignment.question_key FOREIGN KEY (question_id) REFERENCES question (id),
  PRIMARY KEY (id)
);

CREATE TABLE member_event (
  id  INT NOT NULL AUTO_INCREMENT,
  member_id INT NOT NULL,
  event_id INT NOT NULL,
  comments TEXT DEFAULT NULL,
  occurred DATETIME NOT NULL DEFAULT NOW(),
  CONSTRAINT member_event.event_key FOREIGN KEY (event_id) REFERENCES event (id),
  CONSTRAINT member_event.member_key FOREIGN KEY (member_id) REFERENCES member (id),
  PRIMARY KEY (id)
);

ALTER TABLE assessment_response
    ADD recommended_resource INT DEFAULT NULL;

DELETE FROM _db_update WHERE script_name LIKE '0004%';
INSERT INTO _db_update (script_name) VALUES ('0004-Events.sql');