'use strict';

angular.module('AssessmentControllers', [])

	.controller('AssessmentListCtrl', function ($rootScope, $scope, $stateParams, Utility, Assessments, Members, Instruments) {
					$scope.data = {members: [], assessments: [], instruments: []};

					Utility.getResource(Instruments.retrieve(), function (response) {
						$scope.data.instruments = response;
						$scope.getAssessments();
					});

					$scope.getResources = function () {
						Utility.getResource(Members.retrieve(), function (response) {
							$scope.data.members = response;
							Assessments.associateMembers($scope.data.assessments, $scope.data.members);
						});
					};
					$scope.getAssessments = function () {
						Utility.getResource(Assessments.retrieve(), function (response) {
							$scope.data.assessments = response;
						});
					};
					$scope.assessmentName = function (instrumentId) {
						var instrument = null;
						if (!Utility.empty($scope.data.instruments)) {
							for (var i = 0; i < $scope.data.instruments.length; i++) {
								if ($scope.data.instruments[i].id == instrumentId) {
									return $scope.data.instruments[i].name;
								}
							}
						}
						return instrument;
					};
				})

	.controller('AssessmentMatrixCtrl', function ($scope, $stateParams, Utility, Instruments, Assessments) {
					$scope.data = {
						matrix: null, instruments: [], currentInstrument: {}, currentInstrumentId: null, currentSectionIdx: Instruments.SECTION_SUMMARY
					};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
					});
					$scope.setCurrentInstrument = function (instId) {
						var orgId = null;
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
							Utility.getResource(Assessments.retrieveNewMatrix($scope.data.currentInstrument.id, orgId, false), function (response) {
								$scope.data.matrix = response[0];
								Instruments.currentSectionIdx = Instruments.SECTION_SUMMARY;
								$scope.data.currentSectionIdx = Instruments.SECTION_SUMMARY;
							});
						}
					};
					$scope.getScoreClass = function (response) {
						var cellType = response[0];
						var value = Math.round(response[1]);
						var responseType = response[2];
						var section = response[3];
						var cClass = '';
						switch (responseType) {
							case 'L': // LIKERT
								cClass = 'matrixCircle levelBg' + value;
								break;
							case 'Y': // YESNO
								cClass = 'matrixCircle yesNoBg' + value;
								break;
						}
						return cClass;
					};
					$scope.getCellClass = function (response) {
						var cClass = ' type' + response[0];
						cClass += ' section' + response[3];
						return cClass;
					};
					$scope.show = function (response) {
						if (response && response !== undefined) {
							if ($scope.data.currentSectionIdx == Instruments.SECTION_SUMMARY) {
								return response[0] == 'S' || response[0] == 'CS';
							}
							else {
								return $scope.data.currentSectionIdx < 0 || $scope.data.currentSectionIdx == response[3];
							}
						}
						return true;
					};
					$scope.next = function () {
						$scope.data.currentSectionIdx = Instruments.sectionNext($scope.data.currentInstrument);
					};
					$scope.previous = function () {
						$scope.data.currentSectionIdx = Instruments.sectionPrevious($scope.data.currentInstrument);
					};
					$scope.previousName = function () {
						return Instruments.sectionPreviousName($scope.data.currentInstrument);
					};
					$scope.nextName = function () {
						return Instruments.sectionNextName($scope.data.currentInstrument);
					};
					$scope.viewAll = function () {
						$scope.data.currentSectionIdx = Instruments.sectionViewAll();
					};
					$scope.viewSummary = function () {
						$scope.data.currentSectionIdx = Instruments.sectionViewSummary();
					};
					$scope.isAll = function () {
						return Instruments.sectionIsAll();
					};
					$scope.isSummary = function () {
						return Instruments.sectionIsSummary();
					};
				})

	.controller('AssessmentViewCtrl',
				function ($resource, $ionicPopup, $filter, $cookieStore, $scope, $timeout, $stateParams, PDF, Utility,
						  Instruments, Assessments, Members, Organizations, Resources) {
					$scope.Instruments = Instruments;
					$scope.res = null;
					$scope.data = {dirty: false, recommendations: [], resources: [], assessment: null, currentChoices: null};

					Utility.getResource(Resources.retrieve(), function (response) {
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
						console.log("scoreInfo:", scoreInfo);
						question.rsp.r = scoreInfo.scoreWord;
						$scope.currentChoices = question.rsp.ch;
						$scope.data.assessment.sc = scoreInfo.avg;
						$scope.data.assessment.rk = scoreInfo.avgRound;
						$scope.data.assessment.scoreWord = Assessments.scoreWord(question, scoreInfo.avgRound);
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
								Utility.getResource(Assessments.retrieveSingle(assessmentId), function (response) {
									Instruments.currentSectionIdx = 0;
									$scope.data.assessment = response;
									var scoreInfo = Assessments.scorify($scope.data.assessment.instrument);
									var question = $scope.data.assessment.instrument.sections[0].questions[0];
									console.log("initial:", $scope.data.assessment);
									$scope.data.assessment.sc = scoreInfo.avg;
									$scope.data.assessment.rk = scoreInfo.avgRound;
									$scope.data.assessment.scoreWord = Assessments.scoreWord(question, scoreInfo.avgRound);
									$scope.data.assessor = $cookieStore.get('user');
									$scope.getRecommendations();
								});
							}
							else {
								if (!Utility.empty($stateParams.memberId)) {
									var user = $cookieStore.get('user');
									$scope.res = $resource('/api/assessment/new/:assessorId/:memberId');
									$scope.res.get({assessorId: user.id, memberId: $stateParams.memberId}, function (response) {
										Instruments.currentSectionIdx = 0;
										$scope.data.assessment = response;
										$scope.data.assessor = $scope.data.assessment.assessor.id;
										$scope.getRecommendations();
									});
								}
							}
						}
					};

					$scope.rubricWidth = function (nChoices) {
						return 100 / (parseInt(nChoices) + 1);
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
;
