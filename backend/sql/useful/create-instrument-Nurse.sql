USE cogentqi_v1_owensboro;
INSERT INTO question_type (name, summary, min_range, max_range, entry_type) VALUES (
  'Nursing Scale', 'Scale for evaluation of nursing competencies.', 0, 5, 'LIKERT'
);
SET @qti = LAST_INSERT_ID();
INSERT INTO question_choice (question_type_id, sort_order, name, value, rubric, icon_prefix) VALUES (
  @qti, 0, 'Unanswered', 0, 'No response is entered for this competency.', 'levelBg'
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
  'Nurse Evaluation', 'M', 'R',
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
VALUES (@qg, @qti, 3, '3', 'Professional Development', 'Seeks new assignments and skill building opportunities.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 4, '4', 'Participation', 'Volunteers to participate in organizational/unit initiatives designed to improve the work environment.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 5, '5', 'Adaptability', 'Shows ability to change and adapt in a positive way.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 6, '6', 'Efficacy', 'Organizes work to deliver and/or support efficient and effective customer service.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Innovation', 'B', 2);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 7, '1', 'Initative and Efficiency', 'Initiates better ways of doing things even in the absence of apparent problems.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 8, '2', 'Completion', 'Completes assigned duties necessary to meet the needs of the department, patients and customers.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Integrity', 'C', 3);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 9, '1', 'Takes Responsibility', 'Admits mistakes and takes measures to prevent reoccurrence.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 10, '2', 'Follow-Through', 'Follows through on commitments.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 11, '3', 'Openness', 'Is open, honest and trustworthy in all interactions.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 12, '4', 'Service Initiative', 'Always willing to serve and seeks answers if unable to assist customer directly.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 13, '5', 'Judgment', 'Makes good judgment based on knowledge/skills and personal integrity.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 14, '6', 'Commitment', 'Displays commitment to do the right thing.');


INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Respect', 'D', 4);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 15, '1', 'Compassion', 'Treats others with respect, dignity and compassion.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 16, '2', 'Perspective', 'Seeks first to understand other points of view and accept differences in others.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 17, '3', 'Relationships', 'Builds relationships with other team members.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 18, '4', 'Listening', 'Listens attentively and responds professionally when communicating with others.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 19, '5', 'Emotional Quotient', 'Recognizes personal emotions and behaviors and their effect on working relationships.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Service', 'E', 5);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 20, '1', 'Demeanor', 'Smiles and is friendly introducing oneself by name/title and calls patient/customer by name.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 21, '2', 'Communication Skills', 'Uses appropriate tone, content and facial expressions when communicating to customers or in the presence of others.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 22, '3', 'Compassionate Care', 'Delivers care/service in a compassionate and unhurried manner.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 23, '4', 'Information Sharing', 'Keeps patient/customer informed.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 24, '5', 'Privacy Management', 'Does not discuss inappropriate issues in front of customers (i.e. personal matters, staffing issues, privacy).');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 25, '6', 'Collaboration', 'Works with others to maintain a high quality of care/service.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (@ii, 'Teamwork', 'F', 6);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES
  (@qg, @qti, 26, '1', 'Work Environment Building', 'Cultivates a positive work environment. Organizes work and break times in order to assist co-workers.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 27, '2', 'Team Playing', 'Solicits ideas from other team members and collaborates for a win/win solution.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 28, '3', 'Burden Sharing', 'Contributes fair share of work to the team.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 29, '4', 'Attitude', 'Motivates other team members.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, @qti, 30, '5', 'Public Persona', 'Speaks positively about other services and seeks to resolve communication errors rather than placing blame.');




