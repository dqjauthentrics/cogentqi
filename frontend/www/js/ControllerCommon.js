'use strict';

angular.module('ControllerCommon', [])

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

	.controller('MgrMatrixCtrl', function ($scope, $stateParams, Utility, Instruments, Assessments, Organizations, Members) {
					$scope.Instruments = Instruments;  //@todo Is this needed in views/directives?
					$scope.Members = Members; //@todo Is this needed in views/directives?
					$scope.Utility = Utility;

					$scope.data = {organizations: [], instruments: [], members: [], currentInstrument: {}, currentInstrumentId: 1};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
					});
					Members.retrieve().query(function (response) {
						$scope.data.members = response;
					});
					Organizations.retrieve().query(function (response) {
						$scope.data.organizations = response;
					});
					Assessments.retrieveMatrix($scope.data.currentInstrument, false).query(function (response) {
						$scope.data.matrix = response;
					});

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
						$scope.setCurrentInstrument($stateParams.instrumentId);
					}

					$scope.setCurrentInstrument = function (instrumentId) {
						if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
							$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
							$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
							Assessments.retrieveMatrix($scope.data.currentInstrument.id, false).query(function (response) {
								$scope.data.matrix = response;
								Assessments.calcMatrixAverages($scope.data.currentInstrument, $scope.data.matrix, false);
							});
						}
					};
					$scope.getColHeaderNames = function () {
						return Instruments.findMatrixResponseRowHeader($scope.data.currentInstrument, 20)
					};
					$scope.getRowValues = function (dataRow) {
						return Assessments.findMatrixResponseRowValues($scope.data.currentInstrument, Instruments.currentSectionIdx, dataRow.responses)
					};
					$scope.findMember = function (memberId) {
						return Utility.findObjectById($scope.data.members, memberId);
					};
				})

	.controller('assessmentCtrl',
				function ($filter, $scope, $timeout, $stateParams, PDF, Utility, Instruments, Assessments, Members, Organizations, Resources) {
					$scope.Instruments = Instruments;
					$scope.data = {recommendations: [], resources: [], assessment: null};

					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
						$scope.getAssessment();
					});

					$scope.hasComment = function (question) {
						return !Utility.empty(question.rsp) && !Utility.empty(question.rsp.ac) && question.rsp.ac.length > 0;
					};

					$scope.showComment = function (question) {
						return !Utility.empty(question.showComments) && question.showComments;
					};

					$scope.getComment = function (question) {
						if (!Utility.empty(question) && !Utility.empty(question.rsp)) {
							var comment = question.rsp.ac;
							if (!Utility.empty(comment)) {
								comment = '"' + comment + '"';
							}
							return comment;
						}
						return null;
					};

					$scope.weightGreaterThanZero = function () {
						return function (item) {
							return item.weight > 0;
						}
					};

					$scope.getRecommendations = function () {
						if (!Utility.empty($scope.data.assessment) && !Utility.empty($scope.data.resources)) {
							$scope.data.recommendations = Assessments.recommend($scope.data.assessment.instrument, $scope.data.resources);
						}
					};

					$scope.updateResponse = function (question, value) {
						if (!Utility.empty(question) && !Utility.empty(question.rsp) && !Utility.empty(value)) {
							question.rsp.ri = parseInt(value);
							$scope.getRecommendations();
						}
					};

					$scope.updateSliderResponse = function (question) {
						Assessments.sliderChange(question, $scope.data.assessment.instrument);
						$scope.getRecommendations();
					};

					$scope.sliderTranslate = function (value) {
						return Assessments.scoreWord(value);
					};

					$scope.getAssessment = function () {
						if (Utility.empty($scope.data.assessment) && !Utility.empty($stateParams) && !Utility.empty($stateParams.assessmentId)) {
							Assessments.retrieveSingle($stateParams.assessmentId).query(function (response) {
								$scope.data.assessment = response;
								$scope.getRecommendations();
							});
						}
						if (!Utility.empty($scope.data.assessment) && !Utility.empty($scope.data.assessment.member)) {
							Assessments.avgRound = $scope.data.assessment.member.lv;
						}
					};

					$scope.printIt = function () {
						PDF.assessment($scope.data.assessment);
						return true;
					};
				})

	.controller('assessmentsCtrl', function ($scope, $stateParams, Utility, Assessments, Members, Organizations) {
					$scope.data = {members: [], assessments: []};

					Members.retrieve().query(function (response) {
						$scope.data.members = response;
						Assessments.associateMembers($scope.data.assessments, $scope.data.members);
					});
					Assessments.retrieve().query(function (response) {
						$scope.data.assessments = response;
						Assessments.associateMembers($scope.data.assessments, $scope.data.members);
					});
				})
;