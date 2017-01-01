#!/usr/local/bin/php
<?php
$conn = mysqli_connect('localhost', "cogentqiapp", "cogentqi42app");
if (!$conn) {
	echo "ERROR: Unable to connect to database server.\n";
	exit();
}
$commands = [
	'UPDATE plan_item SET status_stamp = date_add(current_timestamp, INTERVAL (-1 * randomInt(1, 365)) DAY);',
	'UPDATE module SET starts = date_add(current_timestamp, INTERVAL randomInt(1, 100) DAY);',
	'UPDATE module SET ends = date_add(starts, INTERVAL randomInt(0, 5) DAY);',
	'UPDATE member_note SET last_modified = date_add(current_timestamp, INTERVAL (-1 * randomInt(1, 365)) DAY);',
	'UPDATE member_event SET occurred = date_add(current_timestamp, INTERVAL (-1 * randomInt(1, 365)) DAY);',
	'UPDATE member_badge SET earned = date_add(current_timestamp, INTERVAL (-1 * randomInt(1, 365)) DAY);',
	'UPDATE message SET sent = date_add(current_timestamp, INTERVAL (-1 * randomInt(1, 365)) DAY);',
	'UPDATE assessment SET last_modified = date_add(current_timestamp, INTERVAL (-1 * randomInt(1, 365)) DAY);',
	'UPDATE assessment_response SET time_stamp = (SELECT last_modified FROM assessment WHERE id= assessment_id LIMIT 1);',
	'UPDATE assessment SET last_saved = last_modified;',
	'UPDATE outcome_report SET evaluated = date_add(current_timestamp, INTERVAL (-1 * randomInt(1, 365)) DAY);',
	'UPDATE plan_item SET status_stamp = date_add(current_timestamp, INTERVAL (-1 * randomInt(1, 365)) DAY);',
	'UPDATE assessment SET score = (SELECT avg(response) FROM assessment_response WHERE assessment_id = assessment.id);',
	'UPDATE assessment SET rank = round(score);'
];
$query = "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'cogent%'";
$result = mysqli_query($conn, $query);
while ($row = mysqli_fetch_array($result)) {
	$dbName = $row['schema_name'];
	echo "Database: $dbName\n";
	if (strstr($dbName, 'cogentqi_v1_')) {
		if (mysqli_select_db($conn, $dbName)) {
			foreach ($commands as $command) {
				echo "COMMAND ON $dbName: $command\n";
				mysqli_query($conn, $command);
			}
		}
	}
}
