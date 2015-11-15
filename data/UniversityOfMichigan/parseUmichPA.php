<?php

function innerHtml($node) {
	$innerHTML = '';
	$children = $node->childNodes;
	foreach ($children as $child) {
		$innerHTML .= $child->ownerDocument->saveXML($child);
	}
	return $innerHTML;
}

function clean($str) {
	$str = str_replace("'", "''", $str);
	$str = str_replace("\t", " ", $str);
	$str = str_replace("\n", " ", $str);
	$str = str_replace("\r", " ", $str);
	$str = trim(preg_replace('/\s\s+/', ' ', str_replace("\t", " ", $str)));
	if (strlen($str) > 3 && ctype_upper(substr($str, 0, 1)) && substr($str, 1, 1) == '.') {
		$str = substr($str, 2);
	}
	return $str;
}

function getParts($cellContent) {
	$pos = strpos($cellContent, ":");
	if ($pos > 0) {
		$name = trim(substr($cellContent, 0, $pos));
		$desc = trim(substr($cellContent, $pos + 1));
	}
	else {
		$name = trim($cellContent);
		$desc = '';
	}
	return [clean($name), clean($desc)];
}

function loadSheet($filePath) {
	$domainName = 'General';
	$domains = [$domainName => ['summary' => 'UMHHC Performance Behaviors', 'competencies' => []]];
	echo "Loading: $filePath\n";
	$doc = new DOMDocument();
	@$doc->loadHTMLFile($filePath);
	$rows = $doc->getElementsByTagName('tr');
	/** @var DOMElement $row */
	$current = NULL;
	foreach ($rows as $row) {
		$cells = $row->getElementsByTagName('td');
		switch ($cells->length) {
			case 3:
				/** @var DOMElement $cell */
				foreach ($cells as $cell) {
					$cellContent = trim(clean(strip_tags(htmlspecialchars_decode(innerHtml($cell)))));
					$cellContent = str_replace('      ', '', $cellContent);
					$cellContent = str_replace(' ', '', $cellContent);
					$badLine = substr($cellContent, 0, 6) == "Scale:" || $cellContent == "Manager’s Evaluation" || $cellContent == "Self Evaluation" ||
						$cellContent == '     ';
					if (!$badLine && strlen(trim($cellContent)) > 1 && $cellContent != ' ' && !is_numeric($cellContent)) {
						echo "CELL::$cellContent::\n";
						list($compName, $compDesc) = getParts($cellContent);
						$parts = explode(" ", $compName);
						$firstWord = str_replace(":", "", trim($parts[0]));
						if (ctype_upper($firstWord)) {
							$domainName = $compName;
							$domains[$domainName] = ['summary' => "$compDesc", 'competencies' => []];
						}
						else {
							$domains[$domainName]['competencies'][$compName] = $compDesc;
						}
					}
				}
				break;
			case 4:
				/** @var DOMElement $cell */
				foreach ($cells as $cell) {
					$cellContent = trim(clean(strip_tags(htmlspecialchars_decode(innerHtml($cell)))));
					$cellContent = str_replace('      ', '', $cellContent);
					$cellContent = str_replace(' ', '', $cellContent);
					if (strlen(trim($cellContent)) > 1 && $cellContent != ' ' && !is_numeric($cellContent)) {
						echo "\tCELL::$cellContent::\n";
						list($compName, $compDesc) = getParts($cellContent);
						$domains[$domainName]['competencies'][$compName] = $compDesc;
					}
				}
				break;
		}
	}
	return $domains;
}

## Main
$framework = 'PA Evaluation';
$filePath = $argv[1];
$domains = loadSheet($filePath);

$levels = ['(not set)', 'Not Met', 'Approaching', 'Solid Performance', 'Exemplary'];
$i = 0;
$script = "INSERT INTO instrument (name, is_uniform, question_type_id, max_range, min_range) VALUES ('$framework',1,NULL,0,4);\n";
$script .= "SET @instrId = LAST_INSERT_ID();\n";
$qNumber = 0;
$groupIdx = 0;
$letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
$rubrics = [
	'The requirements are not met.',
	'Progress is being made toward completion of the requirements.',
	'Requirements have been met.',
	'Requirements have been met and exceeded.'
];
foreach ($domains as $name => $domain) {
	$summary = $domain['summary'];
	$groupPrefix = $letters[$i];
	$i++;
	$script .= "INSERT INTO question_group(instrument_id, tag, number, sort_order, summary) VALUES(@instrId, '$name', '$groupPrefix', $i, '$summary');\n";
	$script .= "\tSET @qgroupId = LAST_INSERT_ID();\n";
	if (count($domain["competencies"]) > 0) {
		$qIdx = 0;
		foreach ($domain["competencies"] as $competency => $summary) {
			$qIdx++;
			if (count($rubrics) > 0) {
				$qNumber++;
				$num = $groupPrefix . '.' . $qIdx;
				$script .= "\tINSERT INTO question_type(name,min_range,max_range) VALUES('PAQ$qNumber',0,4);\n";
				$script .= "\tSET @qTypeId = LAST_INSERT_ID();\n";
				$script .= "\tINSERT INTO question(question_group_id,question_type_id,sort_order,number,name,summary) VALUES(@qgroupId,@qTypeId,$qNumber,'$num','$competency','$summary');\n";
				$script .= "\tSET @qId = LAST_INSERT_ID();\n";
				$rIdx = 0;
				$name = $levels[$rIdx];
				$script .= "\t\tINSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,$rIdx,'$name',$rIdx,'(no value)');\n";
				$rIdx++;
				foreach ($rubrics as $rubric) {
					$name = $levels[$rIdx];
					$script .= "\t\tINSERT INTO question_choice(question_type_id, sort_order, name, value, rubric) VALUES (@qTypeId,$rIdx,'$name',$rIdx,'$rubric');\n";
					$rIdx++;
				}
			}
		}
	}
}
file_put_contents("$filePath.sql", $script);
