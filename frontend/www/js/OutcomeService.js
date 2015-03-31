'use strict';

angular.module('app.outcomes', ['app.utility']).service('Outcomes', function ($resource, $http, Utility) {
	var svc = this;
	svc.outcomes = null;
	svc.currentOutcomes = null;

	svc.retrieve = function () {
		if (svc.outcomes == null) {
			svc.outcomes = [];
			$resource('/api/outcome', {}, {}).query().$promise.then(function (data) {
				svc.outcomes = data;
				console.log("outcomes: retrieved:", svc.outcomes);
			});
		}
		return svc.outcomes;
	};

	svc.findOrgOutcomes = function (organizationId) {
		if (Array.isArray(svc.outcomes) && !Utility.empty(organizationId)) {
			svc.currentOutcomes = [];
			for (var i = 0; i < svc.outcomes.length; i++) {
				svc.outcomes[i].level = parseInt(svc.outcomes[i].level);
				for (var j = 0; j < svc.outcomes[i].levels.length; j++) {
					if (svc.outcomes[i].levels[j].o == organizationId && svc.outcomes[i].levels[j].out == svc.outcomes[i].id) {
						svc.outcomes[i].level = parseInt(svc.outcomes[i].levels[j].l);
						svc.currentOutcomes.push(svc.outcomes[i]);
					}
				}
			}
		}
		return svc.currentOutcomes;
	};

	svc.find = function (outcomeId) {
		for (var i = 0; i < svc.outcomes.length; i++) {
			if (svc.outcomes[i].id == outcomeId) {
				return svc.outcomes[i];
			}
		}
		return null;
	};

});
