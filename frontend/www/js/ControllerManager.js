'use strict';

angular.module('ControllerManager', [])

	.controller('DashboardCtrl', function ($scope, $cookieStore, Organizations) {
					$scope.data = {user: $cookieStore.get('user'), role: 'manager'};
				})

	.controller('MemberNotesCtrl', function ($scope, $location, $ionicPopup, $stateParams, Utility, MemberNotes, Members) {
					$scope.data = {member: {}, notes: []};

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
						Utility.getResource(Members.retrieveSingle($stateParams.memberId), function (response) {
							$scope.data.member = response;
							Utility.getResource(MemberNotes.retrieve($stateParams.memberId), function (response) {
								$scope.data.notes = response;
							});
						});
					}
					$scope.goToProgress = function () {
						console.log("going to progress");
						$location.url("/manager/member/progress/" + $stateParams.memberId);
					};
					$scope.goToMember = function () {
						console.log("going to member");
						$location.url("/manager/member/" + $stateParams.memberId);
					};
				})

	.controller('MemberBarProgressCtrl',
				function ($scope, $ionicPopup, $location, $ionicLoading, $stateParams, Utility, Icons, Instruments, Organizations, Members) {
					$scope.data = {instruments: [], member: {}, instrument: null};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						$scope.setRptConfigHx();
					});

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
						Members.retrieveSingle($stateParams.memberId).query(function (response) {
							response.roleName = Members.roleName(response);
							$scope.data.member = response;
							$scope.setRptConfigHx();
						});
					}
					$scope.setRptConfigHx = function () {
						if (!Utility.empty($scope.data.member) && Utility.empty($scope.data.member.rptConfigHx) && !Utility.empty($scope.data.instruments)) {
							Instruments.collate($scope.data.instruments);
							$scope.data.instrument = Utility.findObjectById($scope.data.instruments, $scope.data.member.assessments[0].ii);
							$scope.data.member.rptConfigHx = Members.rptConfigHx($scope.data.instruments, $scope.data.member, $scope.data.member.assessments);
							//$ionicLoading.hide();
						}
					};
					$scope.getRptConfigHx = function () {
						return $scope.data.member.rptConfigHx;
					};
					$scope.goToProgress = function () {
						console.log("going to progress");
						$location.url("/manager/member/progress/" + $stateParams.memberId);
					};
					$scope.goToNotes = function () {
						$location.url("/manager/member/notes/" + $stateParams.memberId);
					};
					$scope.goToMember = function () {
						$location.url("/manager/member/" + $stateParams.memberId);
					};
				})

	.controller('MemberCtrl',
				function ($rootScope, $scope, $filter, $cookieStore, $ionicPopup, $location, $ionicLoading, $stateParams, Utility, Icons, Instruments,
						  Organizations, Members) {
					$scope.data = {dirty: false, member: {}, user: $cookieStore.get('user')};
					$scope.roles = $rootScope.roles;

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
						Utility.getResource(Members.retrieveSingle($stateParams.memberId), function (response) {
							$scope.data.member = response;
						});
					}
					$scope.goToBarProgress = function () {
						console.log("going to progress");
						$location.url("/manager/member/barProgress/" + $stateParams.memberId);
					};
					$scope.goToProgress = function () {
						$location.url("/manager/member/progress/" + $stateParams.memberId);
					};
					$scope.goToNotes = function () {
						$location.url("/manager/member/notes/" + $stateParams.memberId);
					};
					$scope.canEdit = function () {
						return $scope.data.user.roleId == 'M' || $scope.data.user.roleId == 'A';
					};
					$scope.save = function () {
						Members.saveProfile($scope.data.member, Utility.statusAlert);
						$scope.data.dirty = false;
					};
					$scope.setDirty = function () {
						console.log("dirty");
						$scope.data.dirty = true;
					};
					$scope.isDirty = function () {
						return $scope.data.dirty;
					};
					$scope.showRole = function () {
						var selected = $filter('filter')($scope.roles, {id: $scope.data.member.roleId});
						return ($scope.data.member.roleId && !Utility.empty(selected)) ? selected[0].n : 'Not set';
					};
				})

	.controller('MemberProgressCtrl', function ($scope, $stateParams, Utility, Instruments, Organizations, Assessments) {
					$scope.data = {
						chart: null,
						currentSeries: 0,
						instruments: [], organizations: [], currentInstrumentId: 1, currentInstrument: null,
						rptConfig: {
							chart: {type: 'line'},
							title: {text: 'Competency Progress Analysis', x: -20},
							subtitle: {text: 'Evaluation', x: -20},
							tooltip: {
								formatter: function () {
									return 'HERE';
								}
							},
							xAxis: {categories: []},
							yAxis: [
								{min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
								{min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
							],
							legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
							plotOptions: {line: {dataLabels: {enabled: true}}},
							exporting: {enabled: true},
							series: [],
							func: function (chart) {
								$scope.data.chart = chart;
							}
						},
						rptConfig0: {
							chart: {type: 'line'},
							title: {text: 'Competency Progress Analysis', x: -20},
							subtitle: {text: 'Evaluation', x: -20},
							tooltip: {
								formatter: function () {
									return 'HERE';
								}
							},
							xAxis: {categories: []},
							yAxis: [
								{min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
								{min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
							],
							legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
							plotOptions: {line: {dataLabels: {enabled: true}}},
							exporting: {enabled: true},
							series: [],
							func: function (chart) {
								$scope.data.chart = chart;
							}
						},
						rptConfig1: {
							chart: {type: 'line'},
							title: {text: 'Competency Progress Analysis', x: -20},
							subtitle: {text: 'Evaluation', x: -20},
							tooltip: {
								formatter: function () {
									return 'HERE';
								}
							},
							xAxis: {categories: []},
							yAxis: [
								{min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
								{min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
							],
							legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
							plotOptions: {line: {dataLabels: {enabled: true}}},
							exporting: {enabled: true},
							series: [],
							func: function (chart) {
								$scope.data.chart = chart;
							}
						}
					};

					Utility.getResource(Instruments.retrieve(), function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
					});
					Utility.getResource(Organizations.retrieve(), function (response) {
						$scope.data.organizations = response;
					});

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
						$scope.setCurrentInstrument($stateParams.instrumentId);
					}

					$scope.setCurrentInstrument = function (instrumentId) {
						if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments) && !Utility.empty($stateParams.memberId)) {
							$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
							$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
							Utility.getResource(Assessments.retrieveIndividualProgressByMonth($stateParams.memberId), function (response) {
								for (var i = 0; i < response.series.length; i++) {
									if (response.series[i].grouping == 0 || response.series[i].grouping == 2) {
										$scope.data.rptConfig0.series.push(response.series[i]);
										$scope.data.rptConfig.series.push(response.series[i]);
									}
									if (response.series[i].grouping == 1 || response.series[i].grouping == 2) {
										response.series[i].visible = true;
										$scope.data.rptConfig1.series.push(response.series[i]);
									}
								}
								$scope.data.rptConfig.xAxis.categories = response.labels;
								$scope.data.rptConfig0.xAxis.categories = response.labels;
								$scope.data.rptConfig1.xAxis.categories = response.labels;
							});
						}
					};
					$scope.goToBarProgress = function () {
						console.log("going to progress");
						$location.url("/manager/member/barProgress/" + $stateParams.memberId);
					};
					$scope.toggleProgress = function () {
						if ($scope.data.currentSeries == 0) {
							$scope.data.rptConfig = $scope.data.rptConfig1;
							$scope.data.currentSeries = 1;
						}
						else {
							$scope.data.rptConfig = $scope.data.rptConfig0;
							$scope.data.currentSeries = 0;
						}
					};

				})

	.controller('MembersCtrl', function ($scope, $ionicPopup, $location, $ionicLoading, $stateParams, Utility, Icons, Instruments, Organizations, Members) {
					$scope.data = {organizations: [], instruments: [], member: {}, assessments: [], instrument: null};

					Utility.getResource(Instruments.retrieve(), function (response) {
						$scope.data.instruments = response;
					});
					Utility.getResource(Members.retrieve(), function (response) {
						$scope.data.members = response;
					});
				})

	.controller('OutcomeCtrl', function ($scope, Utility, Instruments, Organizations, Outcomes) {
					$scope.data = {learningModules: []};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
					});
					Outcomes.retrieve(true).query(function (response) {
						$scope.data.outcomes = response;
					});
					$scope.findQuestionName = function (questionId) {
						if (!Utility.empty($scope.data.instruments) && !Utility.empty(questionId)) {
							var question = Instruments.findQuestion($scope.data.instruments, questionId);
							if (!Utility.empty(question)) {
								return question.name;
							}
						}
						return null;
					};
					$scope.methodMessage = function (method) {
						if (method == "D") {
							return "NOTE: This outcome level is calculated through examination of data; it is not recommended that you manually change it.";
						}
						return "Manually configured outcome level.";
					};
				})

	.controller('ResourceCtrl', function ($rootScope, $scope, $stateParams, Utility, LearningModules, Organizations, Resources, Quizzes) {
					$scope.data = {learningModules: [], resources: [], resource: {}};
					$scope.playerVars = {controls: 2, autoplay: 0, modestbranding: 1, rel: 0, theme: 'light'};

					LearningModules.retrieve().query(function (response) {
						$scope.data.learningModules = response;
					});
					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
						if (!Utility.empty($stateParams)) {
							var resourceId = $stateParams.resourceId;
							if (!Utility.empty(resourceId)) {
								$scope.data.resource = Utility.findObjectById($scope.data.resources, resourceId);
								if (!Utility.empty($scope.data.resource)) {
									var urlBase = $rootScope.siteDir();
									$scope.data.resource.location = urlBase + '/modules/' + $scope.data.resource.number.toLowerCase() + '.html';
								}
							}
						}
					});
				})

	.controller('PlanningCtrl', function ($scope, $stateParams, Utility, Organizations, LearningModules, Resources) {
					var collated = false;
					$scope.data = {learningModules: [], resources: [], resource: {}};

					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
						$scope.collate();
					});
					LearningModules.retrieve().query(function (response) {
						$scope.data.learningModules = response;
						$scope.collate();
					});
					$scope.collate = function () {
						if (!collated && !Utility.empty($scope.data.learningModules) && !Utility.empty($scope.data.resources)) {
							collated = true;
							for (var i = 0; i < $scope.data.learningModules.length; i++) {
								$scope.data.learningModules[i].resource =
									Utility.findObjectById($scope.data.resources, $scope.data.learningModules[i].resourceId);
							}
						}
					};
				})

	.controller('MgrSettingsCtrl', function ($scope, Utility, Organizations, Settings) {
					$scope.data = {settings: []};
					var _video = null, patData = null;

					$scope.webcamReady = false;
					$scope.shotReady = false;
					$scope.patOpts = {x: 0, y: 0, w: 25, h: 25};
					$scope.webcamChannel = {};
					$scope.webcamError = false;

					Settings.retrieve().query(function (response) {
						$scope.data.settings = response;
					});
					$scope.webcamChannel = {
						// the fields below are all optional
						videoHeight: 280,
						videoWidth: 280,
						video: null // Will reference the video element on success
					};
					$scope.webcamError = function (err) {
						$scope.$apply(
							function () {
								$scope.webcamError = err;
							}
						);
					};
					$scope.webcamStream = function (stream) {
						console.log(stream);
					};
					$scope.getCamButtonText = function () {
						return $scope.webcamReady ? 'Say Cheese and Take Snapshot!' : 'Allow Browser to Take Pictures (above)'
					};
					$scope.webcamSuccess = function () {
						// The video element contains the captured camera data
						_video = $scope.webcamChannel.video;
						$scope.$apply(function () {
							$scope.patOpts.w = _video.width;
							$scope.patOpts.h = _video.height;
							$scope.webcamReady = true;
						});
					};
					/**
					 * Make a snapshot of the camera data and show it in another canvas.
					 */
					$scope.makeSnapshot = function makeSnapshot() {
						if (_video) {
							var patCanvas = document.querySelector('#snapshot');
							if (!patCanvas) {
								return;
							}
							patCanvas.width = _video.width;
							patCanvas.height = _video.height;
							var ctxPat = patCanvas.getContext('2d');

							var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
							ctxPat.putImageData(idata, 0, 0);

							//sendSnapshotToServer(patCanvas.toDataURL());

							patData = idata;
							$scope.shotReady = true;
						}
					};
					$scope.downloadSnapshot = function downloadSnapshot(dataURL) {
						window.location.href = dataURL;
					};
					var getVideoData = function getVideoData(x, y, w, h) {
						var hiddenCanvas = document.createElement('canvas');
						hiddenCanvas.width = _video.width;
						hiddenCanvas.height = _video.height;
						var ctx = hiddenCanvas.getContext('2d');
						ctx.drawImage(_video, 0, 0, _video.width, _video.height);
						return ctx.getImageData(x, y, w, h);
					};

					/**
					 * This function could be used to send the image data
					 * to a backend server that expects base64 encoded images.
					 *
					 * In this example, we simply store it in the scope for display.
					 */
					var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
						$scope.snapshotData = imgBase64;
					};

				})
;
