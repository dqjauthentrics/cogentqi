/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('OutcomeControllers', [])

	.controller(
		'OutcomeViewCtrl',
		function ($scope, $stateParams, Utility, Instruments, Organizations, Outcomes) {
			$scope.data = {outcome: null, currentInstrument: null, instruments: null};
			$scope.Instruments = Instruments;

			Utility.getResource(Instruments.retrieve(), function (response) {
				$scope.data.instruments = response.data;
				Instruments.collate($scope.data.instruments);
				if (!Utility.empty(response)) {
					$scope.setCurrentInstrument(response);
				}
			});
			$scope.setCurrentInstrument = function (instrument) {
				if (!Utility.empty(instrument) && !Utility.empty($scope.data.instruments)) {
					$scope.data.currentInstrument = instrument;
					$scope.data.currentInstrumentId = instrument.id;
					$scope.setOutcome();
				}
			};
			$scope.setOutcome = function () {
				if (!Utility.empty($stateParams)) {
					var outcomeId = $stateParams.outcomeId;
					Utility.getResource(Outcomes.retrieveSingle(outcomeId), function (response) {
						$scope.data.outcome = response.data;
					});
				}
				//$scope.setAlignments();
			};

		})

	.controller(
		'OutcomeOrganizationCtrl',
		function ($cookieStore, $scope, $stateParams, Utility, Organizations, Resources, Outcomes) {
			$scope.Outcomes = Outcomes;
			$scope.data = {organizations: [], currentOrg: {}, parentOrg:null, levels: [], dirty: false, isLoading: true};
			$scope.user = $cookieStore.get('user');

			Utility.getResource(Outcomes.retrieveForOrg($scope.user.oi, false), function (response) {
				if (response.status == 1) {
					$scope.Outcomes.list = response.data.outcomes;
					$scope.data.organizations = response.data.orgLevels;
					if (response.data.orgLevels.length > 0) {
						$scope.data.parentOrg = response.data.orgLevels[0];
						if (response.data.orgLevels.length > 1) {
							$scope.data.organizations.shift();
						}
						$scope.setCurrentOrg(response.data.orgLevels[0]);
					}
				}
				else {
					Utility.statusAlert(response);
				}
				$scope.data.isLoading = false;
			});

			$scope.setCurrentOrg = function (organization) {
				$scope.data.currentOrg = organization;
			};
			$scope.getCurrentOrg = function (organization) {
				return $scope.data.currentOrg;
			};
			$scope.isTopOrg = function (organizationId) {
				var isTop = $scope.data.organizations.length == 0 ||
					($scope.data.organizations.length > 0 && $scope.data.organizations[0].id == organizationId);
				if ($scope.data.organizations.length > 0) {
					console.log("compare", isTop, organizationId, $scope.data.organizations[0].id);
				}
				return isTop;
			};
			$scope.isCurrent = function (organization) {
				return !Utility.empty(organization) && !Utility.empty($scope.data.currentOrg) && organization.id == $scope.data.currentOrg.id;
			};
			$scope.changed = function (outcome) {
				$scope.data.dirty = true;
			};
			$scope.save = function () {
				$scope.Outcomes.saveLevels($scope.data.currentOrg, function(response) {
					if (response.status == 1) {
						$scope.data.dirty = false;
					}
					else {
						Utility.statusAlert(response);
					}
				});
			};
		})

	.controller(
		'OutcomeListCtrl',
		function ($cookieStore, $scope, $stateParams, Utility, Organizations, Resources, Outcomes) {
			$scope.Outcomes = Outcomes;
			$scope.data = {currentOrg: {}, levels: [], dirty: false, isLoading: true};
			$scope.user = $cookieStore.get('user');

			Utility.getResource(Outcomes.retrieveForOrg($scope.user.oi, false), function (response) {
				if (response.status == 1) {
					$scope.Outcomes.list = response.data.outcomes;
					$scope.data.currentOrg = response.data.orgLevels[0];
					$scope.data.dirty = false;
				}
				else {
					Utility.statusAlert(response);
				}
				$scope.data.isLoading = false;
			});

			$scope.changed = function (outcome) {
				$scope.data.dirty = true;
			};
			$scope.save = function () {
				$scope.Outcomes.saveLevels($scope.data.currentOrg, function(response) {
					if (response.status == 1) {
						$scope.data.dirty = false;
					}
					else {
						Utility.statusAlert(response);
					}
				});
			};
		})

	.controller(
		'OutcomeAlignmentsCtrl',
		function ($cookieStore, $scope, $stateParams, Utility, Outcomes) {
			$scope.Outcomes = Outcomes;
			$scope.data = {isLoading: true, searchFilter: ''};
			$scope.user = $cookieStore.get('user');

			if (Outcomes.list == null) {
				Utility.getResource(Outcomes.retrieveForOrg($scope.user.oi, true), function (response) {
					$scope.Outcomes.list = response.data.outcomes;
					$scope.data.isLoading = false;
				});
			}
			else {
				$scope.data.isLoading = false;
			}

			$scope.outcomeFilter = function (outcome) {
				return Outcomes.filterer(outcome, $scope.data.searchFilter);
			}
		})

	.controller(
		'OutcomeAlignmentCtrl',
		function ($scope, $stateParams, $ionicPopup, Utility, Instruments, Outcomes) {
			$scope.Outcomes = Outcomes;
			$scope.res = null;
			$scope.data = {dirty: false, saving: false, alignments: [], instruments: [], currentInstrument: null, currentInstrumentId: 1};

			Utility.getResource(Instruments.retrieve(), function (response) {
				$scope.data.instruments = response.data;
				Instruments.collate($scope.data.instruments);
				if (!Utility.empty($scope.data.instruments)) {
					$scope.setCurrentInstrument($scope.data.instruments[0].id);
				}
			});
			Utility.getResource(Outcomes.retrieve(), function (response) {
				$scope.Outcomes.list = response.data;
				$scope.setOutcome();
			});

			$scope.save = function () {
				$scope.data.saving = true;
				Outcomes.saveAlignments($scope.data.currentInstrumentId, $scope.Outcomes.current.id, $scope.data.alignments,
										function (response) {
											$scope.data.saving = false;
											$scope.data.dirty = false;
											Utility.statusAlert(response);
										});
			};
			$scope.setAlignments = function () {
				if (!Utility.empty($scope.Outcomes.current) && !Utility.empty($scope.data.currentInstrument)) {
					$scope.data.alignments = {};
					for (var z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
						var questionId = $scope.data.currentInstrument.questions[z].id;
						$scope.data.alignments[questionId] = 0;
					}
					if (!Utility.empty($scope.Outcomes.current) && !Utility.empty(
							$scope.Outcomes.current.alignments) && $scope.Outcomes.current.alignments.length > 0) {
						for (var i = 0; i < $scope.Outcomes.current.alignments.length; i++) {
							var alignment = $scope.Outcomes.current.alignments[i];
							$scope.data.alignments[alignment.qi] = alignment.wt;
						}
					}
				}
			};
			$scope.setOutcome = function () {
				if (!Utility.empty($stateParams)) {
					var outcomeId = $stateParams.outcomeId;
					if (!Utility.empty(outcomeId)) {
						$scope.Outcomes.current = Utility.findObjectById($scope.Outcomes.list, outcomeId);
						$scope.setAlignments();
					}
				}
				$scope.setAlignments();
			};
			$scope.setCurrentInstrument = function (instrumentId) {
				if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
					$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
					$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
					$scope.setAlignments();
				}
			};
		})
;
