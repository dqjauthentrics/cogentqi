USE cogentqi_v1_trucking;
DELETE FROM recommendation;
DELETE FROM resource_alignment;
DELETE FROM outcome_alignment;
DELETE FROM assessment_response;
DELETE FROM plan_item;
DELETE FROM question;
DELETE FROM question_group;

UPDATE resource SET name = 'Accident Procedures', number = 'TRD-00001',
  description            = 'Covers procedures and methods for handling an accident scene.',
  location               = 'http://www.ryderfleetproducts.com/Accident-Procedures-Online-Training-ot-TRD-00001' WHERE ID = 1;
UPDATE resource SET name = 'Air Brakes' WHERE ID = 2;
UPDATE resource SET name = 'Backing & Docking' WHERE ID = 3;
UPDATE resource SET name = 'Cargo Handling' WHERE ID = 4;
UPDATE resource SET name = 'Cargo Security' WHERE ID = 5;
UPDATE resource SET name = 'Communication' WHERE ID = 6;
UPDATE resource SET name = 'Counter-Terrorism' WHERE ID = 7;
UPDATE resource SET name = 'Defensive Driving' WHERE ID = 8;
UPDATE resource SET name = 'Driver Qualifications' WHERE ID = 9;
UPDATE resource SET name = 'Driver Wellness' WHERE ID = 10;
UPDATE resource SET name = 'Emergency Maneuvers' WHERE ID = 11;
UPDATE resource SET name = 'The Environment' WHERE ID = 12;
INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00013', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '');
INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00014', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Extreme Conditions I');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00015', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Extreme Conditions II');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00016', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Extreme Conditions III');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00017', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Fuel Management');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00018', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'HazMat');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name, location, description)
VALUES ('T', 1, 'PM', 'TRD-00148', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Hours of Service',
        'http://www.ryderfleetproducts.com/hours-of-service-online-training-ot-trd-00148',
        'Discusses HOS regulations. covers the hours a driver is allowed to drive and work each shift; mandatory off duty times between shifts; preparation and filing of logs and compliance with regulations. (with or without sleeper berths)
      Approximately 30 minutes of training time.'
);

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00020', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Logbooks');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00021', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Malfunctions');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00022', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Night Driving');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00023', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Pre-Trip');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00024', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Preventive Maintenance');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Skid Control');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00026', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Space Management');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00027', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Speed Management');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00028', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Trip Planning');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00029', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Visual Search');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00030', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Whistleblower');

