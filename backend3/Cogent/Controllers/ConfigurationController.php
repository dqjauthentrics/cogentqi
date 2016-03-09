<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Configuration;

class ConfigurationController extends ControllerBase {

	/**
	 * Return the configuration record.
	 */
	public function getAction() {
		$result = new Result($this);
		$cfg = Configuration::findFirst();
		$cfg = $cfg->map();
		$result->sendNormal($cfg);
	}

	/**
	 * Save the configuration record.
	 */
	public function saveAction() {
		$result = new Result($this);
		$transaction = $this->transactionManager->getOrCreateTransaction();
		try {
			$data = @$this->getInputData();
			if (!empty($data["configuration"])) {
				$formCfg = $data["configuration"];
				$cfg = Configuration::findFirst();
				$cfg->save($cfg->unmap($formCfg));
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