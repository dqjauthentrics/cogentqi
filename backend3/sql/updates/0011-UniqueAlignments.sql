-- Clean up non unique alignments
delete T1
from outcome_alignment as T1
  inner join  outcome_alignment as T2
    on T1.question_id = T2.question_id
       and T1.outcome_id = T2.outcome_id
       and T1.id < T2.id;

delete T1
from event_alignment as T1
  inner join  event_alignment as T2
    on T1.question_id = T2.question_id
       and T1.event_id = T2.event_id
       and T1.id < T2.id;

delete T1
from resource_alignment as T1
  inner join  resource_alignment as T2
    on T1.question_id = T2.question_id
       and T1.resource_id = T2.resource_id
       and T1.id < T2.id;

ALTER TABLE resource_alignment
  ADD CONSTRAINT question_resource_uc UNIQUE (question_id, resource_id);
ALTER TABLE event_alignment
  ADD CONSTRAINT question_event_uc UNIQUE (question_id, event_id);
ALTER TABLE outcome_alignment
  ADD CONSTRAINT question_outcome_uc UNIQUE (question_id, outcome_id);

DELETE FROM _db_update WHERE script_name LIKE '0011%';
INSERT INTO _db_update (script_name) VALUES ('0011-UniqueAlignments.sql');
