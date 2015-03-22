<?php
namespace App;

class Badge extends Model {

	public function map($dbRecord, $full = TRUE) {
		$associative = [
			"id"       => $dbRecord["id"],
			"memberId" => $dbRecord["member_id"],
			"title"    => $dbRecord["title"],
			"earned"   => $dbRecord["earned"],
		];
		return $associative;
	}
}
