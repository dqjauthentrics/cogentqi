'use strict';

angular.module('AssessmentControllers', [])

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
				});
