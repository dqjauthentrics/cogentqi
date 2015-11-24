/**
CREATE TABLE _db_update (
  script_name VARCHAR(100) UNIQUE NOT NULL PRIMARY KEY,
  runOn       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
**/
UPDATE plan_item SET plan_item_status_id = (SELECT id FROM plan_item_status ORDER BY RAND() LIMIT 1);
UPDATE plan_item SET score = RandomInt(0,5);

DELETE FROM _db_update WHERE script_name LIKE '0000%';
INSERT INTO _db_update (script_name) VALUES ('0000-Initial.sql');
