/***
INSERT INTO outcome_alignment (outcome_id, question_id, weight, rel_wt)
  SELECT
    o.id, q.id, RandomInt(1, 3), 0.5 FROM outcome o, question q LIMIT 100;
***/
DELETE FROM organization_outcome;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(10, 350) DAY), NULL, '', randomint(1, 3) FROM
    organization o, outcome ot;
