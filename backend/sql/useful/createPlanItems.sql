DELETE FROM plan_item;
INSERT INTO plan_item (module_id, plan_item_status_id, member_id,status_stamp,rank,score)
  SELECT module_id,'R',member_id,current_timestamp,4,4 FROM
    (SELECT md.id as module_id,m.id as member_id FROM module as md,member as m) as foo;

UPDATE plan_item SET plan_item_status_id = 'C' WHERE mod(id, 4) = 0;
UPDATE plan_item SET plan_item_status_id = 'E' WHERE mod(id, 5) = 0;
UPDATE plan_item SET plan_item_status_id = 'R' WHERE mod(id, 3) = 0;
UPDATE plan_item SET status_stamp = DATE_SUB(current_timestamp,INTERVAL RandomInt(1,30) DAY) WHERE plan_item_status_id='E';
UPDATE plan_item SET status_stamp = DATE_SUB(current_timestamp,INTERVAL RandomInt(1,350) DAY) WHERE plan_item_status_id='C';
