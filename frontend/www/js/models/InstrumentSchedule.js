'use strict';

angular.module('InstrumentSchedule', []).service('InstrumentSchedule', function ($resource, Utility) {
	var svc = this;

	svc.retrieve = function () {
		return $resource('/api2/instrument-schedule/:id/m/1', {}, {});
	};
});