INSERT INTO resource (resource_type_id, creator_id, role_ids, number, create_on, last_modified, name)
VALUES ('T', 1, 'PM', 'TRD-00031', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Workplace Safety');


INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (1, 'Pre-Trip Inspection', 'A', 1);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 1, '1', 'General Checks', 'Checks general condition approaching unit including leakage of coolants, fuel, and lubricants.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES
  (@qg, 1, 2, '2', 'Under-the-hood Checks', 'Checks under hood – Oil levels, fluid levels, coolant, belts, steering, and general condition of compartment.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 3, '3', 'Circle Checks', 'Tires, lights, signals, trailer hookup, brake/light lines, body, doors, horn, and windshield wipers.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES
  (@qg, 1, 4, '4', 'Air System Checks', 'Static and dynamic air loss, build time etc., brake action, tractor protection valve, parking brake, rolling test.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 5, '5', 'Emergency Equipment Checks',
        'Checks jacks, tools, emergency warning devices, tire chains, fire extinguisher, spare fuses, 4 way flashers, flares.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 6, '6', 'Instrument Checks', 'Checks instruments and sets mirrors.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 7, '7', 'Visibility Checks', 'Cleans windshield.');


INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (1, 'Placing Vehicle in Motion and Use of Controls', 'A', 2);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 8, '1', 'Motor', '
* Starts motor without difficulty
* Allows proper warm-up
* Understands gauges on instrument panel
* Maintains proper engine speed
* Has basic knowledge of motors – Gas/Diesel
* No abuse of motor
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 9, '1', 'Clutch and Transmission', '
* Starts loaded unit smoothly
* Uses clutch properly
* Times shifting properly and shifts smoothly
* Uses proper gear sequence
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 10, '2', 'Brakes', '
* Knows operating principals of air brakes
* Proper use of tractor protection valve
* Understands low air warning
* Tests brakes before starting trip
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 11, '3', 'Steering', '
* Does not fight steering wheel
* Does not allow truck to wander
* Good driving posture
* Maintains grip on wheel
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 12, '4', 'Lights', '
* Knows lighting regulations
* Uses proper headlight beam
* Dims lights when following or meeting traffic
* Adjusts speed to range of headlights
* Proper use of auxiliary lights
');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (1, 'Coupling and Uncoupling', 'A', 3);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 13, '1', 'Line-up', 'Lines up units.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 14, '2', 'Brakes and Electric', 'Hooks brake and electric lines properly.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 15, '3', 'Anchoring', 'Secures trailer against movement.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 16, '4', 'Backing', 'Backs under slowly.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 17, '5', 'Testing', 'Tests hookup with power and visually.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 18, '6', 'Landing Gear', 'Handles landing gear properly.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 19, '7', 'Hookup', 'Proper hookup of full trailer.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 20, '8', 'Power Unit', 'Secures power unit against movement.');


INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (1, 'Backing and Parking', 'A', 4);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 21, '1', 'Backing', '
* Gets out and checks before backing
* Looks back as well as checks mirrors
* Gets out to re-check on long back (over one truck length)
* Avoids backing from blind side
* Sounds horn when backing – before moving and every half truck length
* Controls speed and direction when backing
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 22, '2', 'Parking (City)', '
* Does not take too many pull-ups
* Does not hit nearby vehicles/stationary objects
* Does not hit curb
* Parks close to curb
* Secures unit – sets park brake, puts in gear, blocks wheels, shuts off motor
* Shoulder checks traffic conditions and/or signal when pulling out of parked position
* Parks in legal and safe location
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 23, '3', 'Parking (Road)', '
* Parks off pavement
* Avoids parking on soft shoulder
* Uses emergency signals when needed
* Secures unit properly
');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (1, 'Slowing and Stopping', 'A', 5);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 24, '1', 'Ascending Gears', 'Uses gears properly when ascending.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 25, '2', 'Descending Gears', 'Gears down properly when descending.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 26, '3', 'Stopping/Restarting', 'Stops and re-starts without rolling backwards (no rollbacks).');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 27, '4', 'Brake Tests', 'Tests brakes at top of hills.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 28, '5', 'Brake Use on Hills', 'Uses brakes properly on hills.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 29, '6', 'Mirror Use', 'Uses mirrors to monitor traffic at rear.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 30, '7', 'Signalling', 'Signals following traffic.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 31, '8', 'No Sudden Stopping', 'Avoids sudden stops.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 32, '9', 'Stopping Smoothly', 'Stops smoothly without excessive fanning.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 33, '10', 'Stopping When Required', 'Stops before crosswalk when coming out of driveway or alley.');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 34, '11', 'Stopping Position', 'Stops  clear of pedestrian crosswalks.');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (1, 'Traffic Operations', 'A', 6);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 35, '1', 'Turning', '
* Selects correct lane well in advance
* Signals well in advance
* Monitors traffic conditions and turns only when safe to proceed
* Does not swing wide or cut short
* Completes turn in correct lane
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 36, '2', 'Traffic Signs and Signals', '
* Approaches signal prepared to stop if needed (aware of stale green lights)
* Does not violate traffic signal
* Does not run yellow lights
* Does not start up up too fast or too slow on green signal
* Notices and heeds traffic signs
* Does not STOP signs (crosses stop line without stopping first)
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 37, '3', 'Intersections', '
* Adjusts speed to permit stopping if required
* Checks for cross traffic regardless of signals or signs
* Yields right-of-way for safety
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 38, '4', 'Grade Crossings', '
* Adjusts speed to conditions
* Makes safe stop if required
* Selects proper gear
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 39, '5', 'Passing', '
* Passes with sufficient clear space ahead
* Passes in safe locations only:  not on hill, curve, at intersection, etc.
* Does not fail to signal lane change or change lanes too quickly (waits at least 4 signal flashes before moving)
* Does not fail to warn driver being passed (sound horn, flash lights)
* Does not tailgate, waiting chance to pass
* Does not block traffic with slow pass
* Does not cut in too short returning to right lane
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 40, '6', 'Speed', '
* Speed consistent with basic ability
* Adjusts speed according to road, weather, traffic conditions or legal limits
* Slows down for rough roads or crossings
* Slows down in advance of curves, intersections, hazards, etc.
* Maintains consistent speed
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 41, '7', 'Courtesy and Safety', '
* Does not depend on others for safety
* Does not crowd other drivers or force way through (aggressive driving)
* Allows faster traffic to pass
* Keeps right and in own lane
* Only necessary use of horn
* Courteous and proper conduct
');

INSERT INTO question_group (instrument_id, tag, number, sort_order) VALUES (1, 'Miscellaneous', 'A', 7);
SET @qg = LAST_INSERT_ID();
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 42, '1', 'General Driving Habits and Ability', '
* Uses seatbelt
* Consistently alert and attentive, aware of changing traffic conditions
* Reacts to changing conditions
* Performs routine functions without taking eyes off road
* Checks instruments regularly
* Distracted by phone, radio, GPS
* Willing to take instructions and suggestions
* Adequate self-confidence in driving
* Nervous, apprehensive
* Easily angered
* Complains too much
* Professional personal appearance, manner
* Good physical stamina
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 43, '2', 'Freight Handling', '
* Checks freight properly
* Handles and loads freight properly
* Handles bills properly
* Breaks down load as required
');
INSERT INTO question (question_group_id, question_type_id, sort_order, number, name, summary)
VALUES (@qg, 1, 44, '3', 'Rules and Regulations', '
* Knowledge of company rules
* Knowledge of regulations: Federal, Provincial, local
* Knowledge of special truck routes
');
