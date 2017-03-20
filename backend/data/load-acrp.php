#!/usr/local/bin/php
<?php
require_once './SpreadsheetLoader.php';

## Main
$loader = new \bin\SpreadsheetLoader($argv[1]);
$loader->conn->begin_transaction();
try {
    $levelLabels = ['-unset-', 'Entry-Level CRA', 'Intermediate CRA', 'Senior CRA', 'Clinical Lead'];
    $tableRowIdx = 0;
    $domainIdx = 0;
    $questionIdx = 0;
    foreach ($loader->table as $row) {
        if ($tableRowIdx > 0) {
            $desc1 = $loader->getColumn(@$row[0]);
            $domain = $loader->getColumn(@$row[1]);
            $desc2 = $loader->getColumn(@$row[2]);
            $lvls = [$loader->getColumn(@$row[3]), $loader->getColumn(@$row[4]), $loader->getColumn(@$row[5]), $loader->getColumn(@$row[6])];

            if (!empty($desc1) && !empty($domain) && !empty($desc2) && !empty($lvls[0]) && !empty($lvls[1]) && !empty($lvls[2]) && !empty($lvls[3])) {
                $qGroupId = $loader->getOrAddRow("SELECT id FROM question_group WHERE name='$domain'",
                    "INSERT INTO question_group (instrument_id, name, sort_order) VALUES (3,'$domain',$domainIdx)", $domainIdx);
                if (!empty($qGroupId)) {
                    $qId = $loader->getOrAddRow("SELECT id FROM question WHERE question_group_id='$qGroupId' AND sort_order=$questionIdx",
                        "INSERT INTO question (question_group_id, name, full_text, sort_order) VALUES ($qGroupId,'$desc1','$desc2',$questionIdx)", $questionIdx);
                    $foo = 0;
                    $tId = $loader->getOrAddRow("SELECT id FROM question_type WHERE name='Question_$qId'",
                        "INSERT INTO question_type (name, min_range, max_range, entry_type) VALUES ('Question_$qId',0,4,'LIKERT')", $foo);

                    $chIdx = 0;
                    $chId = $loader->getOrAddRow("SELECT id FROM question_choice WHERE question_type_id='$tId' AND value=-1",
                        "INSERT INTO question_choice (question_type_id, name, value, rubric, icon_prefix, sort_order) VALUES ($tId,'-unset-',0,'There is no response to this item.','level4Bg',0)", $chIdx);
                    for ($i = 1; $i < 5; $i++) {
                        $text = $loader->escape($lvls[($i - 1)]);
                        $chId = $loader->getOrAddRow("SELECT id FROM question_choice WHERE question_type_id='$tId' AND sort_order=$chIdx",
                            "INSERT INTO question_choice (question_type_id, name, value, rubric, icon_prefix, sort_order) VALUES ($tId,'{$levelLabels[$i]}',$i,'$text','level4Bg',$i)", $chIdx);
                    }
                }
                else {
                    throw new Exception("Unable to find/create group ($domain).");
                }
            }
            else {
                echo "WARNING: skipping row " . ($tableRowIdx + 1) . "\n";
            }
        }
        $tableRowIdx++;
    }
    $loader->conn->commit();
}
catch (\Exception $exception) {
    echo $exception->getMessage() . "\n";
    $loader->conn->rollback();
}