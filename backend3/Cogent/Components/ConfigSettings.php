<?php
namespace Cogent\Components;

class ConfigSettings {
	public $config = [
		'appName'       => 'CogentQI',
		'copyright'     => 'Copyright © 2015, CogentQI.com.  All rights reserved.',
		'trademarkName' => 'CogentQI&#8482;',
		'name'          => 'CogentQI.com',
		'logo'          => '<i class="fa fa-sliders"></i>',

		/** Expected by Phalcon ==> */
		'database'      => [
			'adapter'  => 'Mysql',
			'host'     => 'localhost',
			'username' => 'cogentqiapp',
			'password' => 'cogentqi42app',
			'dbname'   => 'cogentqi_v1_healthcare',
			'charset'  => 'utf8',
		],
		'application'   => [
			'appDir'         => APP_PATH,
			'controllersDir' => APP_PATH . '/Cogent/Controllers/',
			'modelsDir'      => APP_PATH . '/Cogent/Models/',
			'componentsDir'  => APP_PATH . '/Cogent/Components/',
			'viewsDir'       => APP_PATH . '/Cogent/Views/',
			'pluginsDir'     => APP_PATH . '/Cogent/Plugins/',
			'cacheDir'       => APP_PATH . '/Cogent/cache/',
			'baseUri'        => '/api3/',
		],
		/** <== Expected by Phalcon */

		'components'    => [
			'login' => ['social' => FALSE, 'register' => FALSE],

			'dashboards' => [
				'professional'  => [
					'assessments'     => TRUE,
					'recommendations' => TRUE,
					'plan'            => TRUE,
					'completed'       => TRUE
				],
				'manager'       => [
				],
				'administrator' => [
				],
			]
		]
	];

	/**
	 * @return mixed
	 */
	public function getInfixFromServer() {
		$parts = explode(".", @$_SERVER["SERVER_NAME"]);
		return $parts[0];
	}

	/**
	 * @param $jsonConfigPath
	 */
	public function writeJson($jsonConfigPath) {
		if (!@file_exists($jsonConfigPath)) {
			$clientConfig = [
				'appName'       => $this->config['appName'],
				'copyright'     => $this->config['copyright'],
				'trademarkName' => $this->config['trademarkName'],
				'name'          => $this->config['name'],
				'logo'          => $this->config['logo'],
				'components'    => $this->config['components']
			];
			$jsonConfig = 'var configuration = ' . json_encode($clientConfig, JSON_PRETTY_PRINT) . ';';
			@file_put_contents($jsonConfigPath, $jsonConfig);
		}
	}

	/**
	 * @param $siteConfigPath
	 */
	public function loadSite($siteConfigPath) {
		$overrides = require_once($siteConfigPath);
		if (!empty($overrides)) {
			$this->config = array_replace_recursive($this->config, $overrides);
		}
	}
}