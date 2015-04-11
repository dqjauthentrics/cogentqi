'use strict';

angular.module('ControllerManager', [])

	.controller('DashboardCtrl', function ($scope, Organizations) {
				})

	.controller('MemberCtrl', function ($scope, $stateParams, Utility, Icons, Instruments, Organizations, Members) {
					$scope.data = {organizations: [], instruments: [], member: {}, assessments: [], instrument: null};

					$scope.Members = Members;
					$scope.Icons = Icons;

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						$scope.setRptConfigHx();
					});
					Members.retrieve().query(function (response) {
						$scope.data.members = response;
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
						if (!Utility.empty($scope.data.member) && Utility.empty($scope.data.member.rptConfigHx) && !Utility.empty($scope.data.instruments) && !Utility.empty($scope.data.member.assessments)) {
							Instruments.collate($scope.data.instruments);
							$scope.data.instrument = Utility.findObjectById($scope.data.instruments, $scope.data.member.assessments[0].instrumentId);
							$scope.data.member.rptConfigHx = Members.rptConfigHx($scope.data.instruments, $scope.data.member, $scope.data.member.assessments);
						}
					};

					$scope.getRptConfigHx = function () {
						return $scope.data.member.rptConfigHx;
					};
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

	.controller('ResourceCtrl', function ($scope, $stateParams, Utility, LearningModules, Organizations, Resources, Quizzes) {
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
									$scope.data.resource.location = 'modules/' + $scope.data.resource.number.toLowerCase() + '.html';
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
