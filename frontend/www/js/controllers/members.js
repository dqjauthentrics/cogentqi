/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('MemberControllers', [])
	.controller(
		'MemberNotesCtrl',
		function ($scope, $location, $ionicPopup, $stateParams, Utility, MemberNotes, Members) {
			$scope.data = {notes: [], newNote: {ct: '', mi: null}};
			$scope.Members = Members;

			if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
				if (Utility.empty($scope.Members.current) || $scope.Members.current.id !== $stateParams.memberId) {
					Utility.getResource(Members.retrieveSingle($stateParams.memberId), function (response) {
						$scope.Members.current = response.data;
						$scope.getNotes();
					});
				}
				else {
					$scope.getNotes();
				}
			}
			$scope.getNotes = function () {
				$scope.data.newNote.mi = $scope.Members.current.id;
				Utility.getResource(MemberNotes.retrieve($stateParams.memberId), function (response) {
					if (response.status == 1) {
						$scope.data.notes = response.data;
					}
				});
			};
			$scope.goToProgress = function () {
				$location.url("/member/progress/" + $stateParams.memberId);
			};
			$scope.goToProfile = function () {
				$location.url("/member/view/" + $stateParams.memberId);
			};
			$scope.remove = function (note) {
				Utility.confirm('Note Removal', 'Are you sure you want to delete this note?', function () {
					for (var i = 0; i < $scope.data.notes.length; i++) {
						if ($scope.data.notes[i].id == note.id) {
							note.workingTrash = true;
							MemberNotes.remove(note.id, function (response) {
								if (response.status == 1 && $scope.data.notes.length > 0) {
									$scope.data.notes.splice(i, 1);
									note.workingTrash = null;
								}
								else {
									Utility.statusAlert(response);
								}
							});
							return;
						}
					}
				});
			};
			$scope.addNote = function () {
				if (Utility.empty($scope.data.newNote.ct)) {
					Utility.popup('Nothing to Save!', 'You must enter some note text before saving it.');
				}
				else {
					MemberNotes.save($scope.data.newNote, function (response) {
						if (response.status == 1 && response.code == 200) {
							if (Utility.empty($scope.data.notes)) {
								$scope.data.notes = [];
							}
							$scope.data.notes.unshift(response.data);
							$scope.data.newNote.ct = '';
						}
						else {
							Utility.statusAlert(response);
						}
					});
				}
			};
			$scope.flag = function (note) {
				note.flag = note.flag == 0 ? 1 : 0;
				note.workingFlag = true;
				MemberNotes.save(note, function (response) {
					note.workingFlag = null;
				});
			};
			$scope.thumbsUp = function (note) {
				note.flag = note.flag == 2 ? 0 : 2;
				note.workingThumb = true;
				MemberNotes.save(note, function (response) {
					note.workingThumb = null;
				});
			};
			$scope.save = function (note) {
				note.workingSave = true;
				MemberNotes.save(note, function (response) {
					note.dirty = null;
					note.workingSave = null;
				});
			};
		})

	.controller(
		'MemberBarProgressCtrl',
		function ($scope, $timeout, $ionicPopup, $location, $ionicLoading, $stateParams, Utility, Icons, Instruments, Organizations, Members) {
			$scope.Members = Members;
			$scope.Instruments = Instruments;
			$scope.data = {rptConfigHx: [], isLoading: true};

			$scope.setRptConfigHx = function () {
				if (!Utility.empty($scope.Instruments.list) && !Utility.empty($scope.Members.current) && !Utility.empty(
						$scope.Members.current.assessments)) {
					var instrumentId = $scope.Members.current.assessments[0].ii;
					$scope.Instruments.current = Utility.findObjectById($scope.Instruments.list, instrumentId);
					$scope.data.rptConfigHx = Members.rptConfigHx($scope.Instruments.list, $scope.Members.current, $scope.Members.current.assessments);
					$scope.data.isLoading = false;
					$scope.data.name = $scope.Members.current.fn + ' ' + $scope.Members.current.ln;
				}
			};
			$scope.goToBarProgress = function () {
				$location.url("/member/barProgress/" + $stateParams.memberId);
			};
			$scope.goToProgress = function () {
				$location.url("/member/progress/" + $stateParams.memberId);
			};
			$scope.goToNotes = function () {
				$location.url("/member/notes/" + $stateParams.memberId);
			};
			$scope.goToProfile = function () {
				$location.url("/member/view/" + $stateParams.memberId);
			};
			$scope.getMember = function () {
				if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
					if (Utility.empty($scope.Members.current) || $stateParams.memberId !== $scope.Members.current.id) {
						Utility.getResource($scope.Members.retrieveSingle($stateParams.memberId), function (response) {
							if (response.state !== 1) {
								$scope.Members.current = response.data;
								$scope.setRptConfigHx();
							}
							else {
								Utility.statusAlert(response);
							}
						});
					}
				}
			};

			// Main
			//
			Instruments.getCollated(function (response) {
				$scope.getMember();
			});
		})

	.controller(
		'MemberProgressCtrl',
		function ($scope, $location, $stateParams, Utility, Instruments, Organizations, Members, Assessments) {
			$scope.Members = Members;
			$scope.data = {
				chart: null,
				currentSeries: 0,
				instruments: [], organizations: [], currentInstrumentId: 1, currentInstrument: null,
				rptConfig0: {
					chart: {type: 'line'},
					title: {text: 'Learning vs Outcomes', x: -20},
					subtitle: {text: 'Evaluation', x: -20},
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
					title: {text: 'Learning vs Competencies', x: -20},
					subtitle: {text: 'Evaluation', x: -20},
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
				$scope.data.instruments = response.data;
				Instruments.collate($scope.data.instruments);
				if (!Utility.empty(response)) {
					$scope.setCurrentInstrument(response.data[0].id);
				}
			});
			Utility.getResource(Organizations.retrieve(), function (response) {
				$scope.data.organizations = response.data;
			});

			if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
				$scope.setCurrentInstrument($stateParams.instrumentId);
			}

			$scope.setCurrentInstrument = function (instrumentId) {
				if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments) && !Utility.empty($stateParams.memberId)) {
					$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
					$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
					Utility.getResource(Assessments.retrieveIndividualProgressByMonth($stateParams.memberId), function (response) {
						for (var i = 0; i < response.data.series.length; i++) {
							var rData = response.data;
							if (rData.series[i].grouping == 0 || rData.series[i].grouping == 2) {
								$scope.data.rptConfig0.series.push(rData.series[i]);
							}
							if (rData.series[i].grouping == 1 || rData.series[i].grouping == 2) {
								rData.series[i].visible = true;
								$scope.data.rptConfig1.series.push(rData.series[i]);
							}
						}
						$scope.data.rptConfig0.xAxis.categories = rData.labels;
						$scope.data.rptConfig1.xAxis.categories = rData.labels;
					});
				}
			};
			$scope.goToBarProgress = function () {
				$location.url("/member/barProgress/" + $stateParams.memberId);
			};
			$scope.goToProgress = function () {
				$location.url("/member/progress/" + $stateParams.memberId);
			};
			$scope.goToNotes = function () {
				$location.url("/member/notes/" + $stateParams.memberId);
			};
			$scope.goToProfile = function () {
				$location.url("/member/view/" + $stateParams.memberId);
			};
		})

	.controller(
		'MemberListCtrl',
		function ($rootScope, $scope, $ionicPopup, $location, $ionicLoading, $stateParams, Utility, Icons, Members) {
			$scope.Members = Members;
			$scope.data = {isLoading: true, searchFilter: null, showIncludeInactive: true, includeInactive: false};

			$scope.getMembers = function () {
				var drilldown = $rootScope.isAdministrator();
				Utility.getResource(Members.retrieve($scope.data.includeInactive, drilldown), function (response) {
					$scope.Members.list = response.data;
					$scope.data.isLoading = false;
				});
			};
			$scope.memberFilter = function (member) {
				return Members.filterer(member, $scope.data.searchFilter);
			};
			$scope.changeActive = function () {
				$scope.data.isLoading = true;
				$scope.getMembers();
			};

			// Main
			if ($scope.Members.list == null) {
				$scope.getMembers();
			}
			else {
				$scope.data.isLoading = false;
			}
		})

	.controller(
		'MemberViewCtrl',
		function ($http, $rootScope, $scope, $filter, $cookieStore, $ionicPopup, $location, $ionicLoading, $translate, $stateParams, APP_ROLES,
				  Utility, Icons, Instruments, Organizations, Members, Messages, Assessments) {

			$scope.Members = Members;
			$scope.data = {isLoading: true, showMember: false, dirty: false, user: $cookieStore.get('user'), name: 'Member', newMessage: ''};
			$scope.roles = $rootScope.roles;

			$scope.msgPromptText = 'Enter a brief text message to send:';
			$scope.subjectText = 'Regarding Your CQI Improvement Plan';
			$scope.reactivationText = 'Reactivation';
			$scope.deactivationText = 'Deactivation';
			$scope.reactivationUCText = 'RE-ACTIVATE';
			$scope.deactivationUCText = 'DE-ACTIVATE';
			$scope.rmConfirmTitle = 'Assessment Deletion Confirmation';
			$scope.rmConfirmBody = 'Are you sure you wish to PERMANENTLY remove this assessment?';

			$translate($scope.msgPromptText).then(function (txt) {
				if (!Utility.empty(txt)) {
					$scope.msgPromptText = txt;
				}
			});
			$translate($scope.subjectText).then(function (txt) {
				if (!Utility.empty(txt)) {
					$scope.subjectText = txt;
				}
			});
			$translate($scope.reactivationText).then(function (txt) {
				if (!Utility.empty(txt)) {
					$scope.reactivationText = txt;
				}
			});
			$translate($scope.deactivationText).then(function (txt) {
				if (!Utility.empty(txt)) {
					$scope.deactivationText = txt;
				}
			});
			$translate($scope.deactivationUCText).then(function (txt) {
				if (!Utility.empty(txt)) {
					$scope.deactivationUCText = txt;
				}
			});
			$translate($scope.reactivationUCText).then(function (txt) {
				if (!Utility.empty(txt)) {
					$scope.reactivationUCText = txt;
				}
			});
			$translate($scope.rmConfirmTitle).then(function (txt) {
				if (!Utility.empty(txt)) {
					$scope.rmConfirmTitle = txt;
				}
			});
			$translate($scope.rmConfirmBody).then(function (txt) {
				if (!Utility.empty(txt)) {
					$scope.rmConfirmBody = txt;
				}
			});

			if (!Utility.empty(Members.current)) {
				$scope.data.name = Members.current.fn + ' ' + Members.current.ln;
			}
			if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
				if ($scope.Members.current == null || $scope.Members.current.id != $stateParams.memberId) {
					$scope.data.isLoading = true;
					Utility.getResource(Members.retrieveSingle($stateParams.memberId), function (response) {
						if (response.status == 1) {
							$scope.Members.current = response.data;
							$scope.data.isLoading = false;
							$scope.data.name = $scope.Members.current.fn + ' ' + $scope.Members.current.ln;
						}
						else {
							Utility.statusAlert(response);
						}
					});
				}
				else {
					$scope.data.isLoading = false;
				}
			}
			$scope.goToBarProgress = function () {
				$location.url("/member/barProgress/" + $stateParams.memberId);
			};
			$scope.goToProgress = function () {
				$location.url("/member/progress/" + $stateParams.memberId);
			};
			$scope.goToNotes = function () {
				$location.url("/member/notes/" + $stateParams.memberId);
			};
			$scope.canEdit = function () {
				return !$rootScope.roleIs([APP_ROLES.PROFESSIONAL]);
			};
			$scope.save = function () {
				Members.saveProfile(Members.current, function (response) {
					Utility.statusAlert(response);
					$scope.Members.list = null; // force reload of list
				});
				$scope.data.dirty = false;
			};
			$scope.setDirty = function () {
				$scope.data.dirty = true;
			};
			$scope.isDirty = function () {
				return $scope.data.dirty;
			};
			$scope.showRole = function () {
				if ($scope.Members.current != null) {
					var selected = $filter('filter')($scope.roles, {id: $scope.Members.current.r});
					return ($scope.Members.current.r && !Utility.empty(selected)) ? selected[0].n : 'Not set';
				}
				else {
					return '';
				}
			};
			$scope.sendEmail = function (member) {
				window.location.href = 'mailto:' + member.em + '?subject=' + $scope.subjectText;
			};
			$scope.sendText = function (member) {
				var myPopup = $ionicPopup.show({
												   template: '<input type="text" ng-model="data.newMessage"/>',
												   title: $scope.msgPromptText,
												   scope: $scope,
												   buttons: [
													   {text: 'Cancel'},
													   {
														   text: '<b>Send</b>',
														   type: 'button-positive',
														   onTap: function (e) {
															   if (!$scope.data.newMessage) {
																   e.preventDefault(); //don't allow the user to close unless he enters text
															   }
															   else {
																   return $scope.data.newMessage;
															   }
														   }
													   }
												   ]
											   });
				myPopup.then(function (res) {
					if (res) {
						Messages.sendText(member, $scope.data.newMessage);
					}
				});
			};
			$scope.remover = function (assessmentId) {
				Utility.confirm($scope.rmConfirmTitle, $scope.rmConfirmBody,
								function () {
									if (!Utility.empty(assessmentId)) {
										Members.list = null; // force reload of member list
										Assessments.remove(assessmentId, function (response) {
											if (response.status == 1 && response.code == 200) {
												for (var i = 0; i < $scope.Members.current.assessments.length; i++) {
													if ($scope.Members.current.assessments[i].id == assessmentId) {
														$scope.Members.current.assessments.splice(i, 1);
														break;
													}
												}
											}
											else {
												Utility.statusAlert(response);
											}
										});
									}
								});
			};
			$scope.deOrReactivate = function () {
				var word1 = Members.current.ae ? $scope.reactivationText : $scope.deactivationText;
				var word2 = Members.current.ae ? $scope.reactivationUCText : $scope.deactivationUCText;
				var activate = Members.current.ae ? 1 : 0;
				Utility.confirm('Member ' + word1, 'Are you sure you want to ' + word2 + ' this member?', function () {
					Members.deOrReactivate(Members.current, activate, function (response) {
						if (response.status == 1 && response.code == 200) {
							Members.current.ae = response.data;
							Members.list = null; // force reload of members
						}
						else {
							Utility.statusAlert(response);
						}
					});
				});
			};
		})
;
