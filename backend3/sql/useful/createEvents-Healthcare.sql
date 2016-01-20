DELETE FROM member_event;
DELETE FROM event;
INSERT INTO event (name, description, category) VALUES ('Patient Fall', '.', 'Patient Care');
INSERT INTO event (name, description, category) VALUES ('Patient Drop', '.', 'Patient Care');
INSERT INTO event (name, description, category) VALUES ('Improper Med Dispensed', 'An incorrect medication was dispensed to a patient.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Improper Med Dosage', 'An incorrect medication dosage was dispensed to a patient.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Patient Complaint', 'A complaint was submitted by a patient.', 'Communication');
INSERT INTO event (name, description, category) VALUES ('Tardiness', 'The employee was late to work without sufficient explanation or notice.', 'Conduct');
INSERT INTO event (name, description, category) VALUES ('Failure to Notify', 'The employee failed to communicate important information about a patient.', 'Communication');
INSERT INTO event (name, description, category) VALUES ('Improper Attire', 'The employee arrived for work dressed inappropriately for professional work.', 'Conduct');
INSERT INTO event (name, description, category) VALUES ('Absence', 'Employee was absent for a scheduled shift.', 'Conduct');
INSERT INTO event (name, description, category) VALUES ('Data Entry Error', 'Data entered regarding either a patient or a medication was incorrect.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Failure to Complete Routine Task', 'A regular maintenance task was not performed as scheduled/required.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Treatment Error', 'The wrong treatment was applied to a patient.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Failure to Follow Order', 'Patient treatment orders were not followed.', 'Conduct');
INSERT INTO event (name, description, category) VALUES ('Sexual Misconduct', 'Improper behavior toward a colleague or patient.', 'Conduct');
INSERT INTO event (name, description, category) VALUES ('Patient Communication Problem', 'The patient misunderstood information communicated by the employee.', 'Communication');
INSERT INTO member_event (member_id, event_id, comments, occurred)
  SELECT m.id, e.id, NULL, DATE_SUB(current_timestamp, INTERVAL RandomInt(1,300) DAY) FROM member m, event e ORDER BY RAND() LIMIT 120;
