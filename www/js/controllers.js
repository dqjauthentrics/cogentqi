angular.module('app.controllers', [])

	.controller('LoginController', [
					'$scope', '$rootScope', '$location', 'Authentication',
					function ($scope, $rootScope, $location, Authentication) {
						var email = null;
						var password = null;

						$scope.login = function (loginType) {
							console.log("login");
							Authentication.login(loginType, this.email, this.password);
						};

						$scope.logout = function () {
							console.log("logout");
							Authentication.logout();
							window.location.href = "/#/login";
							return 'logged out';
						};
					}
				])

	.controller('DashboardCtrl', function ($scope) {
					$scope.foo = {competency: {id: 42, val: 3}};
				})

	.controller('EmployeeCtrl', function ($scope, Employees, Assessments) {
					$scope.e = Employees;
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

	.controller('EmployeeDetailCtrl', function ($scope, $stateParams, Employees, Assessments) {
					$scope.employee = Employees.get($stateParams.employeeId);
					$scope.e = Employees;
					$scope.a = Assessments;
					$scope.a.all($scope.e);
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
					$scope.currentSectionIdx = 0;
					$scope.a = Assessments;
					$scope.e = Employees;
					$scope.r = Resources;

					$scope.r0 = [];
					$scope.r1 = [1];
					$scope.r2 = [1, 1];
					$scope.r3 = [1, 1, 1];
					$scope.r4 = [1, 1, 1, 1];
					$scope.r5 = [1, 1, 1, 1, 1];


					if (!Utility.empty($stateParams)) {
						var assessmentId = $stateParams.assessmentId;
						if (Utility.empty(assessmentId)) {
							assessmentId = 0;
						}
						var sectionIdx = $stateParams.sectionIdx;
						if (Utility.empty(sectionIdx)) {
							sectionIdx = 0;
						}
						var employeeId = $stateParams.employeeId;
						if (Utility.empty(sectionIdx)) {
							employeeId = 0;
						}
						$scope.employee = $scope.e.get(employeeId);
						console.log("employee:", $scope.employee);
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

