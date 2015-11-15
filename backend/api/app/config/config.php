<?php
/**
 * This file will be merged with the site config file (config.<site>.php) and generate a parallel javascript installation.js file
 * in the frontend.
 */
return [
	'appName'       => 'CogentQI',
	'copyright'     => 'Copyright © 2015, CogentQI.com.  All rights reserved.',
	'dbUser'        => 'cogentqiapp',
	'dbPass'        => 'cogentqi42app',
	'trademarkName' => 'CogentQI&#8482;',
	'name'          => 'CogentQI.com',
	'logo'          => '<i class="fa fa-sliders"></i>',
	'components'    => [
		'login'      => ['social' => FALSE, 'register' => FALSE],
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
