/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('MemberControllers', [])
	.controller(
		'MemberNotesCtrl',
		function ($scope, $location, $ionicPopup, $stateParams, Utility, MemberNotes, Members) {
			$scope.data = {member: {}, notes: [], newNote: {ct: '', mi: null}};

			if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
				Utility.getResource(Members.retrieveSingle($stateParams.memberId), function (response) {
					$scope.data.member = response.data;
					$scope.data.newNote.mi = response.id;
					Utility.getResource(MemberNotes.retrieve($stateParams.memberId), function (response) {
						$scope.data.notes = response.data;
					});
				});
			}
			$scope.goToProgress = function () {
				$location.url("/member/progress/" + $stateParams.memberId);
			};
			$scope.goToMember = function () {
				$location.url("/member/" + $stateParams.memberId);
			};
			$scope.remove = function (note) {
				Utility.confirm('Note Removal', 'Are you sure you want to delete this note?', function () {
					for (var i = 0; i < $scope.data.notes.length; i++) {
						if ($scope.data.notes[i].id == note.id) {
							note.workingTrash = true;
							MemberNotes.remove(note.id, function (response) {
								if (response.status) {
									$scope.data.notes.splice(i, 1);
									note.workingTrash = null;
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
				MemberNotes.save($scope.data.newNote, function (response) {
					if (response.status) {
						$scope.data.notes.unshift(data);
						$scope.data.newNote.ct = '';
					}
				});
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
		function ($scope, $ionicPopup, $location, $ionicLoading, $stateParams, Utility, Icons, Instruments, Organizations, Members) {
			$scope.data = {instruments: [], member: {}, instrument: null};

			Instruments.retrieve().query(function (response) {
				$scope.data.instruments = response.data;
				$scope.setRptConfigHx();
			});

			if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
				Members.retrieveSingle($stateParams.memberId).query(function (response) {
					$scope.data.member = response.data;
					$scope.setRptConfigHx();
				});
			}
			$scope.setRptConfigHx = function () {
				if (!Utility.empty($scope.data.member) && Utility.empty($scope.data.member.rptConfigHx) && !Utility.empty(
						$scope.data.instruments) && !Utility.empty($scope.data.member.assessments)) {
					Instruments.collate($scope.data.instruments);
					$scope.data.instrument = Utility.findObjectById($scope.data.instruments, $scope.data.member.assessments[0].ii);
					$scope.data.member.rptConfigHx = Members.rptConfigHx($scope.data.instruments, $scope.data.member, $scope.data.member.assessments);
				}
			};
			$scope.getRptConfigHx = function () {
				return $scope.data.member.rptConfigHx;
			};
			$scope.goToProgress = function () {
				$location.url("/member/progress/" + $stateParams.memberId);
			};
			$scope.goToNotes = function () {
				$location.url("/member/notes/" + $stateParams.memberId);
			};
			$scope.goToMember = function () {
				$location.url("/member/" + $stateParams.memberId);
			};
		})

	.controller(
		'MemberViewCtrl',
		function ($http, $rootScope, $scope, $filter, $cookieStore, $ionicPopup, $location, $ionicLoading, $stateParams, APP_ROLES, Utility, Icons, Instruments,
				  Organizations, Members, Messages, Assessments) {

			$scope.Members = Members;
			$scope.data = {isLoading: true, showMember: false, dirty: false, user: $cookieStore.get('user'), name: 'Member', newMessage: ''};
			$scope.roles = $rootScope.roles;

			if (!Utility.empty(Members.current)) {
				$scope.data.name = Members.current.fn + ' ' + Members.current.ln;
			}
			if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
				if (Members.current == null || Members.current.id != $stateParams.memberId) {
					$scope.data.isLoading = true;
					Utility.getResource(Members.retrieveSingle($stateParams.memberId), function (response) {
						Members.current = response.data;
						$scope.data.isLoading = false;
						$scope.data.name = Members.current.fn + ' ' + Members.current.ln;
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
					Utility.statusAlert(response.message);
					Members.list = null; // force reload of list
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
				window.location.href = 'mailto:' + member.em + '?subject=Regarding Your CQI Improvement Plan';
			};
			$scope.sendText = function (member) {
				var myPopup = $ionicPopup.show({
												   template: '<input type="text" ng-model="data.newMessage"/>',
												   title: 'Enter a brief text message to send:',
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
				Utility.confirm('Assessment Deletion Confirmation', "Are you sure you wish to PERMANENTLY remove this assessment?",
								function () {
									if (!Utility.empty(assessmentId)) {
										Members.list = null; // force reload of member list
										Assessments.remove(assessmentId, function (status, message) {
											if (status == 1) {
												for (var i = 0; i < $scope.Members.current.assessments.length; i++) {
													if ($scope.Members.current.assessments[i].id == assessmentId) {
														$scope.Members.current.assessments.splice(i, 1);
														break;
													}
												}
											}
											else {
												Utility.statusAlert(status, message);
											}
										});
									}
								});
			};
			$scope.deOrReactivate = function () {
				var word1 = Members.current.ae ? 'Reactivation' : 'Deactivation';
				var word2 = Members.current.ae ? 'RE-ACTIVATE' : 'DEACTIVATE';
				Utility.confirm('Member ' + word1, 'Are you sure you want to ' + word2 + ' this member?', function () {
					Members.deOrReactivate(Members.current, function (response) {
						Members.current = response.data;
						Members.list = null; // force reload of members
					});
				});
			};
		})

	.controller(
		'MemberProgressCtrl',
		function ($scope, $stateParams, Utility, Instruments, Organizations, Assessments) {
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
								$scope.data.rptConfig.series.push(rData.series[i]);
							}
							if (rData.series[i].grouping == 1 || rData.series[i].grouping == 2) {
								rData.series[i].visible = true;
								$scope.data.rptConfig1.series.push(rData.series[i]);
							}
						}
						$scope.data.rptConfig.xAxis.categories = rData.labels;
						$scope.data.rptConfig0.xAxis.categories = rData.labels;
						$scope.data.rptConfig1.xAxis.categories = rData.labels;
					});
				}
			};
			$scope.goToBarProgress = function () {
				$location.url("/member/barProgress/" + $stateParams.memberId);
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

	.controller(
		'MemberListCtrl',
		function ($scope, $ionicPopup, $location, $ionicLoading, $stateParams, Utility, Icons, Members) {
			$scope.Members = Members;
			$scope.data = {isLoading: true, searchFilter: null, showIncludeInactive: true, includeInactive: false};

			$scope.getMembers = function () {
				Utility.getResource(Members.retrieve($scope.data.includeInactive), function (response) {
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
;
