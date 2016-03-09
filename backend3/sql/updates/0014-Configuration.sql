CREATE TABLE configuration
(
  id                INT(11) PRIMARY KEY NOT NULL,
  assessment_weight INT(11) DEFAULT '5' NOT NULL,
  outcome_weight    INT(11) DEFAULT '5' NOT NULL
);
CREATE UNIQUE INDEX configuration_id_uindex ON configuration (id);
