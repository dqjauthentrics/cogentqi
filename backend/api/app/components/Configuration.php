<?php

class Configuration {
	function __construct($frontendSiteDir, $infix) {
		$this->load($frontendSiteDir, $infix);
	}

	public function load($frontendSiteDir, $infix) {
		$configuration = require_once(dirname(__DIR__) . "/config/config.php");
		try {
			$configPath = dirname(__DIR__) . "/config/config.$infix.php";
			$overrides = require_once($configPath);
			if (!empty($overrides)) {
				foreach ($overrides as $override => $parameters) {
					if ($override == "components") {
						if (!empty($override)) {
							foreach ($parameters as $feature => $featureParameters) {
								if (!empty($featureParameters) && is_array($featureParameters)) {
									foreach ($featureParameters as $parameter => $setting) {
										$configuration["components"][$feature][$parameter] = $setting;
									}
								}
							}
						}
					}
					else {
						$configuration[$override] = $parameters;
					}
				}
			}
		}
		catch (Exception $exception) {
		}
		$jsonConfigPath = "$frontendSiteDir/config.js";
		if (!@file_exists($jsonConfigPath)) {
			$jsonConfig = 'var configuration = ' . json_encode($configuration, JSON_PRETTY_PRINT) . ';';
			@file_put_contents($jsonConfigPath, $jsonConfig);
		}
		return $configuration;
	}
}