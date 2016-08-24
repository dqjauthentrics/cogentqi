USE cogentqi_v1_hospitality;

SET FOREIGN_KEY_CHECKS = 0;
UPDATE member SET role_id = 'W' WHERE role_id = 'F';
UPDATE member SET role_id = 'R' WHERE role_id = 'P';
UPDATE member SET role_id = 'D' WHERE role_id = 'T';
UPDATE role SET id = 'W' WHERE id = 'F';
UPDATE role SET id = 'R' WHERE id = 'P';
UPDATE role SET id = 'D' WHERE id = 'T';
SET FOREIGN_KEY_CHECKS = 1;

UPDATE member SET role_id = 'F' WHERE role_id = 'T' AND mod(id, 3) = 0;

DELETE FROM recommendation;
DELETE FROM resource_alignment;
DELETE FROM outcome_alignment;
DELETE FROM assessment_response;
DELETE FROM plan_item;
DELETE FROM question;
DELETE FROM question_group;

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (1, 'Guest safety', 'A', 1);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 1, '1', 'Regulation Compliance', 'Complies with federal, local, and company health and safety regulations.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 2, '2', 'Guideline Knowledge',
        'Demonstrates knowledge of facility guidelines to ensure physical safety of customers and employees, including emergency shutdown procedures.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 3, '3', 'Safety Procedures', 'Be aware of evacuation routes, fire extinguisher location and use, shut-down procedures and safety manuals.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 4, '4', 'Information Dissemination',
        'Disseminates information to customers addressing potential safety hazards and security issues, e.g., display safety and security information and materials in a public area.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 5, '5', 'Area Knowledge', 'Recommend stourist attractions and accommodations that will be safe for all family members.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 6, '6', 'Prevention Safeguards', 'Identifies activities that are suspicious and implement loss prevention safeguards.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (1, 'Policies and procedures', '2', 2);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 7, '1', 'Reservations', 'Employs effective reservation procedures to meet guest needs and maximize occupancy.
·      Understands the different types of reservations used to meet different guest needs, e.g., guaranteed vs. non-guaranteed, reservations guaranteed by credit card vs. reservations guaranteed by travel agents or corporations.
·      Familiar with common sources used to make lodging reservations.
·      Experience with computer systems in processing reservations.
·      Understands forecasting to maximize occupancy levels.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES
  (@qg, 1, 8, '2', 'Check-out Procedure', 'Understands the importance of check-out procedures to ensure guest satisfaction and verify settlement of account.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 9, '3', 'Account Settlement', 'Understands and follows account settlement procedures for different types of payment.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 10, '4', 'Telephone System Skills',
        'Understands basic telephone courtesy and language for answering and closing calls, placing callers on hold, transferring calls, and taking messages.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (1, 'Guest Satisfaction', '3', 3);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 11, '1', 'Customer Assistance',
        'Understands and follows facility guidelines related to ensuring customer satisfaction by assisting customers including, luggage and item delivery, room maintenance, basic customer inquiries, etc.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 12, '2', 'Special Requests', 'Demonstrates ability to handle individual customer requests.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 13, '3', 'Complaint Handling', 'Demonstrates ability to handle customer complaints.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 14, '4', 'Customer Assistance', 'Ensure requests and complaints are dealt with promptly and to the satisfaction of the customer.');

USE cogentqi_v1_hospitality;
SET @ii = 1;
SET @isi = 1;
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(251, 350) DAY), CURRENT_TIMESTAMP,
    'This is a first, baseline assessment.',
    'I am excited about this new system and look forward to improving my knowledge.'
  FROM member WHERE role_id = 'D';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(150, 250) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant improvement since the last evaluation.',
    'I feel as though I am on track.'
  FROM member WHERE role_id = 'D';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(51, 150) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant progress, but there is still some work to do.',
    'This has been a positive learning experience, and I am looking forward to the next assessment.'
  FROM member WHERE role_id = 'T';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(0, 50) DAY), CURRENT_TIMESTAMP,
    'A solid performance.',
    'I feel good about my performance.'
  FROM member WHERE role_id = 'D' ORDER BY RAND() LIMIT 10;
UPDATE assessment SET last_modified = last_saved;

