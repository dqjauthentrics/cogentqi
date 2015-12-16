DELETE FROM member_event;
DELETE FROM event;
INSERT INTO event (name, description, category) VALUES ('Incorrect Dosage', 'An incorrect dosage of a medication was prepared.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Incorrect Label', 'An incorrect label was placed on a medication.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Customer Complaint', 'A complaint was submitted by a patient or customer.', 'Customer Relations');
INSERT INTO event (name, description, category) VALUES ('Tardiness', 'The employee was late to work without sufficient explanation or notice.', 'Work Ethic');
INSERT INTO event (name, description, category) VALUES ('Failure to Notify', 'The employee failed to communicate important information about a customer/patient.', 'Communication');
INSERT INTO event (name, description, category) VALUES ('Improper Attire', 'The employee arrived for work dressed inappropriately for professional work.', 'Work Ethic');
INSERT INTO event (name, description, category) VALUES ('Failure to Check In-Stock', 'An arrival date was specified for patient/customer without first checking its availability in stock.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Data Entry Error', 'Data entered regarding either the patient or medication for a label was incorrect.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Failure to Complete Routine Maintenance Task', 'A regular maintenance task was not performed as scheduled/required.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Incorrect Dispensing Device Selected', 'The wrong dispensing device was used for a medication.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Failure to Complete 7 Point Check', 'No attempt to complete the required 7 point check before delivering a medication.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Failure to Check Screening Notes', 'Patient screening notes were not checked before dispensing a medication.', 'Medication');
INSERT INTO event (name, description, category) VALUES ('Failure to Check if Counseling Required', 'The customer/patient was not asked if counseling was desired.', 'Customer Relations');
INSERT INTO member_event (member_id, event_id, comments, occurred)
  SELECT m.id, e.id, NULL, DATE_SUB(current_timestamp, INTERVAL RandomInt(1,200) DAY) FROM member m, event e ORDER BY RAND() LIMIT 90;
