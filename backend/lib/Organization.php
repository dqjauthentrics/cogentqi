<?php
namespace App;

class Organization extends Model {

	/**
	 * @param array $organization
	 * @param bool  $full
	 *
	 * @return array
	 */
	public function map($organization, $full = FALSE) {
		$associative = [
			"id"       => $organization["id"],
			"name"     => $organization["name"],
			"parentId" => $organization["parent_id"],
			"summary"  => $organization["summary"]
		];
		if ($full) {
			$associative["description"] = $organization["description"];
		}
		return $associative;
	}
}