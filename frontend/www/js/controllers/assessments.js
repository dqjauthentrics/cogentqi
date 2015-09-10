'use strict';

angular.module('AssessmentControllers', [])

	.controller('MatrixCtrl', function ($scope, $stateParams, Utility, Instruments, Assessments, Organizations, Members) {
					$scope.data = {
						matrix: null, instruments: [], currentInstrument: {}, currentInstrumentId: 1, responses: [], currentSectionIdx: -1
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
							Utility.getResource(Assessments.getMatrix($scope.data.currentInstrument.id, orgId, false), function (response) {
								$scope.data.matrix = response;
							});
						}
					};
					$scope.getMatrixPortion = function () {
						if ($scope.data.currentInstrument.currentSectionIdx == Instruments.SECTION_SUMMARY) {
							return $scop.data.matrix.sections;
						}
						return $scope.data.matrix;
					};
					$scope.cellClass = function (value, typeName) {
						var cClass = '';
						value = Math.round(value);
						switch (typeName) {
							case 'LIKERT':
								cClass = 'matrixCircle levelBg' + value;
								break;
							case 'YESNO':
								cClass = 'matrixCircle yesNoBg' + value;
								break;
						}
						return cClass;
					};
					$scope.resetResponses = function () {
						$scope.data.responses = null;
						$scope.data.currentSectionIdx = 0;
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
						Instruments.sectionIsAll();
					};
					$scope.isSummary = function () {
						Instruments.sectionIsSummary();
					};
				});
