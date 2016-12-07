/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('SettingsControllers', [])
	.controller(
		'SettingsAdminCtrl',
		function ($scope, Icons, Utility) {
			$scope.menuItems = [
				{
					url: "#/administrator/schedule",
					icon: Icons.schedule,
					name: 'Step 6. Assessment Schedule',
					description: 'Review the schedule of assessments to be used within your organization.'
				},
				{
					url: "#/resource/configure",
					icon: Icons.resource,
					name: 'Step 5. Learning Resources',
					description: 'Set up the educational resources available for your organization, along with their alignments to competencies.'
				},
				{
					url: "#/event/configList",
					icon: Icons.event,
					name: 'Step 4. Events',
					description: 'Review all events that can occur in your organization, along with their alignments to competencies.'
				},
				{
					url: "#/outcome/configList",
					icon: Icons.outcome,
					name: 'Step 3. Outcomes',
					description: 'Review the set of general outcomes tracked by your organization, along with their alignments to competencies.'
				},
				{
					url: "#/instrument/list",
					icon: Icons.instrument,
					name: 'Step 2. Competency Instruments',
					description: 'Define the set(s) of competencies recognized by your organization for use in assessments.'
				},
				{
					url: "#/administrator/weights",
					icon: Icons.weights,
					name: 'Step 1. Top-Level Weights',
					description: 'Provide relative weights for system components used in algorithmic determinations.'
				},
				{
					url: "#/settings/personal",
					icon: Icons.schedule,
					name: 'Personal Settings',
					description: 'Review your personal profile settings.'
				}
			];
		})

	.controller(
		'SettingsPersonalCtrl',
		function ($scope, Utility, Organizations, Settings) {
			$scope.data = {settings: []};
			var _video = null, patData = null;

			$scope.webcamReady = false;
			$scope.shotReady = false;
			$scope.patOpts = {x: 0, y: 0, w: 25, h: 25};
			$scope.webcamChannel = {};
			$scope.webcamError = false;

			Settings.retrieve().query(function (response) {
				$scope.data.settings = response.data;
			});
			$scope.webcamChannel = {
				videoHeight: 180,
				videoWidth: 180,
				constraints: {optional: [{minWidth: 600}]},
				video: null // Will reference the video element on success
			};
			$scope.webcamError = function (err) {
				console.log('webcam error', err);
				$scope.webcamError = err;
			};
			$scope.webcamStream = function (stream) {
				//Webcam.set('constraints', {optional: [{minWidth: 600}]});
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