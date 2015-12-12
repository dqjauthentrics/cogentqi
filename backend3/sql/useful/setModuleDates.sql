UPDATE module SET starts = date_add(current_timestamp, INTERVAL randomInt(1, 100) DAY);
UPDATE module SET ends = date_add(starts, INTERVAL randomInt(0, 5) DAY);
