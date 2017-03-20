<?php
namespace bin;

require_once '../App/Components/Spreadsheet.php';

use \App\Spreadsheet;

class SpreadsheetLoader {
	/** @var \mysqli $conn */
	public $conn;

	/** @var string $loadDir */
	public $loadDir = '';

	/** @var string $fileName */
	public $fileName = '';

	public $spreadsheet = NULL;

	public $table = [];

	/**
	 * SpreadsheetLoader constructor.
	 *
	 * @param string $filePath
	 *
	 * @throws \Exception
	 */
	function __construct($filePath) {
        $this->conn = mysqli_connect("localhost", "root", "mysql42", "cogentqi_v1_cro");
		$this->filePath = $filePath;
		if (!file_exists($this->filePath)) {
			throw new \Exception("Cannot find file '$this->filePath''\n");
		}
		echo "Opening $this->filePath...\n";
		$this->spreadsheet = new Spreadsheet($this->filePath);

		echo "\textracting table...\n";
		$this->table = $this->spreadsheet->table;
	}

	/**
	 * @param string $query
	 * @param string $insert
	 * @param int    $idx
	 *
	 * @return int|null|string
	 * @throws \Exception
	 */
	public function getOrAddRow($query, $insert, &$idx) {
		$result = mysqli_query($this->conn, $query);
		if ($result) {
			$row = mysqli_fetch_assoc($result);
		}
		$id = (!empty($row['id']) ? $row['id'] : NULL);
		if (empty($id)) {
			$idx++;
			if (!empty($insert)) {
				echo "\t$insert\n";
				if (!$this->conn->query($insert)) {
					throw new \Exception($this->conn->error);
				}
				$id = mysqli_insert_id($this->conn);
				if (empty($id)) {
					throw new \Exception($this->conn->error);
				}
			}
		}
		return $id;
	}

	/**
	 * @param string $sql
	 *
	 * @throws \Exception
	 */
	public function execute($sql) {
		echo "\t$sql\n";
		if (!mysqli_query($this->conn, $sql)) {
			throw new \Exception($this->conn->error);
		}
	}

	/**
	 * @param string $col
	 *
	 * @return string
	 */
	public function getColumn($col) {
		return mysqli_escape_string($this->conn, trim($col));
	}

    /**
     * @param string $str
     *
     * @return mixed
     */
	public function escape($str) {
	    return $this->conn->escape_string($str);
    }
}