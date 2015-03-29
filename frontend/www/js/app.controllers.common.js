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
	.controller('MatrixCtrl', function ($scope, $stateParams, Utility, Evaluations, Members, Resources) {
					$scope.e = Evaluations;
					$scope.m = Members;
					$scope.r = Resources;
					$scope.instrumentId = 1;

					Members.initialize();
					Evaluations.initialize();
					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
						$scope.instrumentId = $stateParams.instrumentId;
					}
					if (Utility.empty($scope.instrumentId)) {
						$scope.instrumentId = 1;
					}
					Evaluations.getMatrixData($scope.instrumentId, false);
				})
	.controller('EvaluationCtrl', function ($scope, $stateParams, Utility, Evaluations, Members, Resources) {
					$scope.e = Evaluations;
					$scope.m = Members;
					$scope.r = Resources;
					$scope.instrumentId = false;
					$scope.evaluationId = null;

					$scope.r0 = [];
					$scope.r1 = [1];
					$scope.r2 = [1, 1];
					$scope.r3 = [1, 1, 1];
					$scope.r4 = [1, 1, 1, 1];
					$scope.r5 = [1, 1, 1, 1, 1];

					Members.initialize();
					Evaluations.initialize();
					if (!Utility.empty($stateParams)) {
						if (!Utility.empty($stateParams.evaluationId)) {
							$scope.evaluationId = $stateParams.evaluationId;
						}
						if (!Utility.empty($stateParams.instrumentId)) {
							$scope.instrumentId = $stateParams.instrumentId;
						}
					}

					if ($scope.instrumentId === false) {
						$scope.instrumentId = 1;
					}
					$scope.hasComment = function (question) {
						return !Utility.empty(question.responseRecord.evaluatorComments) && question.responseRecord.evaluatorComments.length > 0;
					};
					$scope.showComment = function (question) {
						return !Utility.empty(question.showComments) && question.showComments;
					};
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
					$scope.weightGreaterThanZero = function () {
						return function (item) {
							return item.weight > 0;
						}
					}
				})
;