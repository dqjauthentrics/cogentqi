SET @ii = 2;
SET @isi = 2;
DELETE FROM resource_alignment WHERE
  question_id IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id = @ii));
DELETE FROM outcome_alignment WHERE
  question_id IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id = @ii));
DELETE FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id = @ii);
DELETE FROM question_group WHERE instrument_id = @ii;
DELETE FROM instrument_schedule WHERE instrument_id = @ii;