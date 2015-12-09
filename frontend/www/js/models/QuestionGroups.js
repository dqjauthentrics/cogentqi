/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('QuestionGroups', []).service('QuestionGroups', function ($cookieStore, $resource, $http, Utility) {
	var svc = this;
	svc.items = null;

	svc.execute = function(callback) {
		if (svc.items == null) {
			Utility.getResource($resource('/api2/questiongroups', {}, {}), function(response){
				svc.items = response;
				callback(svc);
			});
		}
		else {
			callback(svc);
		}
	};
	svc.find = function (groupId) {
		for (var i = 0; i < svc.items.length; i++) {
			if (svc.items[i].id == groupId) {
				return svc.items[i];
			}
		}
		return null;
	};
});
