ALTER TABLE assessment_response CHANGE recommended_resource recommended_resource_id int;
ALTER TABLE assessment_response ADD CONSTRAINT assessment_response_resource__fk FOREIGN KEY (recommended_resource_id) REFERENCES resource (id);

DELETE FROM _db_update WHERE script_name LIKE '0005%';
INSERT INTO _db_update (script_name) VALUES ('0005-RecommendedResource.sql');
