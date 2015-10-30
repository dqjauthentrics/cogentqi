INSERT INTO outcome_alignment (outcome_id, question_id, weight, rel_wt)
  SELECT
    o.id, q.id, RandomInt(1, 3), 0.5 FROM outcome o, question q LIMIT 100;

INSERT INTO organization_outcome (organization_id, outcome_id, evaluated, evaluator_id, evaluator_comments, level)
  SELECT
    o.id, ot.id, current_timestamp, NULL, '', randomint(1, 3) FROM
    organization o, outcome ot;
INSERT INTO outcome_event (outcome_id, member_id, occurred, name, category)
  SELECT
    o.id, m.id, current_timestamp, concat(o.name, ' Event'), 'Events' FROM outcome o, member m
  WHERE m.role_id = 'P' ORDER BY RAND() LIMIT 100;

