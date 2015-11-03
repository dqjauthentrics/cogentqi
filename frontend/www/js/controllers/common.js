/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ControllerCommon', [])
	.controller(
	'CommonTabsCtrl',
	function ($scope, Utility) {
		//$ionicNavBarDelegate.showBackButton(false);

		$scope.$on('$ionicView.beforeEnter', function () {
			//$ionicNavBarDelegate.showBackButton(false);
		});

		$scope.$on('$ionicView.leave', function () {
			//$ionicNavBarDelegate.showBackButton(true);
		});

		$scope.go = function (url) {
			location.href = url;
		}
	})


	.controller('LoginController', [
		'$scope', '$location', 'Authentication', function ($scope, $location, Authentication) {
			$scope.data = {email: '', password: '', msg: '', error: ''};

			$scope.login = function (loginType) {
				$scope.data.msg = Authentication.login(loginType, $scope.data.email, $scope.data.password,
													   function (user) {
														   $scope.data.msg = "";
														   $scope.data.error = "success";
														   Authentication.check();
														   //Authentication.login2($scope.data.email, $scope.data.password);
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