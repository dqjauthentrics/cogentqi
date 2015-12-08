/**
 * Set dates and times in tables to reflect today's date, to keep a demo database up to date.
 */
UPDATE module SET starts = date_add(current_timestamp, INTERVAL randomInt(1, 100) DAY);
UPDATE module SET ends = date_add(starts, INTERVAL randomInt(0, 5) DAY);

UPDATE member_note SET last_modified = date_add(current_timestamp, INTERVAL (-1*randomInt(1, 180)) DAY);
UPDATE assessment SET last_modified = date_add(current_timestamp, INTERVAL (-1*randomInt(1, 180)) DAY);
UPDATE assessment SET last_saved = last_modified;
