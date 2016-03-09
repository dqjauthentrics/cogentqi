/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Configuration', []).service('Configuration', function ($cookieStore, $resource, $http, Utility) {
	var svc = this;

	svc.assessmentWeight = 5;
	svc.outcomeWeight = 5;

	svc.retrieve = function () {
		return $http.get('/api3/configuration/get')
			.then(function (result) {
					  if (result.data.status !== 1) {
						  return $q.reject(result.data);
					  }
					  svc.assessmentWeight = result.data.aw;
					  svc.outcomeWeight = result.data.ow;
					  return svc;
				  },
				  function (error) {
					  $q.reject(error);
				  });
	};

	svc.save = function (callbackFn) {
		var data = {aw: svc.assessmentWeight, ow: svc.outcomeWeight};
		$http.post("/api3/configuration/save", {configuration: data})
			.then(function (data, status, headers, config) {
					  callbackFn(data.data);
				  },
				  function (data, status, headers, config) {
					  callbackFn(data.data);
				  });
	};

});
