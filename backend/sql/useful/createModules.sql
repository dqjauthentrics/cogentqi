DELETE FROM plan_item;
DELETE FROM module;

INSERT INTO module (resource_id, starts, ends, sched_type)
  SELECT
    id, DATE_ADD(current_timestamp, INTERVAL RandomInt(10, 300) DAY), current_timestamp, 'C' FROM resource;

INSERT INTO module (resource_id, starts, ends, sched_type)
  SELECT
    id, DATE_ADD(current_timestamp, INTERVAL RandomInt(10, 300) DAY), current_timestamp, 'C' FROM resource ORDER BY rand() LIMIT 8;

UPDATE module SET ends = DATE_ADD(starts, INTERVAL RandomInt(0, 90) DAY);
