<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\Configuration;

class ConfigurationController extends ControllerBase {

	/**
	 * Return the configuration record.
	 */
	public function singleAction($id) {
		$result = new Result($this);
		$cfg = Configuration::findFirst();
		$cfg = $cfg->map();
		$result->sendNormal($cfg);
	}

	/**
	 * Save the configuration record.
	 */
	public function updateAction() {
		$result = new Result($this);
		$transaction = $this->transactionManager->getOrCreateTransaction();
		try {
			$formCfg = @$this->getInputData("data");
			if (!empty($formCfg)) {
				$cfg = Configuration::findFirst();
				$unmapped = $cfg->unmap($formCfg, $cfg);
				$cfg->save($unmapped);
			}
			$transaction->commit();
			$result->setNormal();
		}
		catch (\Exception $exception) {
			$transaction->rollback();
			$result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->send();
	}
}