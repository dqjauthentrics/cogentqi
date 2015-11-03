/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('LearningModules', []).service('LearningModules', function ($resource, Utility, Resources) {
	var svc = this;

	svc.retrieve = function () {
		return $resource('/api2/module', {}, {});
	};
});
