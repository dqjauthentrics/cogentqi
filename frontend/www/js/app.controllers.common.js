'use strict';

angular.module('app.controllers.common', [])

	.controller('LoginController', [
					'$scope', '$location', 'Authentication', function ($scope, $location, Authentication) {

						var email = null;
						var password = null;
						var createEmail = null;
						var createPassword = null;
						$scope.auth = Authentication;

						$scope.login = function (loginType) {
							Authentication.login(loginType, this.email, this.password);
						};
						$scope.createAccount = function () {
							Authentication.createAccount(this.createEmail, this.createPassword);
						};
						$scope.logout = function () {
							Authentication.logout();
							window.location.href = "/#/login";
							return 'logged out';
						};
					}
				])

	.controller('EvaluationCtrl', function ($scope, $stateParams, Utility, Evaluations, Members, Resources) {
					$scope.e = Evaluations;
					$scope.m = Members;
					$scope.r = Resources;
					$scope.evaluation = null;
					$scope.member = null;

					$scope.r0 = [];
					$scope.r1 = [1];
					$scope.r2 = [1, 1];
					$scope.r3 = [1, 1, 1];
					$scope.r4 = [1, 1, 1, 1];
					$scope.r5 = [1, 1, 1, 1, 1];

					Members.initialize();
					if (!Utility.empty($stateParams)) {
						if (!Utility.empty($stateParams.evaluationId)) {
							$scope.evaluation = Evaluations.get(Members, $stateParams.evaluationId);
						}
					}
					$scope.getRange = function (n) {
						switch (Math.round(n)) {
							case 1:
								return $scope.r1;
							case 2:
								return $scope.r2;
							case 3:
								return $scope.r3;
							case 4:
								return $scope.r4;
							case 5:
								return $scope.r5;
						}
						return $scope.r0;
					};
					$scope.setActive = function (type) {
						$scope.active = type;
					};

					$scope.isActive = function (type) {
						return type === $scope.active;
					};
				})
;