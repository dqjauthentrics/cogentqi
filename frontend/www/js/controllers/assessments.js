/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('AssessmentControllers', [])

	.controller(
		'AssessmentListCtrl',
		function ($rootScope, $scope, $stateParams, Utility, Assessments, Members) {
			$scope.Assessments = Assessments;
			$scope.data = {isLoading: true, searchFilter: null};

			console.log("enter AssessmentListCtrl");
			if ($scope.Assessments.list == null) {
				Utility.getResource(Assessments.retrieve(), function (response) {
					$scope.Assessments.list = response.data;
					$scope.data.isLoading = false;
				});
			}
			else {
				$scope.data.isLoading = false;
			}

			$scope.assessmentFilter = function (assessment) {
				return Members.filterer(assessment.member, $scope.data.searchFilter) ||
					Members.filterer(assessment.assessor, $scope.data.searchFilter)
					;
			};
		})

	.controller(
		'AssessmentMatrixCtrl',
		function ($scope, $stateParams, Utility, Instruments, Assessments) {
			$scope.data = {
				matrix: null, instruments: [], currentInstrument: {}, currentInstrumentId: null, currentSectionIdx: Instruments.SECTION_SUMMARY
			};

			Instruments.retrieve().query(function (response) {
				$scope.data.instruments = response.data;
				Instruments.collate($scope.data.instruments);
				if (!Utility.empty(response)) {
					$scope.setCurrentInstrument(response.data[0].id);
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
					Utility.getResource(Assessments.retrieveMatrix($scope.data.currentInstrument.id, orgId, false), function (response) {
						$scope.data.matrix = response.data[0];
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
				return false;
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

	.controller(
		'AssessmentViewCtrl',
		function ($rootScope, $resource, $ionicPopup, $filter, $cookieStore, $scope, $timeout, $stateParams, PDF, Utility,
				  Instruments, Assessments, Members, Organizations, Resources) {

			console.log("entering AssessmentViewCtrl");

			$scope.Assessments = Assessments;
			$scope.Instruments = Instruments;
			$scope.Resources = Resources;
			$scope.res = null;
			$scope.data = {
				dirty: false,
				isLoading: true,
				recommendations: [],
				resources: [],
				currentChoices: null,
				recommendationsTitle: 'Recommended Modules'
			};


			$scope.response = function (questionId) {
				if (!Utility.empty(Assessments.current)) {
					return Assessments.current.responses[questionId];
				}
				return null;
			};
			$scope.hasComment = function (question) {
				return !Utility.empty($scope.response(question.id)) && !Utility.empty($scope.response(question.id).ac) && $scope.response(
						question.id).ac.length > 0;
			};

			$scope.showComment = function (question) {
				return !Utility.empty(question.showComments) && question.showComments;
			};

			$scope.getComment = function (question) {
				if (!Utility.empty(question) && !Utility.empty($scope.response(question.id))) {
					var comment = $scope.response(question.id).ac;
					if (!Utility.empty(comment)) {
						comment = '"' + comment + '"';
					}
					return comment;
				}
				return null;
			};

			$scope.weightGreaterThanZero = function () {
				return function (item) {
					return item.wt > 0;
				}
			};

			$scope.getRecommendations = function () {
				if ($scope.Assessments.current !== null && $scope.Resources.list !== null) {
					$scope.data.recommendations = Assessments.recommend($scope.Assessments.current.instrument, $scope.Resources.list, $scope.Assessments.current.responses);
				}
			};

			$scope.updateResponse = function (question, value) {
				if (!Utility.empty(question) && !Utility.empty($scope.response(question.id)) && !Utility.empty(value)) {
					$scope.data.dirty = true;
					$scope.response(question.id).rdx = parseInt(value);
					$scope.getRecommendations();
				}
			};

			$scope.updateSliderResponse = function (question) {
				$scope.data.dirty = true;
				var scoreInfo = Assessments.sliderChange(question, $scope.Assessments.current.instrument, $scope.Assessments.current.responses);
				$scope.response(question.id).rp = scoreInfo.scoreWord;
				$scope.currentChoices = $scope.response(question.id).ch;
				$scope.Assessments.current.sc = scoreInfo.avg;
				$scope.Assessments.current.rk = scoreInfo.avgRound;
				$scope.Assessments.current.scoreWord = Assessments.scoreWord(question, scoreInfo.avgRound, $scope.Assessments.current.responses);
				$scope.getRecommendations();
			};

			$scope.rubricSet = function (question, value) {
				$scope.response(question.id).rdx = value;
			};

			$scope.sliderTranslate = function (value) {
				return value;
			};

			$scope.getAssessment = function () {
				try {
					if (!Utility.empty($stateParams)) {
						var assessmentId = !Utility.empty($stateParams.assessmentId) ? $stateParams.assessmentId : 0;
						if ($scope.Assessments.current === null || $scope.Assessments.current.id != assessmentId) {
							if (assessmentId > 0) {
								if (!$scope.Assessments.current || $scope.Assessments.current.id != assessmentId) {
									Utility.getResource(Assessments.retrieveSingle(assessmentId), function (response) {
										Instruments.currentSectionIdx = 0;
										$scope.Assessments.current = response.data;
										var instrumentId = $scope.Assessments.current.instrument.id;
										$scope.Assessments.current.instrument = Utility.findObjectById($scope.Instruments.list, instrumentId);
										var scoreInfo = Assessments.scorify($scope.Assessments.current.instrument, $scope.Assessments.current.responses);
										var question = $scope.Assessments.current.instrument.sections[0].questions[0];
										$scope.Assessments.current.sc = scoreInfo.avg;
										$scope.Assessments.current.rk = scoreInfo.avgRound;
										$scope.Assessments.current.scoreWord = Assessments.scoreWord(question, scoreInfo.avgRound, $scope.Assessments.current.responses);
										$scope.data.assessor = $cookieStore.get('user');
										$scope.getRecommendations();
										$scope.data.isLoading = false;
									});
								}
							}
							else if (assessmentId == -1) {
								if (!Utility.empty($stateParams.memberId)) {
									Utility.getResource(Assessments.create($stateParams.memberId), function (response) {
										$scope.Instruments.currentSectionIdx = 0;
										$scope.Members.list = null; // force reload of members list
										Members.current = null; // force reload of current member
										$scope.Assessments.current = response.data;
										$scope.data.assessor = $scope.Assessments.current.assessor.id;
										$scope.getRecommendations();
										$scope.data.isLoading = false;
									});
								}
							}
						}
						else {
							$scope.data.isLoading = false;
						}
					}
				}
				catch (exception) {
					console.log("EXCEPTION:", exception);
				}
			};

			$scope.rubricWidth = function (nChoices) {
				return 100 / (parseInt(nChoices) + 1);
			};

			$scope.printIt = function () {
				PDF.assessment($scope.Assessments.current);
				return true;
			};

			$scope.getResponseClass = function (responseType, responseIndex) {
				return 'viewOnly ' + responseType + '_' + responseIndex;
			};

			$scope.toggleLock = function () {
				var word = ($scope.Assessments.current.es == 'L' ? 'unlock' : 'lock');
				var confirmPopup = $ionicPopup.confirm({
														   title: Utility.ucfirst(word) + ' Confirmation',
														   template: "Are you sure you wish to " + word + " this assessment?"
													   });
				confirmPopup.then(function (res) {
					if (res) {
						var newState = ($scope.Assessments.current.es == 'L' ? 'A' : 'L');
						var assessmentId = $scope.Assessments.current.id;
						Utility.getResource(Assessments.lock(assessmentId, newState), function (response) {
							$scope.Assessments.current.es = response.data.es;
						});
					}
				});
			};
			$scope.save = function (event) {
				var icon = $(event.target).find("i");
				var saveClass = icon.attr("class");
				icon.attr("class", "").addClass("fa fa-spinner fa-spin");
				Assessments.save($scope.Assessments.current, $scope.Assessments.current.mi, function (response) {
					icon.attr("class", saveClass);
					$scope.data.dirty = false;
					$scope.Assessments.list = null;
				});
			};
			$scope.canEdit = function () {
				return !$rootScope.isProfessional();
			};
			$scope.canRemove = function () {
				return !Utility.empty($scope.Assessments.current) && !$rootScope.isProfessional() && $scope.canEdit();
			};
			$scope.canLock = function () {
				return !Utility.empty($scope.Assessments.current) && !$rootScope.isProfessional();
			};


			// Main
			$scope.Instruments.getCollated(function (instruments) {
				if ($scope.Resources.list === null) {
					Utility.getResource(Resources.retrieve(), function (response) {
						$scope.Resources.list = response.data;
						$scope.getAssessment();
					});
				}
				else {
					$scope.getAssessment();
				}
			});
		})
;
