'use strict';

angular.module('ControllerAdministrator', [])

	.controller('AdminDashboardCtrl', function ($scope, $cookieStore, Utility) {
					$scope.data = {user: $cookieStore.get('user'), role: 'administrator'};
				})

	.controller('AdminMatrixCtrl', function ($scope, $stateParams, Utility, Instruments, Assessments, Organizations) {
					$scope.Instruments = Instruments;  //@todo Remove paging need for this in views/directives?
					$scope.data = {organizations: [], instruments: [], currentInstrument: {}, currentInstrumentId: 1};

					Utility.getResource(Instruments.retrieve(), function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
					});
					Utility.getResource(Organizations.retrieve(), function (response) {
						console.log("retrieve organizations:", $stateParams);
						$scope.data.organizations = response;
						$scope.setCurrentInstrument($scope.currentInstrumentId);
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
							Utility.getResource(Assessments.retrieveMatrix($scope.data.currentInstrument.id, orgId, true), function (response) {
								$scope.data.matrix = response;
								Assessments.calcMatrixAverages($scope.data.currentInstrument, $scope.data.matrix, true);
							});
						}
					};
					$scope.getColHeaderNames = function () {
						return Instruments.findMatrixResponseRowHeader($scope.data.currentInstrument, 20)
					};
					$scope.getRowValues = function (dataRow) {
						return Assessments.findMatrixResponseRowValues($scope.data.currentInstrument, Instruments.currentSectionIdx, dataRow.responses)
					};
					$scope.printIt = function () {
						/***
						 var printContents = $('#matrixWrapper').html();
						 console.log(printContents);
						 var popupWin = window.open('', '_blank', 'width=800,height=800');
						 popupWin.document.open();
						 popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="/css/style.css" /></head><body onload="window.print()">' + printContents + '</html>');
						 popupWin.document.close();
						 ***/
						html2canvas(document.getElementById('matrix'), {
							onrendered: function (canvas) {
								var img = canvas.toDataURL("image/png")
								window.open(img);
							},
							width: 3000,
							height: 3000
						});
					};
				})

	.controller('AdminOutcomeCtrl', function ($scope, $stateParams, Utility, Organizations, Resources, Outcomes) {
					$scope.data = {orgOutcomes: [], organizations: [], resources: [], currentOrg: {}};

					Organizations.retrieve().query(function (response) {
						$scope.data.organizations = response;
						$scope.setCurrentOrg(response[0]);
					});
					Outcomes.retrieve().query(function (response) {
						$scope.data.orgOutcomes = response;
					});
					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
					});


					$scope.setCurrentOrg = function (organization) {
						$scope.data.currentOrg = organization;
					};
					$scope.getCurrentOrg = function (organization) {
						return $scope.data.currentOrg;
					};
					$scope.methodMessage = function (method) {
						if (method == "D") {
							return "NOTE: This outcome level is calculated through examination of data; it is not recommended that you manually change it.";
						}
						return "Manually configured outcome level.";
					};
					$scope.alignmentLevelPhrase = function (level) {
						var phrase = 'No Alignment';
						switch (parseInt(level)) {
							case 1:
								phrase = 'Partially Aligned';
								break;
							case 2:
								phrase = 'Well-Aligned';
								break;
							case 3:
								phrase = 'Highly Aligned';
								break;
						}
						return phrase;
					};
					$scope.getBarColor = function (outcome, currentOrgId) {
						var color = 'stable';
						if (!Utility.empty(outcome) && !Utility.empty(currentOrgId)) {
							var level = outcome.levels[currentOrgId][outcome.id];
							var range = $("#range" + outcome.id);
							switch (parseInt(level)) {
								case 1:
									color = 'assertive';
									break;
								case 2:
									color = 'energized';
									break;
								case 3:
									color = 'balanced';
									break;
							}
							range.removeClass('range-stable').removeClass('range-assertive').removeClass('range-energized').removeClass('range-balanced').addClass('range-' + color);
						}
						return 'range-' + color;
					};
					$scope.outcomeLevelPhrase = function (level) {
						var phrase = 'No Data';
						switch (parseInt(level)) {
							case 1:
								phrase = 'Unacceptable';
								break;
							case 2:
								phrase = 'Acceptable';
								break;
							case 3:
								phrase = 'Excellent';
								break;
						}
						return phrase;
					};
					$scope.isCurrent = function (organization) {
						return !Utility.empty(organization) && !Utility.empty($scope.data.currentOrg) && organization.id == $scope.data.currentOrg.id;
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
								rubric =
									'The level of performance for this outcome is acceptable and within the range of normal, but there is room for improvement.';
								break;
							case 3:
								rubric = 'This performance level is excellent, exceeding the prescribed normal minimums.  No action is required.';
								break;
						}
						return rubric;
					};
				})

	.controller('AdminProgressCtrl', function ($scope, $stateParams, Utility, Instruments, Organizations, Assessments) {
					$scope.data = {
						chart: null,
						currentSeries: 0,
						instruments: [], organizations: [], currentInstrumentId: 1, currentInstrument: null,
						rptConfig: {
							chart: {type: 'line'},
							title: {text: 'Competency Progress Analysis', x: -20},
							subtitle: {text: 'Pharmacy Technician Evaluation', x: -20},
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
							subtitle: {text: 'Pharmacy Technician Evaluation', x: -20},
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
							subtitle: {text: 'Pharmacy Technician Evaluation', x: -20},
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
						if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
							$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
							$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
							Utility.getResource(Assessments.retrieveProgressByMonth($scope.data.currentInstrument.id, true), function (response) {
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
					$scope.toggleProgress = function () {
						if ($scope.data.currentSeries == 0) {
							$scope.data.rptConfig = $scope.data.rptConfig1;
							$scope.data.currentSeries = 1;
						}
						else {
							$scope.data.rptConfig = $scope.data.rptConfig0;
							$scope.data.currentSeries = 0;
						}
						/**
						 while( $scope.data.chart.series.length > 0 ) {
							$scope.data.chart.series[0].remove( false );
						}
						 for (var i=0; i<series.length; i++) {
							$scope.data.chart.addSeries(series);
						}
						 **/
						//$scope.data.chart.redraw();
					};

				})

	.controller('AdminAlignmentCtrl', function ($scope, $stateParams, Utility, Instruments, Resources, Outcomes) {
					$scope.data = {alignments: [], instruments: [], outcomes: [], resources: [], resource: {}, currentInstrument: null, currentInstrumentId: 1};

					Utility.getResource(Instruments.retrieve(), function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
					});
					Utility.getResource(Resources.retrieve(), function (response) {
						$scope.data.resources = response;
						$scope.setResource();
					});
					Utility.getResource(Outcomes.retrieve(), function (response) {
						$scope.data.outcomes = response;
						$scope.setOutcome();
					});

					$scope.setResourceAlignments = function () {
						if (!Utility.empty($scope.data.resource) && !Utility.empty($scope.data.currentInstrument)) {
							$scope.data.alignments = {};
							for (var z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
								var questionId = $scope.data.currentInstrument.questions[z].id;
								$scope.data.alignments[questionId] = 0;
							}
							if (!Utility.empty($scope.data.resource) && !Utility.empty($scope.data.resource.alignments) && $scope.data.resource.alignments.length > 0) {
								for (var i = 0; i < $scope.data.resource.alignments.length; i++) {
									var alignment = $scope.data.resource.alignments[i];
									$scope.data.alignments[alignment.questionId] = alignment.weight;
								}
							}
						}
					};
					$scope.setOutcomeAlignments = function () {
						if (!Utility.empty($scope.data.outcome) && !Utility.empty($scope.data.currentInstrument)) {
							$scope.data.alignments = {};
							for (var z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
								var questionId = $scope.data.currentInstrument.questions[z].id;
								$scope.data.alignments[questionId] = 0;
							}
							if (!Utility.empty($scope.data.outcome) && !Utility.empty($scope.data.outcome.alignments) && $scope.data.outcome.alignments.length > 0) {
								for (var i = 0; i < $scope.data.outcome.alignments.length; i++) {
									var alignment = $scope.data.outcome.alignments[i];
									$scope.data.alignments[alignment.questionId] = alignment.weight;
								}
							}
						}
					};
					$scope.setResource = function () {
						if (!Utility.empty($stateParams)) {
							var resourceId = $stateParams.resourceId;
							if (!Utility.empty(resourceId)) {
								$scope.data.resource = Utility.findObjectById($scope.data.resources, resourceId);
								$scope.data.resource.location = 'modules/' + $scope.data.resource.number.toLowerCase() + '.html';
								$scope.setResourceAlignments();
							}
						}
						$scope.setResourceAlignments();
					};
					$scope.setOutcome = function () {
						if (!Utility.empty($stateParams)) {
							var outcomeId = $stateParams.outcomeId;
							if (!Utility.empty(outcomeId)) {
								$scope.data.outcome = Utility.findObjectById($scope.data.outcomes, outcomeId);
								$scope.setOutcomeAlignments();
							}
						}
						$scope.setOutcomeAlignments();
					};
					$scope.setCurrentInstrument = function (instrumentId) {
						if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
							$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
							$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
							$scope.setResourceAlignments();
							$scope.setOutcomeAlignments();
						}
					};
					$scope.alignmentLevelPhrase = function (level) {
						var phrase = 'Not Aligned';
						switch (parseInt(level)) {
							case 1:
								phrase = 'Partially Aligned';
								break;
							case 2:
								phrase = 'Aligned';
								break;
							case 3:
								phrase = 'Highly Aligned';
								break;
						}
						return phrase;
					};
				})

	.controller('AdminMemberCtrl', function ($scope, $stateParams, Utility, Organizations, Members) {
					$scope.data = {organizations: [], currentMembers: undefined, currentOrg: {}, parentOrg: {}};

					$scope.Members = Members;  //@todo currently need to pass through to memberItem tag

					var organizationId = null;
					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.organizationId)) {
						organizationId = $stateParams.organizationId;
					}
					Organizations.retrieve(organizationId).query(function (response) {
						$scope.data.organizations = response;
						if (!Utility.empty(response)) {
							$scope.data.parentOrg = response[0];
							response.shift();
							var firstChild = !Utility.empty(response) && !Utility.empty(response[1]) ? response[1] : null;
							$scope.setCurrentOrg(firstChild);
						}
					});
					$scope.setCurrentOrg = function (organization) {
						$scope.data.currentOrg = organization;
						$scope.data.currentMembers = [];
						if (!Utility.empty(organization)) {
							Organizations.members(organization.id).query(function (response) {
								$scope.data.currentMembers = response;
							});
						}
					};
					$scope.orgMatrix = function (organizationId) {
						window.location = "#/administrator/dashboard/matrix/" + organizationId;
					};
					$scope.isCurrent = function (organization) {
						return !Utility.empty(organization) && !Utility.empty($scope.data.currentOrg) && organization.id == $scope.data.currentOrg.id;
					};
				})

	.controller('AdminAlignmentsCtrl', function ($scope, $stateParams, Instruments, Resources, Outcomes) {
					$scope.data = {instruments: [], resources: [], outcomes: []};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
					});
					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
					});
					Outcomes.retrieve().query(function (response) {
						$scope.data.outcomes = response;
					});
				})

	.controller('AdminInstrumentsCtrl', function ($scope, $stateParams, Utility, Instruments) {
					$scope.data = {instruments: []};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						$scope.setCurrentInstrument();
					});

					$scope.setCurrentInstrument = function () {
						if (!Utility.empty($stateParams)) {
							$scope.data.instrument = Utility.findObjectById($scope.data.instruments, $stateParams.instrumentId);
						}
					};

				})
	.controller('AdminSettingsCtrl', function ($scope, Utility, Organizations, Settings) {
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
