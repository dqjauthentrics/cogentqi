'use strict';

angular.module('app.controllers.administrator', [])

	.controller('AdminMatrixCtrl', function ($scope, $stateParams, Utility, Instruments, Evaluations, Organizations) {
					$scope.instruments = Instruments.retrieve();
					$scope.myOrg = Organizations.retrieveMine();
					$scope.organizations = Organizations.retrieve();
					$scope.matrix = Evaluations.getMatrixData(Instruments.currInstrumentId, true);
					$scope.currInstrument = Instruments.getCurrent();
					$scope.currInstrumentId = Instruments.currInstrumentId;

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
						Instruments.setCurrent($stateParams.instrumentId);
					}
					$scope.getInstruments = function () {
						$scope.currInstrument = Instruments.getCurrent();
						$scope.currInstrumentId = Instruments.currInstrumentId;
						return Instruments.instruments;
					};
					$scope.setCurrentInstrument = function (currInstrumentId) {
						$scope.currInstrument = Instruments.find(currInstrumentId);
						$scope.matrix = Evaluations.getMatrixData(currInstrumentId, true);
					};
					$scope.getRowValues = function () {
						return Evaluations.findMatrixOrgRowValues(Instruments.currSectionIdx);
					};
					$scope.getMatrix = function () {
						$scope.matrix = Evaluations.getMatrixData(Instruments.currInstrumentId, true);
						return $scope.matrix;
					};
				})
	.controller('AdminOutcomeCtrl', function ($scope, $stateParams, Utility, Organizations, Resources, Outcomes) {
					$scope.myOrg = Organizations.retrieveMine();
					$scope.organizations = Organizations.retrieve();
					$scope.resources = Resources.retrieve();
					$scope.currentOrgId = !Utility.empty(Organizations.currentOrg) ? Organizations.currentOrg.id : null;
					var outcomes = Outcomes.retrieve();
					$scope.orgOutcomes = Outcomes.findOrgOutcomes(Organizations.getCurrent().id);

					$scope.setCurrentOrg = function (organizationId) {
						$scope.currentOrgId = organizationId;
						Organizations.setCurrent(organizationId);
						$scope.orgOutcomes = Outcomes.findOrgOutcomes(Organizations.getCurrent().id);
					};
					$scope.currentOrg = function () {
						return Organizations.getCurrent();
					};
					$scope.methodMessage = function (method) {
						if (method == "D") {
							return "NOTE: This outcome level is calculated through examination of data; it is not recommended that you manually change it.";
						}
						return "Manually configured outcome level.";
					};
					$scope.isCurrent = function (organizationId) {
						return organizationId == $scope.currentOrgId;
					};
					$scope.getRubric = function (level) {
						var rubric = '';
						switch (parseInt(level)) {
							case 0:
								rubric = 'This outcome is not relevant, at the moment.';
								break;
							case 1:
								rubric = 'This outcome is unacceptable.  Urgent action is required.';
								break;
							case 2:
								rubric = 'The level of performance for this outcome is acceptable, but there is room for improvement.';
								break;
							case 3:
								rubric = 'This performance level is excellent.  No action is required.';
								break;
						}
						return rubric;
					};
				})
	.controller('AdminAlignmentCtrl', function ($scope, $stateParams, Utility, Instruments, Resources, Outcomes) {
					$scope.instruments = Instruments.retrieve();
					$scope.outcomes = Outcomes.retrieve();
					$scope.resources = Resources.retrieve();
					$scope.resource = null;
					$scope.outcome = null;
					$scope.questions = null;
					$scope.alignments = null;
					$scope.currInstrument = Instruments.getCurrent();
					$scope.currInstrumentId = Instruments.currInstrumentId;

					if (!Utility.empty($stateParams)) {
						var resourceId = $stateParams.resourceId;
						if (!Utility.empty(resourceId)) {
							$scope.resource = Resources.find(resourceId);
							$scope.resource.location = 'modules/' + $scope.resource.number.toLowerCase() + '.html';
							$scope.alignments = Resources.findAlignments($scope.currInstrument, resourceId);
						}
						var outcomeId = $stateParams.outcomeId;
						if (!Utility.empty(outcomeId)) {
							$scope.outcome = Outcomes.find(outcomeId);
						}
					}
					$scope.getInstrumentAlignments = function (instrument, resourceId) {
						if (!Utility.empty(instrument)) {
							Resources.retrieveAlignments(instrument, resourceId, instrument.questions);
							Instruments.setCurrent(instrument.id);
							$scope.questions = $scope.getQuestions();
						}
						return $scope.currInstrument;
					};
					$scope.setCurrentInstrument = function (currInstrumentId) {
						$scope.currInstrument = Instruments.find(currInstrumentId);
						$scope.alignments = Resources.findAlignments($scope.currInstrument, $scope.resource.id);
					};
					$scope.getQuestions = function () {
						return Instruments.currentQuestions();
					};
					$scope.getResources = function () {
						return Resources.resources;
					};
					$scope.getInstruments = function () {
						return Instruments.instruments;
					};
					$scope.getAlignments = function () {
						return $scope.alignments;
					};
				})
	.controller('AdminMemberCtrl', function ($scope, Utility, Organizations, Members, Evaluations, Resources, Outcomes) {
					$scope.myOrg = Organizations.retrieveMine();
					$scope.organizations = Organizations.retrieve();
					$scope.currentOrgId = !Utility.empty(Organizations.currentOrg) ? Organizations.currentOrg.id : null;
					$scope.members = null;
					Members.retrieve();
					$scope.Members = Members;  //@todo Currently need to pass through to memberItem tag

					Organizations.retrieveMembers(null);

					$scope.setCurrentOrg = function (organizationId) {
						$scope.currentOrgId = organizationId;
						Organizations.setCurrent(organizationId);
						Organizations.retrieveMembers(Organizations.currentOrg.id);
					};
					$scope.currentOrg = function () {
						return Organizations.getCurrent();
					};
					$scope.currentOrgMembers = function () {
						return Organizations.getCurrentMembers();
					};
					$scope.isCurrent = function (organizationId) {
						return organizationId == $scope.currentOrgId;
					};
				})
	.controller('AdminDashboardCtrl', function ($scope, Utility, Organizations, Members, Evaluations, Resources, Outcomes) {
					$scope.myOrg = Organizations.retrieveMine();
					$scope.organizations = Organizations.retrieve();
					$scope.members = Members.retrieve();
					$scope.resources = Resources.retrieve();
					$scope.outcomes = Outcomes.retrieve();
				})
	.controller('AdminSettingsCtrl', function ($scope, Settings) {
					$scope.settings = Settings.retrieve();
				});
