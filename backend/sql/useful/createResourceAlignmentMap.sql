USE cogentqi_v1_owensboro;
INSERT INTO resource_alignment (resource_id, question_id)
  SELECT r.id, q.id FROM resource r, question q ORDER BY rand() LIMIT 300;

INSERT INTO resource_alignment_map (resource_alignment_id, response, utility)
  SELECT
    id, 1, round(1 + rand() * 4) FROM resource_alignment
  WHERE question_id IN (SELECT question.id FROM question, question_type
  WHERE question.question_type_id = question_type.id
        AND question_type.entry_type = 'LIKERT');
INSERT INTO resource_alignment_map (resource_alignment_id, response, utility)
  SELECT
    id, 2, round(1 + rand() * 4) FROM resource_alignment
  WHERE question_id IN (SELECT question.id FROM question, question_type
  WHERE question.question_type_id = question_type.id
        AND question_type.entry_type = 'LIKERT');
INSERT INTO resource_alignment_map (resource_alignment_id, response, utility)
  SELECT
    id, 3, round(1 + rand() * 4) FROM resource_alignment
  WHERE question_id IN (SELECT question.id FROM question, question_type
  WHERE question.question_type_id = question_type.id
        AND question_type.entry_type = 'LIKERT');
INSERT INTO resource_alignment_map (resource_alignment_id, response, utility)
  SELECT
    id, 4, round(1 + rand() * 4) FROM resource_alignment
  WHERE question_id IN (SELECT question.id FROM question, question_type
  WHERE question.question_type_id = question_type.id
        AND question_type.entry_type = 'LIKERT');
INSERT INTO resource_alignment_map (resource_alignment_id, response, utility)
  SELECT
    id, 5, round(1 + rand() * 4) FROM resource_alignment
  WHERE question_id IN (SELECT question.id FROM question, question_type
  WHERE question.question_type_id = question_type.id
        AND question_type.entry_type = 'LIKERT');
INSERT INTO resource_alignment_map (resource_alignment_id, response, utility)
  SELECT
    id, 1, round(1 + rand() * 4) FROM resource_alignment
  WHERE question_id IN (SELECT question.id FROM question, question_type
  WHERE question.question_type_id = question_type.id
        AND question_type.entry_type = 'YESNO');
INSERT INTO resource_alignment_map (resource_alignment_id, response, utility)
  SELECT
    id, 2, round(1 + rand() * 4) FROM resource_alignment
  WHERE question_id IN (SELECT question.id FROM question, question_type
  WHERE question.question_type_id = question_type.id
        AND question_type.entry_type = 'YESNO');
