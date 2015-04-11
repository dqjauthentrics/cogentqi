'use strict';

angular.module('ControllerCommon', [])

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

	.controller('MgrMatrixCtrl', function ($scope, $stateParams, Utility, Instruments, Assessments, Organizations, Members) {
					$scope.Instruments = Instruments;  //@todo Is this needed in views/directives?
					$scope.Members = Members; //@todo Is this needed in views/directives?
					$scope.Utility = Utility;

					$scope.data = {organizations: [], instruments: [], members: [], currentInstrument: {}, currentInstrumentId: 1};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
					});
					Members.retrieve().query(function (response) {
						$scope.data.members = response;
					});
					Organizations.retrieve().query(function (response) {
						$scope.data.organizations = response;
					});
					Assessments.retrieveMatrix($scope.data.currentInstrument, false).query(function (response) {
						$scope.data.matrix = response;
					});

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
						$scope.setCurrentInstrument($stateParams.instrumentId);
					}

					$scope.setCurrentInstrument = function (instrumentId) {
						if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
							$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
							$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
							Assessments.retrieveMatrix($scope.data.currentInstrument.id, false).query(function (response) {
								$scope.data.matrix = response;
								Assessments.calcMatrixAverages($scope.data.currentInstrument, $scope.data.matrix, false);
							});
						}
					};
					$scope.getColHeaderNames = function () {
						return Instruments.findMatrixResponseRowHeader($scope.data.currentInstrument, 20)
					};
					$scope.getRowValues = function (dataRow) {
						return Assessments.findMatrixResponseRowValues($scope.data.currentInstrument, Instruments.currentSectionIdx, dataRow.responses)
					};
					$scope.findMember = function (memberId) {
						return Utility.findObjectById($scope.data.members, memberId);
					};
				})

	.controller('assessmentCtrl', function ($filter, $scope, $timeout, $stateParams, Utility, Instruments, Assessments, Members, Organizations, Resources) {
					var collated = false;
					$scope.Assessments = Assessments;
					$scope.Instruments = Instruments;
					$scope.r0 = [];
					$scope.r1 = [1];
					$scope.r2 = [1, 1];
					$scope.r3 = [1, 1, 1];
					$scope.r4 = [1, 1, 1, 1];
					$scope.r5 = [1, 1, 1, 1, 1];
					$scope.data = {
						organizations: [],
						instruments: [],
						members: [],
						recommendations: [],
						resources: [],
						instrument: {},
						assessment: null
					};

					/** @todo Retrieving too much data here. Retrieving current user's org should be done once at login and stored in user record.
					 *        For a single assessment, just retrieve a single Instrument and a single member and collate against only that one.
					 */
					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						$scope.collateAssessments();
						$scope.getAssessment();
					});
					Members.retrieve().query(function (response) {
						$scope.data.members = response;
						$scope.collateAssessments();
						$scope.getAssessment();
					});
					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
						$scope.collateAssessments();
						$scope.getAssessment();
					});

					$scope.collateAssessments = function () {
						if (!collated && !Utility.empty($scope.data.assessment) && !Utility.empty($scope.data.instruments) && !Utility.empty($scope.data.members)) {
							collated = true;
							Assessments.collate($scope.data.instruments, $scope.data.members, $scope.data.assessment);
							$scope.getassessment();
						}
					};
					$scope.hasComment = function (question) {
						return !Utility.empty(question.responseRecord) && !Utility.empty(question.responseRecord.ec) && question.responseRecord.ec.length > 0;
					};
					$scope.showComment = function (question) {
						return !Utility.empty(question.showComments) && question.showComments;
					};
					$scope.getComment = function (question) {
						if (!Utility.empty(question) && !Utility.empty(question.responseRecord)) {
							var comment = question.responseRecord.ec;
							if (!Utility.empty(comment)) {
								comment = '"' + comment + '"';
							}
							return comment;
						}
						return null;
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

					$scope.getRecommendations = function () {
						if (!Utility.empty($scope.data.instrument) && !Utility.empty($scope.data.resources)) {
							$scope.data.recommendations = Assessments.recommend($scope.data.instrument, $scope.data.resources);
						}
					};

					$scope.updateResponse = function (question, value) {
						if (!Utility.empty(question) && !Utility.empty(question.responseRecord) && !Utility.empty(value)) {
							question.responseRecord.ri = parseInt(value);
							$scope.getRecommendations();
						}
					};

					$scope.updateSliderResponse = function (question) {
						Assessments.sliderChange(question, $scope.data.instrument);
						$scope.getRecommendations();
					};
					$scope.sliderTranslate = function (value) {
						return Assessments.scoreWord(value);
					};

					$scope.getAssessment = function () {
						if (Utility.empty($scope.data.assessment) && !Utility.empty($stateParams) && !Utility.empty($stateParams.assessmentId)) {
							Assessments.retrieveSingle($stateParams.assessmentId).query(function (response) {
								if (!Utility.empty(response) && !Utility.empty($scope.data.instruments)) {
									$scope.data.instrument = Utility.findObjectById($scope.data.instruments, response.instrumentId);
									Assessments.collate($scope.data.instruments, $scope.data.members, response);
								}
								$scope.data.assessment = response;
								$scope.getRecommendations();
							});
						}
						if (!Utility.empty($scope.data.assessment) && !Utility.empty($scope.data.assessment.member)) {
							Assessments.avgRound = $scope.data.assessment.member.level;
						}
					};

					$scope.getBase64Image = function (url, generatePdf) {
						var img = new Image();
						var dataURL;
						img.src = url;
						img.onload = function () {
							var canvas = document.createElement('canvas');
							canvas.width = img.width;
							canvas.height = img.height;
							var context = canvas.getContext('2d');
							console.log("context", context);
							context.drawImage(img, 0, 0);
							dataURL = canvas.toDataURL('image/jpeg');
							console.log("dataURL", dataURL);
							generatePdf(dataURL);
						}
					};

					$scope.generatePdf = function (imageData) {
						var doc = new jsPDF();
						doc.text(15, 20, $scope.data.instrument.name);
						doc.addImage(imageData, 'JPEG', 165, 10, 40, 18);
						doc.setFontSize(12);
						doc.setTextColor(100, 100, 100);
						doc.text(120, 20, $filter('date')($scope.data.assessment.lastModified, 'medium'));
						doc.setFontSize(16);
						doc.setTextColor(0, 0, 0);
						doc.text(15, 28, $scope.data.assessment.member.firstName + ' ' + $scope.data.assessment.member.lastName);
						var sectionY = 36;
						var questionY = 26;
						//var html = '<table><thead><tr><th>Col1</th><th>Col2</th><th>Col3</th></tr></thead><tbody>';
						for (var i = 0; i < $scope.data.instrument.sections.length; i++) {
							sectionY = questionY + 14;
							if (sectionY > 250) {
								doc.addPage();
								questionY = 20;
								sectionY = questionY;
							}
							var section = $scope.data.instrument.sections[i];
							doc.setFontSize(12);
							doc.setTextColor(50, 100, 150);
							doc.text(15, sectionY, section.name);
							//html += '<tr><th colspan="3">' + section.name + '</th></tr>';
							var splitHeight = 0;
							questionY = sectionY + 5;
							for (var j = 0; j < section.questions.length; j++) {
								var question = section.questions[j];
								questionY += splitHeight;
								if (questionY > 250) {
									doc.addPage();
									questionY = 20;
									sectionY = questionY;
								}
								doc.setFontSize(10);
								doc.setTextColor(100, 100, 100);
								var splitText = doc.splitTextToSize(question.name, 140);
								splitHeight = 6;
								doc.text(20, questionY, splitText);
								if ($scope.data.instrument.id == 2) {
									splitHeight = Math.round(question.name.length / 54) * 6;
									if (question.responseRecord.ri == 2) {
										doc.setTextColor(0, 150, 0);
									}
									else if (question.responseRecord.ri == 1) {
										doc.setTextColor(150, 0, 0);
									}
								}
								doc.text(175, questionY, question.responseRecord.r);
								//html += '<tr><td>&nbsp;</td><td>' + question.name + '</td><td>' + question.responseRecord.r + '</td></tr>';
							}
							//html += '</tbody></table>';
						}
						//doc.fromHTML(html, 20, 20, {});
						doc.save('assessment.pdf');
					};

					$scope.printIt = function () {
						$scope.getBase64Image('http://target.cogentqi/js/config/target/target-logo.jpg', $scope.generatePdf);
						return true;
					};
				})

	.controller('assessmentsCtrl', function ($scope, $stateParams, Utility, Assessments, Members, Organizations) {
					$scope.data = {members: [], assessments: []};

					Members.retrieve().query(function (response) {
						$scope.data.members = response;
						Assessments.associateMembers($scope.data.assessments, $scope.data.members);
					});
					Assessments.retrieve().query(function (response) {
						$scope.data.assessments = response;
						Assessments.associateMembers($scope.data.assessments, $scope.data.members);
					});
				})
;