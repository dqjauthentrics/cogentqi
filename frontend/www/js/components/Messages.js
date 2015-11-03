'use strict';

angular.module('Messages', []).service('Messages', [
	"$ionicPopup", "$http", "Utility",
	function ($ionicPopup, $http, Utility) {
		var svc = this;

		svc.sendText = function (member, message) {
			if (!Utility.empty(message)) {
				$http({
					method: 'POST',
					url: "/api2/message",
					data: $.param({memberId: member.id, message: message}),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function (data, status, headers, config) {
					Utility.popup('Done', 'Message sent.');
				}).error(function (data, status, headers, config) {
				});
			}
		};
	}
]);