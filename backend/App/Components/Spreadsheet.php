<?php
namespace App;
require_once dirname(__DIR__) . "/Lib/PHPExcel-1.8/Classes/PHPExcel.php";

class Spreadsheet {
	public $path = '';
	public $table = [];

	function __construct($path) {
		$this->path = $path;
		$this->toTable();
	}

	/**
	 * Convert spreadsheet worksheet(s) to simple two dimensional array.
	 */
	public function toTable() {
		$objPHPExcel = \PHPExcel_IOFactory::load($this->path);
		foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
			$highestRow = $worksheet->getHighestRow(); // e.g. 10
			$highestColumn = $worksheet->getHighestColumn(); // e.g 'F'
			$highestColumnIndex = \PHPExcel_Cell::columnIndexFromString($highestColumn);
			for ($row = 1; $row <= $highestRow; ++$row) {
				$tableRow = [];
				for ($col = 0; $col < $highestColumnIndex; ++$col) {
					$cell = $worksheet->getCellByColumnAndRow($col, $row);
					$val = $cell->getValue();
					$tableRow[] = $val;
				}
				$this->table[] = $tableRow;
			}
		}
	}
}
