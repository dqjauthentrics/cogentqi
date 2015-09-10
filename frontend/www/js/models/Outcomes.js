'use strict';

angular.module('Outcomes', []).service('Outcomes', function ($cookieStore, $resource, $http, Utility) {
	var svc = this;
	svc.outcomes = null;
	svc.currentOutcomes = [];

	svc.retrieve = function (getLevelsForMyOrg) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			var url = '/api/outcome' + (!Utility.empty(getLevelsForMyOrg) ? '/organization/' + user.organizationId : '');
			return $resource(url, {}, {});
		}
		return null; //@todo What happens if this gets returned?  There would be an exception in the controller!
	};

	svc.findOrgOutcomes = function (organizationId) {
		return svc.outcomes;
	};

	svc.find = function (outcomeId) {
		for (var i = 0; i < svc.outcomes.length; i++) {
			if (svc.outcomes[i].id == outcomeId) {
				return svc.outcomes[i];
			}
		}
		return null;
	};

	svc.saveAlignments = function (instrumentId, outcomeId, alignments, callbackFn) {
		$http({
			method: 'POST',
			url: "/api/outcome/saveAlignments",
			data: $.param({instrumentId: instrumentId, outcomeId: outcomeId, alignments: alignments}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
			success(function (data, status, headers, config) {
						callbackFn(1, data);
					}).
			error(function (data, status, headers, config) {
					  callbackFn(0, data);
				  });
	}
});
