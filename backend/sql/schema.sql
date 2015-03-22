DROP TABLE IF EXISTS resource_alignment;
DROP TABLE IF EXISTS evaluation_response;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS evaluation;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS question_type_response;
DROP TABLE IF EXISTS question_type;
DROP TABLE IF EXISTS question_group;
DROP TABLE IF EXISTS instrument;
DROP TABLE IF EXISTS algorithm_usage;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS resource;
DROP TABLE IF EXISTS resource_type;

CREATE TABLE role (
  id          CHAR         NOT NULL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  summary     VARCHAR(500),
  description VARCHAR(5000)
);
INSERT INTO role (id, name) VALUES ('P', 'Professional');
INSERT INTO role (id, name) VALUES ('M', 'Manager');
INSERT INTO role (id, name) VALUES ('A', 'Administrator');
INSERT INTO role (id, name) VALUES ('S', 'Sysadmin');

CREATE TABLE organization (
  id          INTEGER      NOT NULL AUTO_INCREMENT PRIMARY KEY,
  parent_id   INTEGER      NULL,
  name        VARCHAR(100) NOT NULL,
  summary     VARCHAR(5000),
  description TEXT,
  FOREIGN KEY (parent_id) REFERENCES organization (id)
);

INSERT INTO organization (parent_id, name) VALUES (NULL, 'CogentQI');
INSERT INTO organization (parent_id, name) VALUES (1, 'Target Pharmacy');
INSERT INTO organization (parent_id, name) VALUES (2, 'Store 0001');
INSERT INTO organization (parent_id, name) VALUES (2, 'Store 0002');

CREATE TABLE member (
  id              INTEGER      NOT NULL AUTO_INCREMENT PRIMARY KEY,
  organization_id INT          NOT NULL,
  role_id         CHAR         NOT NULL DEFAULT 'P',
  first_name      VARCHAR(50)  NOT NULL,
  last_name       VARCHAR(50)  NOT NULL,
  job_title       VARCHAR(50)  NULL,
  email           VARCHAR(100) NULL,
  username        VARCHAR(100) NOT NULL UNIQUE,
  password        VARCHAR(20),
  avatar          VARCHAR(200) NULL,
  FOREIGN KEY (organization_id) REFERENCES organization (id)
);

INSERT INTO member (organization_id, first_name, last_name, email, username) VALUES (1, 'David', 'Quinn-Jacobs', 'dqj@cogentqi.com', 'dqj@cogentqi.com');
INSERT INTO member (organization_id, first_name, last_name, email, username) VALUES (1, 'JR', 'Hoyer', 'jrhyoyer@cogentqi.com', 'jrhoyer@cogentqi.com');
INSERT INTO member (organization_id, first_name, last_name, job_title, role_id, avatar, username) VALUES (
  2, 'Melissa', 'Barbache', 'Area Manager', 'A', 'img/faux/users/1.jpg', 'admin1@cogentqi.com'
);
INSERT INTO member (organization_id, first_name, last_name, job_title, role_id, avatar, username) VALUES (
  3, 'Ben', 'Sycamore', 'IT Director', 'M', 'img/faux/users/1.jpg', 'manager1@cogentqi.com'
);
INSERT INTO member (organization_id, first_name, last_name, job_title, role_id, avatar, username) VALUES (
  3, 'Andrea', 'Franklin', 'Developer', 'P', 'img/faux/users/1.jpg', 'prof1@cogentqi.com'
);
INSERT INTO member (organization_id, first_name, last_name, job_title, role_id, avatar, username) VALUES (
  3, 'Regina', 'Shipman', 'Designer', 'P', 'img/faux/users/1.jpg', 'prof2@cogentqi.com'
);
INSERT INTO member (organization_id, first_name, last_name, job_title, role_id, avatar, username) VALUES (
  3, 'Maggie', 'Westover', 'Developer', 'P', 'img/faux/users/1.jpg', 'prof3@cogentqi.com'
);
INSERT INTO member (organization_id, first_name, last_name, job_title, role_id, avatar, username) VALUES (
  3, 'Perry', 'Constable', 'Developer', 'P', 'img/faux/users/1.jpg', 'prof4@cogentqi.com'
);
INSERT INTO member (organization_id, first_name, last_name, job_title, role_id, avatar, username) VALUES (
  3, 'Jim', 'Harris', 'Developer', 'P', 'img/faux/users/1.jpg', 'prof5@cogentqi.com'
);
INSERT INTO member (organization_id, first_name, last_name, job_title, role_id, avatar, username) VALUES (
  3, 'Marion', 'Wight', 'Designer', 'P', 'img/faux/users/1.jpg', 'prof6@cogentqi.com'
);
UPDATE member
SET password = md5('c0gent'), email = username;

