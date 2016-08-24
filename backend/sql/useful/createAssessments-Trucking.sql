USE cogentqi_v1_trucking
DELETE FROM assessment_response;
DELETE FROM recommendation;
DELETE FROM assessment;
DELETE FROM plan_item WHERE plan_item_status_id = 'R';
SET @ii = 1;
SET @isi = 1;
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(251, 350) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant improvement since the last evaluation.',
    'I feel as though I am on track.'
  FROM member WHERE role_id = 'T';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(150, 250) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant improvement since the last evaluation.',
    'I feel as though I am on track.'
  FROM member WHERE role_id = 'T';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(51, 150) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant improvement since the last evaluation.',
    'I feel as though I am on track.'
  FROM member WHERE role_id = 'T';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(0, 50) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant improvement since the last evaluation.',
    'I feel as though I am on track.'
  FROM member WHERE role_id = 'T' ORDER BY RAND() LIMIT 10;
UPDATE assessment SET last_modified = last_saved;

INSERT INTO assessment_response (assessment_id, question_id, response, response_index)
  SELECT
    a.id, q.id, RandomInt(1, 5), 0 FROM assessment a, question_group qg, question q
  WHERE a.instrument_schedule_id = @isi AND qg.instrument_id = @ii AND q.question_group_id = qg.id;


SET @ii = 2;
SET @isi = 2;
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(251, 350) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant improvement since the last evaluation.',
    'I feel as though I am on track.'
  FROM member WHERE role_id = 'P';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(151, 250) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant improvement since the last evaluation.',
    'I feel as though I am on track.'
  FROM member WHERE role_id = 'P';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(51, 150) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant improvement since the last evaluation.',
    'I feel as though I am on track.'
  FROM member WHERE role_id = 'P';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(0, 50) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant improvement since the last evaluation.',
    'I feel as though I am on track.'
  FROM member WHERE role_id = 'P' ORDER BY RAND() LIMIT 10;
UPDATE assessment SET last_modified = last_saved;


INSERT INTO assessment_response (assessment_id, question_id, response, response_index)
  SELECT
    a.id, q.id, RandomInt(1, 2), 0 FROM assessment a, question_group qg, question q
  WHERE a.instrument_schedule_id = @isi AND qg.instrument_id = @ii AND q.question_group_id = qg.id;

UPDATE assessment_response SET response_index = response;
UPDATE assessment SET assessor_id = (SELECT id FROM member WHERE role_id = 'M' ORDER BY RAND() LIMIT 1);
UPDATE assessment SET assessor_id = (SELECT id FROM member WHERE role_id = 'P' ORDER BY RAND() LIMIT 1)
WHERE member_id IN (SELECT id FROM member WHERE role_id = 'T');

UPDATE assessment_response SET response_index = response;
UPDATE assessment SET assessor_id = (SELECT id FROM member WHERE role_id = 'M' ORDER BY RAND() LIMIT 1);
UPDATE assessment SET assessor_id = (SELECT id FROM member WHERE role_id = 'P' ORDER BY RAND() LIMIT 1)
WHERE member_id IN (SELECT id FROM member WHERE role_id = 'T');

