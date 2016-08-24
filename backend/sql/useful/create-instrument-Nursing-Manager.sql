USE cogentqi_v1_owensboro;
DELETE FROM plan_item;
DELETE FROM outcome_alignment;
DELETE FROM resource_alignment;
DELETE FROM resource_alignment_map;
DELETE FROM event_alignment;
DELETE FROM recommendation;
DELETE FROM assessment_response;
DELETE FROM assessment;
DELETE FROM question;
DELETE FROM question_group;
DELETE FROM question_choice;
DELETE FROM question_type;
DELETE FROM instrument_schedule_operation;
DELETE FROM instrument_schedule;
DELETE FROM instrument;
INSERT INTO question_type (name, summary, min_range, max_range, entry_type) VALUES (
  'Manager of Nursing Scale', 'Scale for evaluation of nursing competencies.', 0, 5, 'LIKERT'
);
SET @qti = LAST_INSERT_ID();
INSERT INTO question_choice (question_type_id, sort_order, name, value, rubric, icon_prefix) VALUES (
  @qti, 0, 'Unanswered', 0, 'No response is entered for this competency.',  'levelBg'
);
INSERT INTO question_choice (question_type_id, sort_order, name, value, rubric, icon_prefix) VALUES (
  @qti, 1, 'Needs Development', 1, 'More effort and skill development is needed.',  'levelBg'
);
INSERT INTO question_choice (question_type_id, sort_order, name, value, rubric, icon_prefix) VALUES (
  @qti, 2, 'Progressing', 1, 'Improvements are being made, but further skill development and effort are required.',  'levelBg'
);
INSERT INTO question_choice (question_type_id, sort_order, name, value, rubric, icon_prefix) VALUES (
  @qti, 3, 'Achieves', 1, 'Expectations for skill and effort in this competency are being met satisfactorily.',  'levelBg'
);
INSERT INTO question_choice (question_type_id, sort_order, name, value, rubric, icon_prefix) VALUES (
  @qti, 4, 'Exceeds', 1, 'Expectations for skill and effort in this competency have been exceeded.',  'levelBg'
);
INSERT INTO question_choice (question_type_id, sort_order, name, value, rubric, icon_prefix) VALUES (
  @qti, 5, 'Role Model', 1, 'Skill and effort in this competency are models for others to follow.',  'levelBg'
);
INSERT INTO instrument (name, role_id, usage_id, description, summary, is_uniform, question_type_id, max_range, min_range) VALUES (
  'Nursing Manager Evaluation', 'M', 'R',
  'This instrument is intended to describe the general nature and level of work performed by employees assigned to this position. It is not designed to contain or be interpreted as a comprehensive inventory of all duties, responsibilities, and qualifications required of employees. Specific duties and responsibilities consistent with the general nature and level of work described may vary by department and additional related duties may be assigned as needed. Some duties listed may not apply to all areas.',
  'General nature and level of work performed by Nurse Managers.',
  1,
  @qti,
  0,
  5
);
SET @ii = LAST_INSERT_ID();
INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Excellence', 'A', 1);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 1, '1', 'Work Quality', 'Strives to attain excellence through high quality work.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 2, '2', 'Resource Use', 'Utilizes appropriate resources for personal and professional growth.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 3, '3', 'Responsibility', 'Accepts responsibility for results and outcomes of the department.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 4, '4', 'Commitment', 'Consistently delivers on commitments in a timely manner.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 5, '5', 'Collaboration', 'Collaborates with others to identify and implement improvement opportunities.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 6, '6', 'Decision-Making', 'Makes sound, timely decisions and communicates decisions promptly.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 7, '7', 'Priortization', 'Balances and prioritizes multiple responsibilities and resources appropriately.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Innovation', 'B', 2);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 8, '1', 'Efficiency', 'Anticipates needs and recommends new approaches to increase efficiency.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 9, '2', 'Initiative', 'Initiates and implements departmental improvements.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 10, '3', 'Creativity', 'Generates creative ideas and solutions to problems; able to think innovatively.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 11, '4', 'Forethought', 'Anticipates obstacles and thinks ahead about next steps.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 12, '5', 'Big Picture',
        'Considers and evaluates the impact to other departments when developing and executing departmental objectives and initiatives.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Integrity', 'C', 3);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 13, '1', 'Takes Responsibility', 'Accepts responsibility for mistakes and takes action to prevent reoccurrence.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 14, '2', 'Follow-Through', 'Follows through on commitments.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 15, '3', 'Openness', 'Is open, honest and trustworthy in all interactions.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 16, '4', 'Trade-off Understanding', 'Makes and supports difficult decisions in the face of conflicting demands and interests.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 17, '5', 'Information Sharing', 'Keeps others informed with pertinent information.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 18, '6', 'Judgment', 'Makes good judgment based on knowledge/skills and personal integrity.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 19, '7', 'Feedback', 'Seeks feedback and input from direct reports, peers and leadership for continuous improvement.');


INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Respect', 'D', 4);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 20, '1', 'Compassion', 'Treats others with respect, dignity and compassion.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 21, '2', 'Perspective', 'Seeks first to understand other points of view and accept differences in others.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 22, '3', 'Communication', 'Demonstrates respect when communicating with others by attentively listening and responding professionally.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 23, '4', 'Emotional Quotient', 'Recognizes personal emotions and behaviors and their effect on working relationships and empathizes.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 24, '5', 'Conflict Resolution', 'Resolves conflicts by seeking win-win solutions.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 25, '6', 'Conflict Management', 'Manages conflict and facilitates (dis)agreements.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Service', 'E', 5);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 26, '1', 'Expectations',
        'Sets and meets service expectations by anticipating, identifying, understanding the sources and issues behind customer needs and addressing them appropriately.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 27, '2', 'Constituent Satisfaction', 'Monitors constituent satisfaction and implements strategies to improve as needed.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 28, '3', 'Customer Needs', 'Considers customer needs and interests when making decisions.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 29, '4', 'Customer Service', 'Addresses customer service issues for effective and timely resolutions.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 30, '5', 'Expectation Definition/Accountability', 'Clearly defines expectations, holds employees accountable.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 31, '6', 'Standard of Excellence', 'Strives to meet a standard of excellence for self and team.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Teamwork', 'F', 6);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES
  (@qg, @qti, 32, '1', 'Goal-Setting', 'Explains to others how the day-to-day work contributes to the accomplishment of department and organization goals.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 33, '2', 'Leadership', 'Persuades and encourages others to move in a desired direction.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 34, '3', 'Performance Feedback', 'Manages staff performance, provides frequent feedback and coaches staff.');





