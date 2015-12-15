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
			$scope.data = {isLoading: true, searchFilter: null, dCnt: 0};

			$scope.assessmentFilter = function (assessment) {
				return Members.filterer(assessment.member, $scope.data.searchFilter) ||
					Members.filterer(assessment.assessor, $scope.data.searchFilter)
					;
			};

			// Main
			//
			$scope.data.dCnt++;
			if ($scope.Assessments.list == null) {
				Utility.getResource(Assessments.retrieve(), function (response) {
					$scope.Assessments.list = response.data;
					$scope.data.isLoading = false;
				});
			}
			else {
				$scope.data.isLoading = false;
			}
		})

	.controller(
		'AssessmentMatrixCtrl',
		function ($rootScope, $cookieStore, $scope, $stateParams, Utility, Instruments, Assessments) {
			$scope.Instruments = Instruments;
			$scope.Assessments = Assessments;

			$scope.setMatrix = function (instrumentId, organizationId) {
				if (Utility.empty(instrumentId) && !Utility.empty($stateParams)) {
					if (!Utility.empty($stateParams.instrumentId)) {
						instrumentId = $stateParams.instrumentId;
					}
				}
				if (Utility.empty(organizationId) && !Utility.empty($stateParams)) {
					if (!Utility.empty($stateParams.organizationId)) {
						organizationId = $stateParams.organizationId;
					}
				}
				if (Utility.empty(organizationId)) {
					var user = $cookieStore.get('user');
					organizationId = user.oi;
				}
				if (Utility.empty(instrumentId) && !Utility.empty($scope.Instruments.list)) {
					instrumentId = $scope.Instruments.current.id;
				}
				if (!Utility.empty(instrumentId) && !Utility.empty(organizationId) && !Utility.empty($scope.Instruments.list)) {
					$scope.Instruments.current = Utility.findObjectById($scope.Instruments.list, instrumentId);
					$scope.Assessments.retrieveMatrix($scope.Instruments.current.id, organizationId, false);
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
					if ($scope.Instruments.currentSectionIdx == Instruments.SECTION_SUMMARY) {
						return response[0] == 'S' || response[0] == 'CS';
					}
					else {
						return $scope.Instruments.currentSectionIdx < 0 || $scope.Instruments.currentSectionIdx == response[3];
					}
				}
				return false;
			};

			// Main
			//
			Instruments.getCollated(function () {
				$scope.setMatrix(null, null);
			});
		}
	)

	.controller(
		'AssessmentViewCtrl',
		function ($rootScope, $resource, $ionicPopup, $filter, $cookieStore, $scope, $timeout, $stateParams, PDF, Utility,
				  Instruments, Assessments, Members, Organizations, Resources) {

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
			$scope.responses = [];

			$scope.response = function (questionId) {
				if (!Utility.empty($scope.responses)) {
					return $scope.responses[questionId];
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
					$scope.data.recommendations =
						Assessments.recommend($scope.Assessments.current.instrument, $scope.Resources.list, $scope.responses);
				}
			};

			$scope.updateResponse = function (question, value) {
				if (!Utility.empty(question) && !Utility.empty($scope.response(question.id)) && !Utility.empty(value)) {
					$scope.data.dirty = true;
					$scope.response(question.id).rdx = parseInt(value);
					$scope.getRecommendations();
				}
			};
			$scope.sliderChange = function (questionId) {
				var scoreInfo = Assessments.sliderChange(questionId, $scope.Assessments.current.instrument, $scope.responses);
				$scope.responses[questionId].rp = scoreInfo.scoreWord;
				$scope.currentChoices = $scope.responses[questionId].ch;
				$scope.Assessments.current.sc = scoreInfo.avg;
				$scope.Assessments.current.rk = scoreInfo.avgRound;
				$scope.Assessments.current.scoreWord = Assessments.scoreWord(questionId, scoreInfo.avgRound, $scope.responses);
				$scope.getRecommendations();
			};

			$scope.updateSliderResponse = function (question) {
				$scope.data.dirty = true;
				if (!Utility.empty(question)) {
					var scoreInfo = Assessments.sliderChange(questionId, $scope.Assessments.current.instrument, $scope.responses);
					$scope.responses[question.id].rp = scoreInfo.scoreWord;
					$scope.currentChoices = $scope.response(question.id).ch;
					$scope.Assessments.current.sc = scoreInfo.avg;
					$scope.Assessments.current.rk = scoreInfo.avgRound;
					$scope.Assessments.current.scoreWord = Assessments.scoreWord(question.id, scoreInfo.avgRound, $scope.responses);
					$scope.getRecommendations();
				}
			};

			$scope.refreshSliders = function () {
				$timeout(function () {
					$scope.$broadcast('rzSliderForceRender');
				});
			};
			$scope.rubricSet = function (question, value) {
				$scope.responses[question.id].rdx = value;
				$scope.refreshSliders();
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
										$scope.responses = $scope.Assessments.current.responses;
										var instrumentId = $scope.Assessments.current.instrument.id;
										$scope.Assessments.current.instrument = Utility.findObjectById($scope.Instruments.list, instrumentId);
										var scoreInfo = Assessments.scorify($scope.Assessments.current.instrument, $scope.responses);
										var question = $scope.Assessments.current.instrument.sections[0].questions[0];
										$scope.Assessments.current.sc = scoreInfo.avg;
										$scope.Assessments.current.rk = scoreInfo.avgRound;
										$scope.Assessments.current.scoreWord = Assessments.scoreWord(question.id, scoreInfo.avgRound, $scope.responses);
										$scope.data.assessor = $cookieStore.get('user');
										$scope.getRecommendations();
										$scope.data.isLoading = false;
										$scope.refreshSliders();
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
			//
			$scope.Instruments.getCollated(function (instruments) {
				$scope.Resources.loadAll(function (resources) {
					$scope.getAssessment();
					$scope.refreshSliders();
				});
			});
		})
;
