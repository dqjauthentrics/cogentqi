#!/usr/bin/php
<?php
$path = @$argv[1];
if (empty($path)) {
	echo 'Usage: ' . $argv[0] . ' <sql-update-file>' . PHP_EOL;
	exit();
}
$host = '127.0.0.1';
$conn = mysqli_connect($host, "root", "mysql42");
if (!$conn) {
	echo "ERROR: Unable to connect to $host.\n";
	exit();
}
$result = mysqli_query($conn, "SHOW DATABASES");
$rows = mysqli_fetch_assoc($result);

$mysql = "mysql ";
echo "Processing all CogentQI databases on $host\n";
$dbs = [];
while ($row = mysqli_fetch_row($result)):
	$db = $row[0];
	if (strstr($db, 'cogentqi_v1_')) {
		$dbs[] = $db;
	}
endwhile;
echo str_repeat('*', 30) . "* C A U T I O N *".str_repeat('*', 30).PHP_EOL;
echo "This will run the script \n\t$path\n against the following databases on $host:\n";
foreach ($dbs as $db) {
	echo "\t" . sprintf("%-30s", $db) . PHP_EOL;
}
echo str_repeat('*', 30) . "* C A U T I O N *".str_repeat('*', 30).PHP_EOL;
$line = readline("Are you sure this is what you wish to do <y|e|[n]>? ");
$response = strtolower(trim($line));
foreach ($dbs as $db) {
	$doIt = $response == "y";
	if (!$doIt) {
		$each = strtolower(trim(readline("\tapply to $db <y|q|r|[n]>?")));
		if ($each == "q") {
			$response = "y"; // rest
		}
		$doIt = $each == "y";
		if ($each == "q") {
			break;
		}
	}
	if ($doIt) {
		$cmd = "$mysql $db < $path";
		echo "\tprocessing: $cmd...\n";
		exec($cmd);
	}
}
