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
	$str = trim(preg_replace('/\s\s+/', ' ', str_replace("\t", " ", $str)));
	$str = str_replace("'", "\\'", $str);
	return $str;
}

function loadSheet($filePath) {
	echo "Loading: $filePath\n";
	$doc = new DOMDocument();
	@$doc->loadHTMLFile($filePath);
	$rows = $doc->getElementsByTagName('tr');
	/** @var DOMElement $row */
	$data = ['name' => NULL, 'summary' => '', 'competencies' => []];
	$current = NULL;
	foreach ($rows as $row) {
		$cells = $row->getElementsByTagName('td');
		echo $cells->length . "\n";
		switch ($cells->length) {
			case 1:
				$current = innerHtml($cells->item(0));
				$current = str_replace("\n", " ", strip_tags($current));
				if (empty($data['name'])) {
					$tmp = str_replace("DOMAIN: ", "", $current);
					$tmp = str_replace("(continued)", "", $tmp);
					$tmp = clean($tmp);
					if (strstr($tmp, ':')) {
						$data['name'] = trim(substr($tmp, 0, strpos($tmp, ':')));
						$data['summary'] = trim(substr($tmp, strpos($tmp, ':') + 1));
					}
					else {
						$data['name'] = trim($tmp);
					}
				}
				else {
					if (!strstr($current, "DOMAIN")) {
						$data['competencies'][$current] = [];
					}
				}
				break;
			case 4:
				/** @var DOMElement $cell */
				foreach ($cells as $cell) {
					$cellContent = innerHtml($cell);
					$cellContent = str_replace("<br/><br/>", "\n", $cellContent);
					$cellContent = strip_tags(str_replace("<br/>", " ", $cellContent));
					$cellContent = str_replace("\n\n", "\n", $cellContent);
					$cellContent = str_replace("\n\n", "\n", $cellContent);
					$cellContent = clean($cellContent);
					while (strstr($cellContent, "  ")) {
						$cellContent = str_replace("  ", " ", $cellContent);
					}
					if ($cellContent == "A") {
						break;
					}
					$data['competencies'][$current][] = trim($cellContent) . "\n";
				}
				break;
		}
	}
	return $data;
}

## Main
$dirName = $argv[1];
$domains = [];
$framework = str_replace("_files", "", ucfirst(basename($dirName)));
$filePaths = scandir($dirName);
$domainIdx = 0;
foreach ($filePaths as $fileName) {
	if (strstr($fileName, ".htm") && strstr($fileName, "sheet")) {
		$filePath = "$dirName/$fileName";
		$data = loadSheet($filePath);
		if ($domainIdx == 0 || $domains[($domainIdx - 1)]['name'] != $data['name']) {
			$domains[$domainIdx] = $data;
		}
		else {
			$domainIdx--;
			array_push($domains[$domainIdx], $data);
		}
		$domainIdx++;
	}
}
$levels = ['(not set)', 'Advanced Beginner', 'Fully Competent', 'Proficient', 'Expert'];
$i = 0;
$script = "INSERT INTO instrument (name, is_uniform, question_type_id, max_range, min_range) VALUES ('$framework',1,NULL,0,4);\n";
$script .= "SET @instrId = LAST_INSERT_ID();\n";
$qNumber = 0;
$groupIdx = 0;
$letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
foreach ($domains as $domain) {
	$i++;
	$name = $domain['name'];
	$summary = $domain['summary'];
	$groupPrefix = $letters[$groupIdx] . '.' . $i;
	$script .= "INSERT INTO question_group(instrument_id, tag, number, sort_order, summary) VALUES(@instrId, '$name', '$groupPrefix', $i, '$summary');\n";
	$script .= "\tSET @qgroupId = LAST_INSERT_ID();\n";
	if (count($domain["competencies"]) > 0) {
		$qIdx = 0;
		foreach ($domain["competencies"] as $competency => $rubrics) {
			$qIdx++;
			if (count($rubrics) > 0) {
				$qNumber++;
				$num = $groupPrefix . '.' . $qNumber;
				$script .= "\tINSERT INTO question_type(name,min_range,max_range) VALUES('Q$qNumber',0,4);\n";
				$script .= "\tSET @qTypeId = LAST_INSERT_ID();\n";
				$script .= "\tINSERT INTO question(question_group_id,question_type_id,sort_order,number,name) VALUES(@qgroupId,@qTypeId,$qNumber,'$num','$competency');\n";
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
file_put_contents("$dirName/$framework.sql", $script);
