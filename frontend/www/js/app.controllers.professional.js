'use strict';

angular.module('app.controllers.professional', [])

	.controller('ProfDashboardCtrl', function ($cookieStore, $rootScope, $scope, Utility, Organizations, Members, Evaluations, Plans) {
					$scope.data = {evaluations: [], members: [], planItems: [], user: $cookieStore.get('user')};

					Members.retrieve().query(function (response) {
						$scope.data.members = response;
						$scope.associate("members");
					});
					Plans.retrieve($scope.data.user.id).query(function (response) {
						$scope.data.planItems = response;
					});
					Evaluations.retrieveForMember($scope.data.user.id).query(function (response) {
						$scope.data.evaluations = response;
						$scope.associate("evals");
					});
					$scope.associate = function (lbl) {
						if (!Utility.empty($scope.data.evaluations) && !Utility.empty($scope.data.members)) {
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

	.controller('ProfSettingsCtrl', function ($scope, Utility, Organizations, Settings, Camera) {
					$scope.data = {settings: []};

					Settings.retrieve().query(function (response) {
						$scope.data.settings = response;
					});
					$scope.getPhoto = function () {
						Camera.getPicture().then(function (imageURI) {
							console.log(imageURI);
						}, function (err) {
							console.err(err);
						});
					};
				})
;
