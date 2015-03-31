'use strict';

angular.module('app.authentication', []).service('Authentication', function ($http, $cookieStore, Utility, FIREBASE_URL) {
	var svc = this;
	svc.resultMsg = "";

	svc.check = function () {
		var user = $cookieStore.get('user');
		if (Utility.empty(user)) {
			window.location.href = "/#/login";
		}
		else if (user.roleId == "A") {
			window.location.href = "/#/administrator/dashboard";
		}
		else {
			window.location.href = "/#/manager/dashboard";
		}
	};

	svc.createAccount = function (email, password) {
	};

	svc.logout = function () {
		$cookieStore.remove('user');
	};

	svc.login = function (loginType, email, password) {
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
								$cookieStore.put('user', data);
								console.log("USER:", $cookieStore.get('user'));
								svc.check();
							}).
					error(function (data, status, headers, config) {
							  svc.resultMsg = "Login failed.";
						  });
				break;
			default:
		}
	};
});