CREATE TABLE algorithm_usage (
  id          CHAR         NOT NULL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(5000),
  summary     VARCHAR(500)
);
INSERT INTO algorithm_usage (id, name) VALUES ('N', 'None');
INSERT INTO algorithm_usage (id, name) VALUES ('R', 'Recommendations');

CREATE TABLE question_type (
  id        INTEGER             NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(200) UNIQUE NOT NULL,
  summary   VARCHAR(500),
  min_range REAL                         DEFAULT 0.0,
  max_range REAL                         DEFAULT 0.0
);
INSERT INTO question_type (name, summary, min_range, max_range) VALUES ('LIKERT5', 'Likert scale, 0 t0 5.', 0, 5);
INSERT INTO question_type (name, summary, min_range, max_range) VALUES ('NAYesNo', 'N/A,Yes,No', 0, 2);

CREATE TABLE question_type_response (
  id               INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  question_type_id INT     NOT NULL,
  sort_order       INT     NOT NULL,
  name             VARCHAR(200),
  value            VARCHAR(500),
  rubric           VARCHAR(500),
  FOREIGN KEY (question_type_id) REFERENCES question_type (id)
);
INSERT INTO question_type_response (question_type_id, sort_order, name, value, rubric) VALUES (1, 0, '-unset-', '-1', '');
INSERT INTO question_type_response (question_type_id, sort_order, name, value, rubric) VALUES (1, 1, 'Unacceptable', '-1', '');
INSERT INTO question_type_response (question_type_id, sort_order, name, value, rubric) VALUES (1, 2, 'Needs Improvement', '-1', '');
INSERT INTO question_type_response (question_type_id, sort_order, name, value, rubric) VALUES (1, 3, 'Proficient', '-1', '');
INSERT INTO question_type_response (question_type_id, sort_order, name, value, rubric) VALUES (1, 4, 'Distinguished', '-1', '');

INSERT INTO question_type_response (question_type_id, sort_order, name, value, rubric) VALUES (2, 0, '-unset-', '-1', '');
INSERT INTO question_type_response (question_type_id, sort_order, name, value, rubric) VALUES (2, 1, 'Yes', '1', '');
INSERT INTO question_type_response (question_type_id, sort_order, name, value, rubric) VALUES (2, 2, 'No', '0', '');


CREATE TABLE instrument (
  id          INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100),
  role_id     CHAR    NOT NULL DEFAULT 'P',
  usage_id    CHAR    NOT NULL DEFAULT 'R',
  description VARCHAR(5000),
  summary     VARCHAR(500),
  is_uniform  BOOL             DEFAULT TRUE,
  FOREIGN KEY (role_id) REFERENCES role (id),
  FOREIGN KEY (usage_id) REFERENCES algorithm_usage (id)
);
INSERT INTO instrument (name, usage_id, summary) VALUES ('Pharmacy Technician Evaluation', 'R', 'Evaluation of technical staff for software development skills.');
INSERT INTO instrument (name, usage_id, summary)
VALUES ('HCBP Safety Compass', 'R', 'This tool is used to gain an understanding of potential team member, process and/or system opportunities.');
CREATE TABLE question_group (
  id            INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  instrument_id INT     NOT NULL,
  tag           VARCHAR(100),
  number        VARCHAR(40),
  sort_order    INT     NOT NULL DEFAULT 0,
  summary       VARCHAR(500),
  description   VARCHAR(5000),
  FOREIGN KEY (instrument_id) REFERENCES instrument (id)
);
INSERT INTO question_group (tag, instrument_id, sort_order, number) VALUES ('Delivery of Patient Care', 1, 1, '1.0');
/* 1 */
INSERT INTO question_group (tag, instrument_id, sort_order, number) VALUES ('Pharmacy Law and Ethics', 1, 2, '2.0');
/* 2 */
INSERT INTO question_group (tag, instrument_id, sort_order, number) VALUES ('Personal Competencies', 1, 3, '3.0');
/* 3 */

