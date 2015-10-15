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
														   Authentication.login2($scope.data.email, $scope.data.password);
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
					$scope.data = {matrix: null, instruments: [], currentInstrument: {}, currentInstrumentId: 1, responses: []};

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
					$scope.getMatrixPortion = function () {
						if ($scope.data.currentInstrument.currentSectionIdx == Instruments.SECTION_SUMMARY) {
							return $scop.data.matrix.sections;
						}
						return $scope.data.matrix;
					};
					$scope.getCellClass = function (value, typeName) {
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
					};
					$scope.inSection = function (idx) {
						return Instruments.inSection($scope.data.currentInstrument, idx);
					};
					$scope.getColHeaderNames = function () {
						return Instruments.findMatrixResponseRowHeader($scope.data.currentInstrument, 20)
					};
					$scope.getRowValues = function (idx, dataRow) {
						idx = parseInt(idx);
						if ($.inArray(idx, $scope.data.responses) < 0) {
							$scope.data.responses[idx] =
								Assessments.findMatrixResponseRowValues($scope.data.currentInstrument, Instruments.currentSectionIdx, dataRow.responses);
						}
						return $scope.data.responses[idx];
					};
					$scope.findMember = function (memberId) {
						return Utility.findObjectById($scope.data.members, memberId);
					};
					$scope.next = function () {
						Instruments.sectionNext($scope.data.currentInstrument);
						//$scope.resetResponses();
					};
					$scope.previous = function () {
						Instruments.sectionPrevious($scope.data.currentInstrument);
						//$scope.resetResponses();
					};
					$scope.previousName = function () {
						return Instruments.sectionPreviousName($scope.data.currentInstrument);
					};
					$scope.nextName = function () {
						return Instruments.sectionNextName($scope.data.currentInstrument);
					};
					$scope.viewAll = function () {
						Instruments.sectionViewAll();
						//$scope.resetResponses();
					};
					$scope.viewSummary = function () {
						Instruments.sectionViewSummary();
						//$scope.resetResponses();
					};
					$scope.isAll = function () {
						Instruments.sectionIsAll();
					};
					$scope.isSummary = function () {
						Instruments.sectionIsSummary();
					};
				})

;