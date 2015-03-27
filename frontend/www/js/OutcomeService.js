'use strict';

angular.module('app.outcomes', ['app.utility']).service('Outcomes', function ($http, Utility) {
	var svc = this;
	svc.outcomes = false;

	/**
	 * Initializes the outcomes array if it has not yet been initialized.
	 *
	 * @returns {Array}
	 */
	svc.initialize = function (callback) {
		if (svc.outcomes === false) {
			svc.outcomes = true;
			$http.get('/api/outcome/all').
				success(function (data, status, headers, config) {
							svc.outcomes = data.result; // set data to real value
							if (!Utility.empty(callback)) {
								callback();
							}
						}).
				error(function (data, status, headers, config) {
					  });
		}
		return svc.outcomes;
	};

	/**
	 * Called in ng-repeat so that it makes sure the data is initialized.  An ng-init call does not work.
	 * @returns {Array}
	 */
	svc.getAll = function (e) {
		console.log("GETALLCALLED");
		e.initialize();
		svc.initialize();
		return svc.outcomes;
	};

	svc.find = function (outcomeId) {
		if (!Utility.empty(svc.outcomes)) {
			for (var i = 0; i < svc.outcomes.length; i++) {
				if (svc.outcomes[i].id == outcomeId) {
					return svc.outcomes[i];
				}
			}
		}
		return null;
	};

});
