USE cogentqi_v1_it;

DELETE FROM member_event;
DELETE FROM event;
INSERT INTO event (name, description, category) VALUES ('Failure to Respond to Critical Issue', 'Failure to follow up on a bug or issue marked time or functionally critical.', 'Ticket System');
INSERT INTO event (name, description, category) VALUES ('Incorrect Response', 'A factually incorrect response was provided for a ticket.', 'Ticket System');
INSERT INTO event (name, description, category) VALUES ('Customer Complaint', 'A complaint was submitted by a patient or customer.', 'Customer Relations');
INSERT INTO event (name, description, category) VALUES ('Tardiness', 'The employee was late to work without sufficient explanation or notice.', 'Work Ethic');
INSERT INTO event (name, description, category) VALUES ('Failure to Notify', 'The employee failed to communicate important information regarding a customer issue.', 'Communication');
INSERT INTO event (name, description, category) VALUES ('Improper Attire', 'The employee arrived for work dressed inappropriately for professional work.', 'Work Ethic');
INSERT INTO event (name, description, category) VALUES ('Poor Documentation', 'Poor documentation for an issue was provided for future reference.', 'Ticket System');
INSERT INTO event (name, description, category) VALUES ('Data Entry Error', 'Data entered regarding into the system was incorrect.', 'Data Management');
INSERT INTO event (name, description, category) VALUES ('Insecure Password Used', 'An insecure password was used by the IT professional or provided to a user.', 'Security');
INSERT INTO event (name, description, category) VALUES ('Password Shared', 'A password was shared verbally, by mail or other message.', 'Security');
INSERT INTO event (name, description, category) VALUES ('Backups Not Verified', 'The existence of backup files was not verified as scheduled.', 'Security');
INSERT INTO member_event (member_id, event_id, comments, occurred)
  SELECT m.id, e.id, NULL, DATE_SUB(current_timestamp, INTERVAL RandomInt(1,200) DAY) FROM member m, event e ORDER BY RAND() LIMIT 90;

