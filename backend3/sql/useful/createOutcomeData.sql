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



DELETE FROM organization_outcome;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 360 DAY), NULL, '', randomint(1, 2) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 330 DAY), NULL, '', randomint(1, 2) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 310 DAY), NULL, '', randomint(1, 2) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 290 DAY), NULL, '', randomint(1, 2) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 260 DAY), NULL, '', randomint(1, 2) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 230 DAY), NULL, '', randomint(1, 2) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 210 DAY), NULL, '', randomint(1, 3) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 190 DAY), NULL, '', randomint(1, 3) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 160 DAY), NULL, '', randomint(1, 3) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 130 DAY), NULL, '', randomint(1, 3) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 100 DAY), NULL, '', randomint(1, 3) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 70 DAY), NULL, '', randomint(1, 3) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 40 DAY), NULL, '', randomint(1, 3) FROM
    organization o, outcome ot;
INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id,  DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY), NULL, '', randomint(1, 3) FROM
    organization o, outcome ot;