INSERT INTO assessment_response (assessment_id, question_id, response, response_index)
  SELECT
    a.id, q.id, RandomInt(1, 5), 0 FROM assessment a, question_group qg, question q
  WHERE a.instrument_schedule_id = @isi AND qg.instrument_id = @ii AND q.question_group_id = qg.id;

UPDATE assessment_response SET response_index = response;
UPDATE assessment SET assessor_id = (SELECT id FROM member WHERE role_id = 'M' ORDER BY RAND() LIMIT 1);
UPDATE assessment SET assessor_id = (SELECT id FROM member WHERE role_id = 'D' ORDER BY RAND() LIMIT 1)
WHERE member_id IN (SELECT id FROM member WHERE role_id IN ('R'));


INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (2, 'Staff Management', 'A', 1);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 1, '1', 'Work Schedule Management', 'Anticipates and ensures full, but optimal coverage of room attendant needs.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 2, '2', 'Follows Housekeeping Procedures',
        'Follows and disseminates hotel procedures to staff.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 3, '3', 'Follows Safety Procedures',
        'Trains staff regularly on evacuation routes, fire extinguisher location and use, shut-down procedures and safety manuals.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 4, '4', 'Performs Regular Progress Reviews',
        'Ensures that regular performance reviews are conducted for every staff member.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (2, 'Linen Service', '2', 2);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 5, '1', 'Procedures', 'Establishes and updates procedures for the linen service.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES
  (@qg, 1, 8, '2', 'Resource Management', 'Sees to it that staff have all required resources to carry out their work effectively.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 6, '3', 'Common Area Management',
        'Performs regular maintenance and inspections of common areas shared by guests, ensuring that all linens are clean.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 7, '4', 'Restaurant Support',
        'Works collaboratively with restaurants to ensure laundry is cleaned and delivered in a timely manner.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (2, 'Guest Satisfaction', '3', 3);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 8, '1', 'Customer Assistance', 'Assists customers with special cleaning requests, as needed.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 9, '2', 'Complaint Resolution', 'Follows up on complaints received directly from guests or indirectly through management.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 10, '3', 'Creativity', 'Offers creative suggestions for making guests feel they are important to our business.');

USE cogentqi_v1_hospitality;
SET @ii = 2;
SET @isi = 2;
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(251, 350) DAY), CURRENT_TIMESTAMP,
    'This is a first, baseline assessment.',
    'I am excited about this new system and look forward to improving my knowledge.'
  FROM member WHERE role_id = 'D';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(150, 250) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant improvement since the last evaluation.',
    'I feel as though I am on track.'
  FROM member WHERE role_id = 'D';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(51, 150) DAY), CURRENT_TIMESTAMP,
    'We are seeing significant progress, but there is still some work to do.',
    'This has been a positive learning experience, and I am looking forward to the next assessment.'
  FROM member WHERE role_id = 'T';
INSERT INTO assessment (instrument_id, instrument_schedule_id, member_id, assessor_id, last_saved, last_modified,
                        assessor_comments, member_comments)
  SELECT
    @ii, @isi, id, id, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL RandomInt(0, 50) DAY), CURRENT_TIMESTAMP,
    'A solid performance.',
    'I feel good about my performance.'
  FROM member WHERE role_id = 'D' ORDER BY RAND() LIMIT 10;
UPDATE assessment SET last_modified = last_saved;

INSERT INTO assessment_response (assessment_id, question_id, response, response_index)
  SELECT
    a.id, q.id, RandomInt(1, 5), 0 FROM assessment a, question_group qg, question q
  WHERE a.instrument_schedule_id = @isi AND qg.instrument_id = @ii AND q.question_group_id = qg.id;

UPDATE assessment_response SET response = RandomInt(1, 3) WHERE question_id IN (
  SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id = 2)
);

UPDATE assessment_response SET response_index = response;
UPDATE assessment SET assessor_id = (SELECT id FROM member WHERE role_id = 'M' ORDER BY RAND() LIMIT 1);
UPDATE assessment SET assessor_id = (SELECT id FROM member WHERE role_id = 'D' ORDER BY RAND() LIMIT 1)
WHERE member_id IN (SELECT id FROM member WHERE role_id IN ('R'));



