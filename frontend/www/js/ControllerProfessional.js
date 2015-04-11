'use strict';

angular.module('ControllerProfessional', [])

	.controller('ProfDashboardCtrl', function ($cookieStore, $rootScope, $scope, Utility, Organizations, Members, Assessments, Plans) {
					$scope.data = {assessments: [], members: [], planItems: [], user: $cookieStore.get('user')};

					try {
						Utility.getResource(Members.retrieve(), function (response) {
							$scope.data.members = response;
							$scope.associate("members");
						});
						Utility.getResource(Plans.retrieve($scope.data.user.id), function (response) {
							$scope.data.planItems = response;
						});
						Utility.getResource(Assessments.retrieveForMember($scope.data.user.id), function (response) {
							$scope.data.assessments = response;
							$scope.associate("evals");
						});
					}
					catch (exception) {
						console.log("EXCEPTION:", exception);
					}

					$scope.associate = function (lbl) {
						if (!Utility.empty($scope.data.assessments) && !Utility.empty($scope.data.members)) {
							Assessments.associateMembers($scope.data.assessments, $scope.data.members);
						}
					};
					$scope.statusWord = function (statusId) {
						var word = 'Enrolled';
						switch (statusId) {
							case 'W':
								word = 'Withdrawn';
								break;
							case 'C':
								word = 'Completed';
								break;
							case 'R':
								word = 'Recommended';
								break;
						}
						return word;
					}
				})

	.controller('ProfHelpCtrl', function ($scope) {
				})

	.controller('ProfSettingsCtrl', function ($scope, Utility, Organizations, Settings) {
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