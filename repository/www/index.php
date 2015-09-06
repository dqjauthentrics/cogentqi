<?php
require '../RedBeanPHP4_2_5/rb.php';
R::setup('mysql:host=localhost;dbname=cogentqi_v1_demo', 'root', 'mysql42');
R::freeze();
//$assessment = R::dispense('assessment');
$assessments = R::find('assessment');
$i = 1;
foreach ($assessments as $assessment) {
	echo $i . "\t" . $assessment->instrument_id . "\t" . $assessment->last_saved . "\n";
	$i++;
}