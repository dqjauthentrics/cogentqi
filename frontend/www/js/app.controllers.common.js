'use strict';

angular.module('app.controllers.common', [])

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
	.controller('MgrMatrixCtrl', function ($scope, $stateParams, Utility, Instruments, Evaluations, Organizations, Members) {
					$scope.instruments = Instruments.retrieve();
					$scope.myOrg = Organizations.retrieveMine();
					$scope.organizations = Organizations.retrieve();
					$scope.currInstrument = Instruments.getCurrent();
					$scope.currInstrumentId = Instruments.currInstrumentId;

					$scope.Instruments = Instruments;
					$scope.Members = Members;

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
						Instruments.setCurrent($stateParams.instrumentId);
					}
					$scope.getInstruments = function () {
						$scope.currInstrument = Instruments.getCurrent();
						$scope.currInstrumentId = Instruments.currInstrumentId;
						return Instruments.instruments;
					};
					$scope.setCurrentInstrument = function (currInstrumentId) {
						$scope.currInstrument = Instruments.setCurrent(currInstrumentId);
						$scope.matrix = Evaluations.getMatrixData($scope.currInstrumentId, false);
					};
					$scope.getMatrix = function () {
						return Evaluations.getMatrixData(Instruments.currInstrumentId, false);
					};
					$scope.getColHeaderNames = function () {
						return Evaluations.findMatrixResponseRowHeader(Instruments.currInstrumentId, Instruments.currSectionIdx, 20)
					};
					$scope.getRowValues = function (dataRow) {
						return Evaluations.findMatrixResponseRowValues(Instruments.currSectionIdx, dataRow.responses)
					};
				})
	.controller('EvaluationCtrl', function ($scope, $stateParams, Utility, Instruments, Evaluations, Members, Organizations, Resources) {
					$scope.instruments = Instruments.retrieve();
					$scope.members = Members.retrieve();
					$scope.resources = Resources.retrieve();
					$scope.myOrg = Organizations.retrieveMine();
					$scope.currInstrument = Instruments.getCurrent();
					$scope.currInstrumentId = Instruments.currInstrumentId;
					$scope.currentEval = null;
					$scope.evaluationId = null;

					$scope.Evaluations = Evaluations;
					$scope.Instruments = Instruments;

					$scope.r0 = [];
					$scope.r1 = [1];
					$scope.r2 = [1, 1];
					$scope.r3 = [1, 1, 1];
					$scope.r4 = [1, 1, 1, 1];
					$scope.r5 = [1, 1, 1, 1, 1];

					if (!Utility.empty($stateParams)) {
						if (!Utility.empty($stateParams.evaluationId)) {
							$scope.evaluationId = $stateParams.evaluationId;
							$scope.currentEval = Evaluations.retrieveSingle($scope.evaluationId);
						}
					}
					$scope.hasComment = function (question) {
						return !Utility.empty(question.responseRecord.evaluatorComments) && question.responseRecord.evaluatorComments.length > 0;
					};
					$scope.showComment = function (question) {
						return !Utility.empty(question.showComments) && question.showComments;
					};
					$scope.getComment = function (question) {
						var comment = question.responseRecord.evaluatorComments;
						if (!Utility.empty(comment)) {
							comment = '"' + comment + '"';
						}
						return comment;
					};
					$scope.getRange = function (n) {
						switch (Math.round(n)) {
							case 1:
								return $scope.r1;
							case 2:
								return $scope.r2;
							case 3:
								return $scope.r3;
							case 4:
								return $scope.r4;
							case 5:
								return $scope.r5;
						}
						return $scope.r0;
					};
					$scope.weightGreaterThanZero = function () {
						return function (item) {
							return item.weight > 0;
						}
					};
					$scope.updateResponse = function (question, value) {
						question.responseRecord.responseIndex = value;
						Evaluations.recommend(Instruments.getCurrent(), Instruments.currSections());
					};
					$scope.getCurrentEval = function () {
						return Evaluations.currentEval;
					};
					$scope.getRecommendations = function () {
						return Evaluations.recommendations;
					};
					$scope.getSections = function () {
						return Evaluations.currentEval.sections;
					};
					$scope.ready = function () {
						var currEval = $scope.getCurrentEval();
						return !Utility.empty(currEval) && !Utility.empty(currEval.member);
					};

					$scope.getRecommendations();
				})
	.controller('EvaluationsCtrl', function ($scope, $stateParams, Utility, Evaluations, Members, Organizations) {
					$scope.evaluations = Evaluations.retrieve();
					$scope.members = Members.retrieve();
					$scope.myOrg = Organizations.retrieveMine();

					$scope.getEvaluations = function () {
						return Evaluations.retrieve();
					};
				})
;