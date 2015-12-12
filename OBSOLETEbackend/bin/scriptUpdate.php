#!/usr/local/bin/php
<?php
$scriptName = @$argv[1];
if (empty($scriptName)) {
	echo 'Usage: ' . $argv[0] . ' <script-file-path>' . PHP_EOL;
	exit(0);
}
if (!@file_exists($scriptName)) {
	echo "The file '$scriptName' does not exist, or is unreadable.'\n";
	exit(-1);
}
$conn = mysqli_connect("localhost", "cogentqiapp", "cogentqi42app") or die ('Error connecting to mysql: ' . mysqli_error($conn) . PHP_EOL);
$result = mysqli_query($conn, "SHOW DATABASES");
$rows = mysqli_fetch_assoc($result);

$dbs = [];
while ($row = mysqli_fetch_row($result)):
	$dbName = $row[0];
	if (strstr($dbName, "cogentqi")) {
		$dbs[] = $dbName;
	}
endwhile;

if (count($dbs) > 0) {
	foreach ($dbs as $db) {
		echo "\t$db\n";
	}
	$line = readline("Update all these databases? ");
	if (strtolower(trim($line)) == "y") {
		foreach ($dbs as $db) {
			$command = "mysql $db < $scriptName";
			echo "Executing: $command\n";
			exec($command);
		}
	}
	else {
		echo "Aborted.\n";
	}
}
else {
	echo "No databases found!\n";
	exit(-1);
}