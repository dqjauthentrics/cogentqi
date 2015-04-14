'use strict';

angular.module('Authentication', []).service('Authentication', function ($rootScope, $state, $http, $cookieStore, Utility) {
	var svc = this;
	svc.resultMsg = "";

	svc.check = function () {
		/**
		 * @todo Use $state.go here, and will probably have to store the user.home differently for that use.
		 */
		var user = $cookieStore.get('user');
		console.log("USER:", user);
		if (Utility.empty(user) || user.home == undefined) {
			window.location.href = "/#/login";
		}
		else {
			window.location.href = user.home;
		}
	};

	svc.createAccount = function (email, password) {
	};

	svc.logout = function () {
		$cookieStore.remove('user');
	};

	svc.getUserDashUrl = function (user) {
		if (user !== undefined && user !== null) {
			var roleLoc = 'professional';
			if (user.roleId == 'A') {
				roleLoc = 'administrator';
			}
			else if (user.roleId == 'P' || user.roleId == 'M') {
				roleLoc = 'manager';
			}
			return '/#/' + roleLoc + '/dashboard';
		}
		return null;
	};

	svc.login = function (loginType, email, password, successFn, failFn) {
		switch (loginType) {
			case 'google':
			case 'twitter':
			case 'facebook':
				break;
			case 'password':
				$http({
						  method: 'POST',
						  url: "/api/authentication",
						  data: $.param({username: email, password: password}),
						  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					  }).
					success(function (data, status, headers, config) {
								if (!Utility.empty(data)) {
									data.home = svc.getUserDashUrl(data);
								}
								$cookieStore.put('user', data);
								$rootScope.user = $cookieStore.get('user');
								if (!Utility.empty(data)) {
									successFn($rootScope.user);
								}
								else {
									failFn('Sorry, but your login credentials were not recognized.');
								}
							}).
					error(function (data, status, headers, config) {
							  failFn('Sorry, we are unable to connect with the authentication server.');
						  });
				break;
			default:
		}
	};
});