INSERT INTO question_group (tag, instrument_id, sort_order, number) VALUES ('Brand', 2, 1, '1.0');
/* 5 */
INSERT INTO question_group (tag, instrument_id, sort_order, number) VALUES ('Create an Order', 2, 2, '2.0');
/* 6 */
INSERT INTO question_group (tag, instrument_id, sort_order, number) VALUES ('Adding Prescription Information', 2, 3, '3.0');
/* 7 */
INSERT INTO question_group (tag, instrument_id, sort_order, number) VALUES ('Filling', 2, 4, '4.0');
/* 8 */
INSERT INTO question_group (tag, instrument_id, sort_order, number) VALUES ('Pharmacist Verification', 2, 5, '6.0');
/* 4 */
INSERT INTO question_group (tag, instrument_id, sort_order, number) VALUES ('Prescription Pickup', 2, 6, '6.0');
/* 9 */

CREATE TABLE question (
  id                INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  question_group_id INT     NOT NULL,
  question_type_id  INT     NOT NULL DEFAULT 0,
  sort_order        INT     NOT NULL,
  number            VARCHAR(40),
  name              VARCHAR(200),
  summary           VARCHAR(500),
  description       VARCHAR(5000),
  FOREIGN KEY (question_group_id) REFERENCES question_group (id)
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (1, '1.1', 1, 'Patient Introduction',
        'The pharmacy technician should be able to: <ul><li>Identify the patient</li><li>Introduce self to patient and explain their role</li></ul>'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (1, '1.2', 2, 'Patient Assessment',
        'The pharmacy technician should be able to: <ul><li>Question the patient (parent or carer) or a health care professional to obtain information </li><li>Use a variety of information sources to gather information </li><li>Interpret records made by other health care professionals when appropriate</li><li>Identify if the patient has brought in their medicines and/or encourage medicines to be brought in</li></ul>'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (1, '1.3', 3, 'Patient Consent',
        'For ward based pharmacy technicians, the main focus for obtaining patient consent is for using safe and/or removing unsafe Patient’s Own Drugs. This should follow the local process. As pharmacy technicians develop new roles and provide additional services they will require a greater understanding of the issues surrounding consent.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (1, '1.4', 4, 'Relevant Medicines Management Information',
        'During the consultation with the patient, health problems and medicines management background should be identified and documented as per local procedure. Medicines Management background information could include use of compliance aids, information on who usually fills this, need for large print labels, resident of a nursinghome requiring specific discharge instructions, support offered by social services etc. Identification of allergies and poor adherence.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (1, '1.5', 5, 'Identification of Non-Adherence',
        'Pharmacy technicians are ideally placed to identify patient’s with non-adherence to their medicines, such as an inability to use inhalers correctly, a fear of taking medications, or an inability to open clic locs or blister packs. These issues should be resolved and documented by the pharmacy technician or referred according to local policy.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (1, '1.6', 6, 'Identification of Allergies',
        'It is important patient\’s do not receive medicines they allergic to, nor be exposed to products that contain substances they are allergic to eg latex or nuts (some topical preparations contain nut oils). A pharmacy technician should:  <ul><li>Ensure that any allergy identified, including the type of reaction, is documented according to local procedure </li><li>Review the prescription to ensure that no culprit medicines have been prescribed.</li><li>Refer any patients who are prescribed medicines to which they have a documented allergy according to local procedure.</li></ul>  Pharmacy technicians should also be aware some patients describe diarrhoea with antibiotics as being allergic to them.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (2, '2.1', 7, 'Knowledge of Laws and Regulations',
        'The member is familiar with pharmacy laws and regulations, especially as they pertain to pharmacy technician responsibilities.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (2, '2.2', 8, 'Drug Enforcement Administration (DEA) Knowledge',
        'The member is knowledgeable of the Drug Enforcement Administration (DEA) and state requirements for controlled substances: the candidate shall be able to identify controlled substance labels, understand the rationale for controlled substances, the need for proper inventory and accountability, and the proper storage of controlled substances.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (2, '2.3', 9, 'Classification of Legend VS OTC',
        'The member is knowledgeable of the Drug Enforcement Administration (DEA) and state requirements for controlled substances: the candidate shall be able to identify controlled substance labels, understand the rationale for controlled substances, the need for proper inventory and accountability, and the proper storage of controlled substances.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (2, '2.4', 10, 'Pharmaceutical Vocabulary',
        'The member demonstrates a thorough knowledge of general pharmaceutical and medical terminology, the apothecary symbols, abbreviations (English and Latin), and the common chemical symbols.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (3, '3.1', 10, 'Prioritization',
        'The technician should be able to prioritize his/her own work and adjust priorities in response to changing circumstances; for example, knowing which patients/tasks take priority. We recognise that it is not possible or necessary to review the pharmaceutical care of every patient, every day.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (3, '3.2', 11, 'Punctuality',
        'The pharmacy technician should ensure satisfactory completion of tasks with appropriate handover and recognise the importance of punctuality and attention to detail.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (3, '3.3', 12, 'Initiative',
        'The pharmacy technician should demonstrate initiative in solving a problem or taking on a new opportunity/task without the prompting from others, and demonstrate the ability to work independently within their limitations.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (3, '3.4', 13, 'Efficiency',
        'This section deals with time management, and the pharmacy technician should demonstrate efficient use of their time. An example could be reviewing the allocated patients in the given time to an appropriate standard.'
);
INSERT INTO question (question_group_id, sort_order, number, name, description)
VALUES (3, '3.5', 14, 'Patient and Carer',
        'The "carer" may be a friend or relative as well as a social services or private agency care worker.'
);

/** HCBP */
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (4, '1.1', 1, 'Do all Pharmacy workstations, stock areas, will call, front/back counters and compounding appear neat, clean, organized and free of food/beverages?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (4, '1.2', 2, 'Is the pharmacy fully staffed and are team members scheduled appropriately (peak days/ times)?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (4, '1.3', 3, 'Partner with ETL-HR/ETL-Pharmacy and pull training meter report to determine if all team members have completed all required training?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (5, '2.1', 4, 'Does team member determine if guest/pet is a new or existing patient? (TM should only offer paper patient profile, if requested)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (5, '2.2', 5, 'Does team member accurately select the correct guest from patient search using last and first name and DOB?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (5, '2.3', 6, 'Does team member verify that all guest information and maintenance tasks were correctly verified, including name, DOB, address, phone # and allergies?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (5, '2.4', 7, 'Does team member check on-hands to ensure that the quantity is in stock?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (5, '2.5', 8, 'Does team member select the correct Pick Up type (Urgent, Waiting, Shopping, Today, Future Date)?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES
  (5, '2.6', 9, 'If Refill, did the team member complete guest maintenance tasks and let guests know they are out of refills and create an Open Call Queue to alert prescriber?'
  );
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (5, '2.7', 10, 'Does team member ensure scan was successful and all relevant information is clearly captured on both sides of the prescription?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (5, '2.8', 11, 'Does team member place the hard copy prescription in the hard copy container?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (5, '2.9', 12, 'Does team member add the prescription to the queue to ensure proper prioritization?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (5, '2.10', 13,
        'If a prescription is called in from a prescriber or transferred, did only a pharmacist complete this task? (Pharmacist should use a blank prescription pad for all oral and transferred prescriptions)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (5, '2.11', 14, 'If guest does not want a safety cap, does team member select NO and scan a waiver form into Patient Info Image?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (6, '3.1', 15, 'Does team member review all notes associated with the prescription?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (6, '3.2', 16, 'Does team member accurately select DAW and enter all elements of the hard copy?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (6, '3.3', 17,
        'Does team member search for prescribed drug (Drug Field) and select the right drug based on DAW? (Enter at least the first four letters of the drug name to get a better match)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (6, '3.4', 18, 'Does team member enter the correct date and prescriber written on the prescription?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (6, '3.5', 19, 'Does team member get clarification from the pharmacist, if they are unclear or don''t understand hard copy image?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (6, '3.6', 20, 'Does team member provide notes that are related to the drug, if necessary?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (6, '3.7', 21, 'Does team member reject the order if review is required or if they need more information?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (6, '3.8', 22, 'Does team member properly handle any third party rejects/warnings and make any necessary edits?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (6, '3.9', 23, 'Does team member obtain a white or red basket based on Pick Up type?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (7, '4.1', 24, 'Does team member start fill task in order of priority? (Red or White basket)v'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (7, '4.2', 25,
        'Does team member obtain stock bottle from shelf, scan user barcode, scan the ClearRx label, scan the stock bottle and wait for a positive beep and green light to confirm accuracy?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (7, '4.3', 26, 'Does same team member fill all prescriptions in order and complete only one order at a time? (Team member should not batch orders)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (7, '4.4', 27, 'Does team member pull ClearRx bottle, count and measure and label correctly according to quantity field?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (7, '4.5', 28, 'For liquid dosage form, did team member select the correct dispensing device? (PIBA, syringe)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (7, '4.6', 29,
        'Does team member accurately prepare order for pharmacist verification and immediately return the stock bottle to the shelf? (if unit of use stock bottle, TM should include stock bottle for verification)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (7, '4.7', 30, 'Does team member update expiration, if necessary? (Topicals, Liquids, etc.)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (8, '5.1', 31, 'Does Pharmacist initiate task by scanning the ClearRx bottle label?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (8, '5.2', 32, 'Does Pharmacist review all notes provided during order/data entry?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (8, '5.3', 33,
        'Does Pharmacist accurately complete seven point check? (Patient, DUR, SIG, Quantity, Prescriber, DAW) by reviewing the information against scanned hardcopy image.'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (8, '5.4', 34, 'Does Pharmacist open the bottle and validate that the product matches drug image as well as product name, appearance, quantity and ring color?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (8, '5.5', 35,
        'Does Pharmacist evaluate all DURs and drug therapy issues and take appropriate action as needed? (Medication Review; Call Doctor or add notes when they override a DUR)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (8, '5.6', 36,
        'Does Pharmacist reject the prescription correctly and select the right reason code if errors were found? (Sent Back to Data Entry by selecting Return to Data Entry for Correction)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (8, '5.7', 37, 'Does Pharmacist add notes or remove for prescription for this fill or all fills, if needed? Counseling Required? Different generic than previous fill?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (8, '5.8', 38, 'Did Pharmacist select the correct will call bin for placement? (Bulk/Fridge/Mix/Will Call)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES
  (8, '5.9', 39, 'Were prescriptions filed in appropriate will call section by using guest''s last name in each section? Did team clip multiple prescriptions for the same guest?'
  );
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (9, '6.1', 40,
        'Does team member obtain and search the first, last name and DOB of the guest in Will Call from EPS Welcome Screen and determine number of prescription to be picked up?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (9, '6.2', 41, 'Does team member check screen for any release notes and offere counseling by pharmacist? (pharmacy services, auto-refill)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (9, '6.3', 42, 'Does team member correctly retrieve the prescription from the correct location? (Fridge/Bulk/ Mix/Will Call)'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES
  (9, '6.4', 43, 'Does team member remove contents of bag and verify order by reviewing guest name, DOB, address, phone number, and that product matches what guest is expecting?'
  );
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (9, '6.5', 44, 'Does team member determine if counseling is required and alert the Pharmacist?'
);
INSERT INTO question (question_group_id, sort_order, number, name)
VALUES (9, '6.6', 45, 'If counseling is required or requested, does Pharmacist provide counseling? (Counseling should offered on all new prescriptions)'
);

CREATE TABLE evaluation (
  id                 INTEGER   NOT NULL AUTO_INCREMENT PRIMARY KEY,
  instrument_id      INT       NOT NULL,
  member_id          INT       NOT NULL,
  by_member_id       INT       NOT NULL,
  last_saved         DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  evaluator_comments TEXT,
  member_comments    TEXT,
  FOREIGN KEY (member_id) REFERENCES member (id),
  FOREIGN KEY (by_member_id) REFERENCES member (id),
  FOREIGN KEY (instrument_id) REFERENCES instrument (id)
);
CREATE TABLE evaluation_response (
  id                 INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  evaluation_id      INT     NOT NULL,
  question_id        INT     NOT NULL,
  response           VARCHAR(500),
  evaluator_comments TEXT,
  member_comments    TEXT,
  FOREIGN KEY (evaluation_id) REFERENCES evaluation (id),
  FOREIGN KEY (question_id) REFERENCES question (id)
);
ALTER TABLE evaluation_response ADD UNIQUE unique_evaluation_responses (evaluation_id, question_id);

CREATE TABLE resource_type (
  id          CHAR UNIQUE  NOT NULL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  summary     VARCHAR(500),
  description VARCHAR(5000)
);
INSERT INTO resource_type (id, name, summary) VALUES ('T', 'Template', 'Local HTML template file.');
INSERT INTO resource_type (id, name, summary) VALUES ('W', 'Web', 'Web URL.');

CREATE TABLE resource (
  id               INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  resource_type_id CHAR             DEFAULT 'T',
  role_ids         VARCHAR(10)      DEFAULT 'PM',
  number           VARCHAR(40),
  name             VARCHAR(200),
  location         VARCHAR(500),
  summary          VARCHAR(500),
  description      VARCHAR(5000),
  FOREIGN KEY (resource_type_id) REFERENCES resource_type (id)
);
INSERT INTO resource (number, name, summary) VALUES (
  'PHT001', 'Introduction to the Pharmacy, for Technicians', 'This module provides a general overview.'
);
INSERT INTO resource (number, name, summary) VALUES (
  'PHT002', 'Allergy Identification', ''
);
INSERT INTO resource (number, name, summary) VALUES (
  'PHT003', 'Assessing Patients', 'This module provides a general overview.'
);
INSERT INTO resource (number, name, summary) VALUES (
  'PHT004', 'Adherence Assessment', 'This module provides a general overview.'
);
INSERT INTO resource (number, name, summary) VALUES (
  'PHT005', 'Prescription Labeling', 'This module provides a general overview.'
);
INSERT INTO resource (number, name, summary) VALUES (
  'PHT006', 'Code of Conduct', 'This module provides a general overview.'
);
INSERT INTO resource (number, name, summary) VALUES (
  'PHT007', 'Drug Interactions', 'This module provides a general overview.'
);
INSERT INTO resource (number, name, summary) VALUES (
  'PHT008', 'Preventive Care', 'This module provides a general overview.'
);

CREATE TABLE resource_alignment (
  id          INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  resource_id INT     NOT NULL,
  question_id INT     NOT NULL,
  weight      INT     NOT NULL DEFAULT 1,
  FOREIGN KEY (resource_id) REFERENCES resource (id),
  FOREIGN KEY (question_id) REFERENCES question (id)
);
INSERT INTO resource_alignment (resource_id, question_id, weight) VALUE (1,)