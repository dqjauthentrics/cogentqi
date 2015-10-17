'use strict';

angular.module('ControllerCommon', [])

	.controller('LoginController', [
		'$scope', '$location', 'Authentication', function ($scope, $location, Authentication) {
			$scope.data = {email: '', password: '', msg: '', error: ''};

			$scope.login = function (loginType) {
				$scope.data.msg = Authentication.login(loginType, $scope.data.email, $scope.data.password,
													   function (user) {
														   $scope.data.msg = "Succeeded!";
														   $scope.data.error = "success";
														   Authentication.check();
														   Authentication.login2($scope.data.email, $scope.data.password);
													   },
													   function (failMsg) {
														   $scope.data.msg = failMsg;
														   $scope.data.error = "error";
													   });
			};
			$scope.createAccount = function () {
				Authentication.createAccount($scope.data.email, $scope.data.password);
			};
			$scope.logout = function () {
				Authentication.logout();
				window.location.href = "/#/login";
				return 'logged out';
			};
		}
	])
;