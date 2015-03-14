angular.module('app.controllers', [])

	.controller('LoginController', [
					'$scope', '$rootScope', '$location', 'Authentication', function ($scope, $rootScope, $location, Authentication) {
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

	.controller('DashboardCtrl', function ($scope, Employees) {
					$scope.e = Employees;
					Employees.initialize();
				})

	.controller('EmployeeCtrl', function ($scope, $stateParams, Utility, Employees, Assessments) {
					$scope.e = Employees;
					$scope.a = Assessments;
					$scope.employee = null;
					Employees.initialize();
					console.log("PARAMS:", $stateParams);
					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.employeeId)) {
						$scope.employee = Employees.get($stateParams.employeeId);
						console.log("EMPLOYEE:", $scope.employee);
					}
				})

	.controller('OutcomeCtrl', function ($scope, Outcomes, Resources) {
					$scope.o = Outcomes;
					$scope.r = Resources;

					$scope.getResource = function (resourceId) {
						for (var i = 0; i < $scope.r.resources.length; i++) {
							if ($scope.r.resources[i].id == resourceId) {
								return $scope.r.resources[i];
							}
						}
						return null;
					};
				})

	.controller('ResourceCtrl', function ($scope, $stateParams, Utility, Resources) {
					$scope.playerVars = {controls: 2, autoplay: 0, modestbranding: 1, rel: 0, theme: 'light'};
					$scope.r = Resources;
					$scope.resource = null;
					if (!Utility.empty($stateParams)) {
						var resourceId = $stateParams.resourceId;
						if (!Utility.empty(resourceId)) {
							$scope.resource = $scope.r.get($stateParams.resourceId);
						}
					}
				})
	.controller('ClassCtrl', function ($scope, $stateParams, Utility, Classes) {
					$scope.cl = Classes;
				})

	.controller('AssessmentCtrl', function ($scope, $stateParams, Utility, Assessments, Employees, Resources) {
					$scope.a = Assessments;
					$scope.e = Employees;
					$scope.r = Resources;
					$scope.assessment = null;

					$scope.r0 = [];
					$scope.r1 = [1];
					$scope.r2 = [1, 1];
					$scope.r3 = [1, 1, 1];
					$scope.r4 = [1, 1, 1, 1];
					$scope.r5 = [1, 1, 1, 1, 1];

					Employees.initialize();
					console.log("PARAMS:", $stateParams);
					if (!Utility.empty($stateParams)) {
						if (!Utility.empty($stateParams.assessmentId)) {
							$scope.assessment = Assessments.get($stateParams.assessmentId);
							console.log("ASSESSMENT:", $scope.assessment);
						}
						else if (!Utility.empty($stateParams.employeeid)) {
							$scope.employee = Employees.get($stateParams.employeeid);
							console.log("EMPLOYEE:", $scope.employee);
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
				})

	.controller('SettingsCtrl', function ($scope) {
					$scope.settings = {
						sampleSetting: true
					};
				});

