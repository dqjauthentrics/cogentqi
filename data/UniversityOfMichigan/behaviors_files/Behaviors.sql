INSERT INTO instrument (name, is_uniform, question_type_id, max_range, min_range) VALUES ('Behaviors',1,NULL,0,4);
SET @instrId = LAST_INSERT_ID();
INSERT INTO question_group(instrument_id, tag, number, sort_order, summary) VALUES(@instrId, 'Clinical Skills and Knowledge', 'A.1', 1, '');
	SET @qgroupId = LAST_INSERT_ID();
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q1',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,1,'A.1.1','Assessment');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Performs assessment and identifies appropriate nursing diagnosis and/or patient care standard with assistance.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Independently and completely performs focused assessment to provide most effective patient care for a given patient population.
Recognizes specialty data.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Independently and consistently performs goal- focused and individualized assessment when caring for all patients, including those with complex pathophysiological and psychosocial needs.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Exhibits highly developed assessment abilities that exemplify a comprehensive understanding of the total patient/family situation.
');
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q2',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,2,'A.1.2','Nursing Diagnosis');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Recognizes data and identifies obvious nursing diagnoses.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Prioritizes key nursing diagnoses to address physical and psychosocial/ emotional areas.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Individualizes nursing diagnoses based on assessment data.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Individualizes nursing diagnoses based on assessment data and integrates that with the diagnoses &amp; priorities of other disciplines in order to provide holistic care.
');
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q3',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,3,'A.1.3','Planning/Implementation/Evaluation');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Practice is guided primarily by policies, procedures, and standards.
Identifies expected outcomes and nursing interventions to meet identified diagnoses and maintain standards of clinical practice.
Evaluates patients based on basic standards.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Practice is driven by theory and experience. Independently develops, implements, and evaluates plan of care that recognizes subtle changes in patient’s condition and adapts plan as needed.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Practice relies on previous experience for focused analysis of problems and solutions with individual patient modification in order to meet outcomes.
Accommodates unplanned events and evaluates/ responds appropriately with speed, efficiency, flexibility and confidence.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Practice is driven by an intuitive base and is self- directed, flexible, and innovative.
Is consistently effective in providing holistic care that ensures positive change even in the most challenging patient care situations.
');
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q4',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,4,'A.1.4','Technology');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Utilizes standard unit technology and with assistance uses advanced technology as appropriate. Utilizes computer correctly for basis functions, including: • Groupwise • CareWeb – labs and radiology results reporting • Omnicell • Mandatory Program/ Competencies • Policies and procedures
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Utilizes standard unit technology and uses advanced technology as appropriate. Utilizes computer for basic functions as well as reference on patient conditions and treatment.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Becomes expert and resource for use of standard unit technology and advanced technology as appropriate.
Becomes resource for use of computer.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Takes a leadership role in evaluating technology and its potential for use.
Able to conduct literature search through library functions – CINAHL, Cochrane, Medline, PubMed.
');
INSERT INTO question_group(instrument_id, tag, number, sort_order, summary) VALUES(@instrId, 'Therapeutic Relationships', 'A.2', 2, 'An intentional interactive relationship with patients and families that iscaring, clear, boundaried, positive and professional. It encompasses the philosophy of the institution, empowerment of the care givers and empowerment of the patient/family.');
	SET @qgroupId = LAST_INSERT_ID();
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q5',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,5,'A.2.5','Therapeutic   Communication');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Recognizes how the nurse- patient/family relationship impacts the patient experience. Introduces self as a Registered Nurse and describes role.
Consistently wears identification. Establishes open communication.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Possesses clarity on ones own values and how they effect interactions, relationships and boundary setting.
Individualizes communication based on assessment of the patients and families.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Consistently role models individualized therapeutic communication based on patient and family needs. Initiates consultation/leader- ship with the healthcare team to share and promote collaborative approach to patient and family care.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Intuitively uses expert therapeutic communication with patient/family.
Shares and promotes collaborative approach to patient and family care.
');
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q6',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,6,'A.2.6','Empowerment   – Nurse, Patient, Family');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Recognizes the need for patient and family to participate in care. Seeks help as appropriate to assess readiness for participation in care.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Incorporates patient/family in planning and implementing care.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Invites patients and families to actively participate in plan of care to foster growth and competence.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Maximizes patient/family participation in decision making and goal setting along the continuum of care.
');
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q7',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,7,'A.2.7','Compassion');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Actively listens to patient/ family concerns in a respectful manner.
Shows kindness and caring with patients/families.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Demonstrates empathy in interactions with patient/ Families.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Plans and provides nursing care that promotes intentional caring.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Intuitive understanding of patient/family experience and is proactive in providing creative approaches to optimize comfort and support.
');
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q8',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,8,'A.2.8','Advocacy and Ethics');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Recognizes, respects, and supports patient/family rights and maintains confidentiality.
Aware of UMHS patient rights and responsibility.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Mobilizes appropriate resources in response to situations that have the potential to negatively impact patient/family outcomes.
Recognizes ethical issues and seeks assistance in addressing them.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Challenges situations and/or decisions that obstruct positive patient outcomes and works to reduce barriers. Anticipates patient/family needs.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'***Challenges and adapts systems to maximize the benefits for patient care.
');
INSERT INTO question_group(instrument_id, tag, number, sort_order, summary) VALUES(@instrId, 'Professional Relationships', 'A.3', 3, 'An intentional interactive relationship with the health care team thatis marked by mutual regard, trust, and active engagement.');
	SET @qgroupId = LAST_INSERT_ID();
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q9',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,9,'A.3.9','Collaboration with   the Health Care Team');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Recognizes role of each member of the health care team.
Aware of importance of team collaboration and with guidance begins to initiate collaborative communication.
Initiates referrals.
Recognizes the impact of one’s behavior on others.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Initiates, recognizes and values professional collaborative communication and the positive effect on patient outcomes. Identifies and utilizes collaborative resources.
Monitors referrals.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Is sought out by members of the multi-disciplinary health care team.
Frequently initiates consults with health care team.
Actively collaborates with other health professionals in delivering care.
Recognizes need and calls for team conference.
Acts as resource to nursing and health care team.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Through shared values and a clear professional identify, demonstrates and role models an interdisciplinary collaborative approach to patient care.
Participates and/or leads team care conference.
');
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q10',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,10,'A.3.10','Valuing   Teams/Teamwork');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Identifies self as member of nursing and health care teams. Begins to generate trust, respect, and compassion within the workgroup.
Takes responsibility for developing beginning team relationships.
Seeks assistance with resolving conflict. Meets professional commitments consistently.
Asks for and accepts help when needed.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Functions as an independent and supportive team member. Provides assistance to others. Demonstrates empathy and compassion in interactions with team members.
Approaches conflict situations in a constructive manner.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Fosters mutual regard, respect, and trust.
Demonstrates flexibility.
Creates conditions and relationships that promote creative, innovative, and positive processes and outcomes.
Role models behaviors that demonstrate compassion and caring.
Fosters other’s development of conflict resolution skills.
Demonstrates active engagement to enhance patient care and promote a positive workplace.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Demonstrates team values that orient people to care about performance and success of others.
Recognizes value of conflict in individual and organization learning and growth.
');
INSERT INTO question_group(instrument_id, tag, number, sort_order, summary) VALUES(@instrId, 'Professional Development', 'A.4', 4, 'Committed to the professional development of self and others.');
	SET @qgroupId = LAST_INSERT_ID();
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q11',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,11,'A.4.11','Self');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Engages in self assessment related to orientation and ongoing learning needs and seeks out unit resources to assist in meeting needs.
Completes mandatory/ competency requirements during orientation and annually.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Sets goals for knowledge/ skill enhancement within the practice setting.
Seeks out additional learning experiences within practice area: • Unit specific certifications • Consultation with experts • Inservices/rounds • Collaborates with multidisciplinary team
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'***Sets goals for knowledge/skill enhancement within and beyond the practice setting.
***Attends inservice(s)/CE within and beyond practice area.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'***Sets goals in self directed manner and actively seeks out opportunities for knowledge/skill enhancement within and beyond the practice setting.
***Evidence of advancing professional identify (at least one): • Certification in specialty (ACCN, ANCC Specialty Areas) • Active participation in Professional organization (i.e., clinical specialty organizations, UMPNC, MNA, ANA, UAN) • Active membership/ leadership role in institutional groups related to nursing
');
INSERT INTO question_group(instrument_id, tag, number, sort_order, summary) VALUES(@instrId, 'Advancing Practice through Innovation and Research', 'A.5', 5, 'Demonstrates ongoing innovation byreviewing, critiquing and applying existing evidence to practice. Continually improves practice by applying performance improvement methodologies.');
	SET @qgroupId = LAST_INSERT_ID();
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q12',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,12,'A.5.12','Innovation   (creative solutions to everyday problems)');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Has knowledge of and supports established nursing improvement projects/endeavors in practice setting.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Identifies areas for creative improvement in practice setting and seeks out resources and avenues to address them (unit practice council, content experts, etc.).
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'Takes on leadership role in relation to innovations/ improvements in practice setting. Reads evidence based articles related to area of practice.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Independently seeks out opportunities to share information and influence evidence based nursing practice.
Evaluates effectiveness of innovation/practice challenges.
');
	INSERT INTO question_type(name,min_range,max_range) VALUES('Q13',0,4);
	SET @qTypeId = LAST_INSERT_ID();
	INSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,13,'A.5.13','Research');
	SET @qId = LAST_INSERT_ID();
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,0,'(not set)',0,'(no value)');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,1,'Advanced Beginner',1,'Reads clinical articles. Participates in unit/area based Continuous Quality Improvement projects.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,2,'Fully Competent',2,'Demonstrates an awareness of current literature in area of practice, including journal club, inservices, etc.
Identifies individual patient problems which require investigation. Participates in unit/area based research, as appropriate.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,3,'Proficient',3,'***Participates in unit/area based/institutional Continuous Quality Improvement projects.
Presents at unit based educational forums.
');
		INSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,4,'Expert',4,'Implements change in practice for a population of patients based on the application of current research findings and evaluates effectiveness of practice changes.
Makes recommendations for changes in practice based on findings. ***Shares findings of Continuous Quality Improvement projects, such as: • Unit presentation • Rounds • Poster • Publishing
Applies current literature/ research to problems in practice area.
');
