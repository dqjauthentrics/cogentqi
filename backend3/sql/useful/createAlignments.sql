USE cogentqi_v1_owensboro;
DELETE FROM outcome_alignment;
INSERT INTO outcome_alignment (outcome_id, question_id, weight, rel_wt)
  SELECT
    o.id, q.id, RandomInt(0, 2), 1 FROM outcome o, question q;
DELETE FROM resource_alignment;
INSERT INTO resource_alignment (resource_id, question_id, weight)
  SELECT
    o.id, q.id, RandomInt(0, 2) FROM outcome o, question q;

