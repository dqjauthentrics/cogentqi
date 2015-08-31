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

	.controller('MgrMatrixCtrl', function ($scope, $stateParams, Utility, Instruments, Assessments, Organizations, Members) {
					$scope.data = {instruments: [], currentInstrument: {}, currentInstrumentId: 1, responses: []};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
					});
					$scope.setCurrentInstrument = function (instId) {
						var orgId = null;
						$scope.resetResponses();
						if (!Utility.empty($stateParams)) {
							if (!Utility.empty($stateParams.instrumentId)) {
								instId = $stateParams.instrumentId;
							}
							if (!Utility.empty($stateParams.organizationId)) {
								orgId = $stateParams.organizationId;
							}
						}
						if (!Utility.empty(instId) && !Utility.empty($scope.data.instruments)) {
							$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instId);
							$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
							Utility.getResource(Assessments.retrieveMatrix($scope.data.currentInstrument.id, orgId, false), function (response) {
								$scope.data.matrix = response;
								Assessments.calcMatrixAverages($scope.data.currentInstrument, $scope.data.matrix, false);
							});
						}
					};
					$scope.resetResponses = function () {
						$scope.data.responses = null;
					};
					$scope.getColHeaderNames = function () {
						return Instruments.findMatrixResponseRowHeader($scope.data.currentInstrument, 20)
					};
					$scope.getRowValues = function (dataRow) {
						if (Utility.empty($scope.data.responses)) {
							$scope.data.responses =
								Assessments.findMatrixResponseRowValues($scope.data.currentInstrument, Instruments.currentSectionIdx, dataRow.responses);
						}
						return $scope.data.responses;
					};
					$scope.findMember = function (memberId) {
						return Utility.findObjectById($scope.data.members, memberId);
					};
					$scope.next = function () {
						Instruments.sectionNext($scope.data.currentInstrument);
						$scope.resetResponses();
					};
					$scope.previous = function () {
						Instruments.sectionPrevious($scope.data.currentInstrument);
						$scope.resetResponses();
					};
					$scope.previousName = function () {
						return Instruments.sectionPreviousName($scope.data.currentInstrument);
					};
					$scope.nextName = function () {
						return Instruments.sectionNextName($scope.data.currentInstrument);
					};
					$scope.viewAll = function () {
						Instruments.sectionViewAll();
						$scope.resetResponses();
					};
					$scope.viewSummary = function () {
						Instruments.sectionViewSummary();
						$scope.resetResponses();
					};
					$scope.isAll = function () {
						Instruments.sectionIsAll();
					};
					$scope.isSummary = function () {
						Instruments.sectionIsSummary();
					};
				})

	.controller('AssessmentCtrl',
				function ($resource, $ionicPopup, $filter, $cookieStore, $scope, $timeout, $stateParams, PDF, Utility, Instruments, Assessments, Members,
						  Organizations, Resources) {
					$scope.Instruments = Instruments;
					$scope.res = null;
					$scope.data = {dirty: false, recommendations: [], resources: [], assessment: null, currentChoices: null};

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
							$scope.data.dirty = true;
							question.rsp.ri = parseInt(value);
							$scope.getRecommendations();
						}
					};

					$scope.updateSliderResponse = function (question) {
						$scope.data.dirty = true;
						var scoreInfo = Assessments.sliderChange(question, $scope.data.assessment.instrument);
						question.rsp.r = scoreInfo.scoreWord;
						$scope.currentChoices = question.rsp.ch;
						$scope.data.assessment.avg = scoreInfo.avg;
						$scope.data.assessment.avgRound = scoreInfo.avgRound;
						$scope.data.assessment.scoreWord = Assessments.scoreWord(question);
						$scope.getRecommendations();
					};

					$scope.rubricSet = function (question, value) {
						question.rsp.ri = value;
					};

					$scope.sliderTranslate = function (value) {
						return value;
					};

					$scope.getAssessment = function () {
						if (Utility.empty($scope.data.assessment) && !Utility.empty($stateParams)) {
							var assessmentId = !Utility.empty($stateParams.assessmentId) ? $stateParams.assessmentId : -1;
							if (assessmentId > 0) {
								$scope.res = $resource('/api/assessment/:id');
								$scope.res.get({id: assessmentId}, function (response) {
									$scope.data.assessment = response;
									$scope.data.assessor = $cookieStore.get('user');
									$scope.getRecommendations();
								});
							}
							else {
								if (!Utility.empty($stateParams.memberId)) {
									var user = $cookieStore.get('user');
									$scope.res = $resource('/api/assessment/new/:assessorId/:memberId');
									$scope.res.get({assessorId: user.id, memberId: $stateParams.memberId}, function (response) {
										$scope.data.assessment = response;
										$scope.data.assessor = $scope.data.assessment.assessor.id;
										$scope.getRecommendations();
									});
								}
							}
						}
					};

					$scope.rubricWidth = function (nChoices) {
						return 100 / nChoices;
					};

					$scope.printIt = function () {
						PDF.assessment($scope.data.assessment);
						return true;
					};

					$scope.getResponseClass = function (responseType, responseIndex) {
						return 'viewOnly ' + responseType + '_' + responseIndex;
					};

					$scope.toggleLock = function () {
						var word = ($scope.data.assessment.es == 'L' ? 'unlock' : 'lock');
						var confirmPopup = $ionicPopup.confirm({
							title: Utility.ucfirst(word) + ' Confirmation',
							template: "Are you sure you wish to " + word + " this assessment?"
						});
						confirmPopup.then(function (res) {
							if (res) {
								$scope.data.assessment.es = ($scope.data.assessment.es == 'L' ? 'A' : 'L');
								$scope.res = $resource('/api/assessment/:id');
								$scope.res.save({assessment: $scope.data.assessment});
							}
						});
					};
					$scope.save = function (event) {
						var icon = $(event.target).find("i");
						var saveClass = icon.attr("class");
						icon.attr("class", "").addClass("fa fa-spinner fa-spin");
						$scope.res = $resource('/api/assessment/:id');
						$scope.res.save({assessment: $scope.data.assessment}, function () {
							icon.attr("class", saveClass);
							$scope.data.dirty = false;
						});
					};
					$scope.remove = function () {
						$scope.res = $resource('/api/assessment/:id');
						$scope.res.delete({assessment: $scope.data.assessment});
					};
					$scope.canEdit = function () {
						return true;
					};
					$scope.canRemove = function () {
						return !Utility.empty($scope.data.assessment) && $scope.data.assessment.member.roleId != 'T' && $scope.canEdit();
					};
					$scope.canLock = function () {
						return !Utility.empty($scope.data.assessment) && $scope.data.assessment.member.roleId != 'T';
					}
				})

	.controller('AssessmentsCtrl', function ($rootScope, $scope, $stateParams, Utility, Assessments, Members, Organizations) {
					$scope.data = {members: [], assessments: []};

					Utility.getResource(Members.retrieve(), function (response) {
						$scope.data.members = response;
						Assessments.associateMembers($scope.data.assessments, $scope.data.members);
					});
					Utility.getResource(Assessments.retrieve(), function (response) {
						$scope.data.assessments = response;
					});
				})
;