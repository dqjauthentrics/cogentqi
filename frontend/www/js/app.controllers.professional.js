'use strict';

angular.module('app.controllers.professional', [])

	.controller('ProfDashboardCtrl', function ($cookieStore, $scope, Utility, Organizations, Members, Evaluations) {
					$scope.data = {myOrg: {}, evaluations: [], members: [], user: $cookieStore.get('user')};

					Members.retrieve().query(function (response) {
						$scope.data.members = response;
						$scope.associate("members");
					});
					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Evaluations.retrieveForMember($scope.data.user.id).query(function (response) {
						$scope.data.evaluations = response;
						$scope.associate("evals");
					});
					$scope.associate = function (lbl) {
						if (!Utility.empty($scope.data.evaluations) && !Utility.empty($scope.data.members)) {
							console.log("associate:", lbl);
							Evaluations.associateMembers($scope.data.evaluations, $scope.data.members);
						}
					};
					$scope.statusWord = function (statusId) {
						var word = 'Enrolled';
						switch (statusId) {
							case 'W':
								word = 'Withdrawn';
								break;
							case 'C':
								word = 'Completed';
								break;
							case 'R':
								word = 'Recommended';
								break;
						}
						return word;
					}
				})

	.controller('ProfHelpCtrl', function ($scope) {
				})

	.controller('ProfSettingsCtrl', function ($scope) {
					$scope.data = {myOrg: {}, settings: []};

					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Settings.retrieve().query(function (response) {
						$scope.data.settings = response;
					});
				})
;
