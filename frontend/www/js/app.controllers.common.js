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

	.controller('MgrMatrixCtrl', function ($scope, $stateParams, Utility, Instruments, Evaluations, Organizations, Members) {
					$scope.Instruments = Instruments;  //@todo Is this needed in views/directives?
					$scope.Members = Members; //@todo Is this needed in views/directives?
					$scope.Utility = Utility;

					$scope.data = {myOrg: {}, organizations: [], instruments: [], members: [], currentInstrument: {}, currentInstrumentId: 1};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
					});
					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Members.retrieve().query(function (response) {
						$scope.data.members = response;
					});
					Organizations.retrieve().query(function (response) {
						$scope.data.organizations = response;
					});
					Evaluations.retrieveMatrix($scope.data.currentInstrument, false).query(function (response) {
						$scope.data.matrix = response;
					});

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
						$scope.setCurrentInstrument($stateParams.instrumentId);
					}

					$scope.setCurrentInstrument = function (instrumentId) {
						console.log("set current instrument", instrumentId);
						if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
							$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
							$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
							Evaluations.retrieveMatrix($scope.data.currentInstrument.id, false).query(function (response) {
								$scope.data.matrix = response;
								Evaluations.calcMatrixAverages($scope.data.currentInstrument, $scope.data.matrix, false);
							});
						}
					};
					$scope.getColHeaderNames = function () {
						return Instruments.findMatrixResponseRowHeader($scope.data.currentInstrument, 20)
					};
					$scope.getRowValues = function (dataRow) {
						return Evaluations.findMatrixResponseRowValues($scope.data.currentInstrument, Instruments.currentSectionIdx, dataRow.responses)
					};
					$scope.findMember = function (memberId) {
						return Utility.findObjectById($scope.data.members, memberId);
					};
				})

	.controller('EvaluationCtrl', function ($scope, $timeout, $stateParams, Utility, Instruments, Evaluations, Members, Organizations, Resources) {
					var collated = false;
					$scope.Evaluations = Evaluations;
					$scope.Instruments = Instruments;
					$scope.r0 = [];
					$scope.r1 = [1];
					$scope.r2 = [1, 1];
					$scope.r3 = [1, 1, 1];
					$scope.r4 = [1, 1, 1, 1];
					$scope.r5 = [1, 1, 1, 1, 1];
					$scope.data = {
						myOrg: {},
						organizations: [],
						instruments: [],
						members: [],
						recommendations: [],
						resources: [],
						instrument: {},
						evaluation: null
					};

					/** @todo Retrieving too much data here. Retrieving current user's org should be done once at login and stored in user record.
					 *        For a single evaluation, just retrieve a single Instrument and a single member and collate against only that one.
					 */
					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						console.log("instruments retrieved", response);
						$scope.collateEvaluations();
						$scope.getEvaluation();
					});
					Members.retrieve().query(function (response) {
						$scope.data.members = response;
						console.log("members retrieved", response);
						$scope.collateEvaluations();
						$scope.getEvaluation();
					});
					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
						console.log("resources retrieved", response);
						$scope.collateEvaluations();
						$scope.getEvaluation();
					});
					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});

					$scope.collateEvaluations = function () {
						if (!collated && !Utility.empty($scope.data.evaluation) && !Utility.empty($scope.data.instruments) && !Utility.empty($scope.data.members)) {
							collated = true;
							Evaluations.collate($scope.data.instruments, $scope.data.members, $scope.data.evaluation);
							$scope.getEvaluation();
						}
					};
					$scope.hasComment = function (question) {
						return !Utility.empty(question.responseRecord) && !Utility.empty(question.responseRecord.ec) && question.responseRecord.ec.length > 0;
					};
					$scope.showComment = function (question) {
						return !Utility.empty(question.showComments) && question.showComments;
					};
					$scope.getComment = function (question) {
						if (!Utility.empty(question) && !Utility.empty(question.responseRecord)) {
							var comment = question.responseRecord.ec;
							if (!Utility.empty(comment)) {
								comment = '"' + comment + '"';
							}
							return comment;
						}
						return null;
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
					};

					$scope.getRecommendations = function () {
						if (!Utility.empty($scope.data.instrument) && !Utility.empty($scope.data.resources)) {
							$scope.data.recommendations = Evaluations.recommend($scope.data.instrument, $scope.data.resources);
						}
					};

					$scope.updateResponse = function (question, value) {
						if (!Utility.empty(question) && !Utility.empty(question.responseRecord) && !Utility.empty(value) && !Utility.empty($scope.data.resources) && !Utility.empty($scope.data.currentInstrument)) {
							question.responseRecord.ri = parseInt(value);
							$scope.getRecommendations();
						}
					};

					$scope.updateSliderResponse = function (question) {
						Evaluations.sliderChange(question, $scope.data.instrument);
						$scope.getRecommendations();
					};

					$scope.getEvaluation = function () {
						if (Utility.empty($scope.data.evaluation) && !Utility.empty($stateParams) && !Utility.empty($stateParams.evaluationId)) {
							console.log("evaluation:", $stateParams.evaluationId);
							Evaluations.retrieveSingle($stateParams.evaluationId).query(function (response) {
								console.log("evaluation retrieved:", response);
								if (!Utility.empty(response) && !Utility.empty($scope.data.instruments)) {
									$scope.data.instrument = Utility.findObjectById($scope.data.instruments, response.instrumentId);
									console.log("evaluation collation:", response);
									Evaluations.collate($scope.data.instruments, $scope.data.members, response);
								}
								$scope.data.evaluation = response; //@todo THIS ONLY UPDATES THE VIEW SOMETIMES, which references data.evaluation
								$scope.getRecommendations();
								console.log("evaluation set:", $scope.data.evaluation);
							});
						}
					};
				})

	.controller('EvaluationsCtrl', function ($scope, $stateParams, Utility, Evaluations, Members, Organizations) {
					$scope.data = {myOrg: {}, members: [], evaluations: []};

					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Members.retrieve().query(function (response) {
						$scope.data.members = response;
					});
					Evaluations.retrieve().query(function (response) {
						Evaluations.associateMembers(response, $scope.data.members);
						$scope.data.evaluations = response;
					});
				})
;