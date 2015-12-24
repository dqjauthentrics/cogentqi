/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('EventControllers', [])

	.controller(
		'EventEditCtrl',
		function ($scope, $stateParams, Utility, Events) {
            $scope.data = {isLoading: true, isDirty: false, saving: false};
            Events.get().then(function (events) {
                $scope.isDirty = function(dirty) {
                    $scope.data.isDirty = dirty;
                };
                $scope.event = events.find($stateParams.eventId);
                $scope.data.isLoading = false;
                $scope.save = function() {
                    $scope.data.saving = true;
                    Events.saveEvent($scope.event).then(
                        function(response) {
                            $scope.data.saving = false;
                            $scope.isDirty(false);
                    },  function(error) {
                            alert('not implemented ' + error);
                        }
                    );
                }
            }, function(error) {
                alert('not implemented ' + error);
            });
		})

	.controller(
		'EventCatalogCtrl',
		function ($scope, $stateParams, Utility, Events) {
			$scope.data = {isLoading: true, searchFilter: ''};
            Events.get().then(function (events) {
                $scope.Events = events;
                $scope.data.isLoading = false;
            },function(error) {
                alert('not implemented ' + error);
            });
		})

	.controller(
		'EventAlignmentCtrl',
		function ($scope, $stateParams, Utility, Events, EventAlignments, QuestionGroups) {
            $scope.data = {isLoading: true, searchFilter: '', isDirty: false, saving: false};
            $scope.isDirty = function(dirty) {
                $scope.data.isDirty = dirty;
            };
            Events.get().then(function (events) {
                $scope.event = events.find($stateParams.eventId);
                $scope.data.isLoading = false;
            }, function(error) {
                return $q.reject(error);
            }).then(function(response) {
                return EventAlignments.load($stateParams.eventId)
            }, function(error) {
                return $q.reject(error);
            }).then(function(eventAlignments) {
                return QuestionGroups.get().then(function(questionGroups) {
                    $scope.questionGroups = questionGroups;
                    $scope.questionGroups.items.forEach(function(group) {
                        group.isOpen = false;
                        group.questions.forEach(function(question) {
                            var alignment = null;
                            if (eventAlignments.questions[question.id] === true) {
                                alignment = eventAlignments.find(question.id);
                                alignment.isAligned = true;
                            }
                            else {
                                alignment = eventAlignments.create(question.id);
                                alignment.isAligned = false;
                            }
                            question.alignment = alignment;
                        });
                    });
                    $scope.toggleOpen = function(group) {
                        group.isOpen = !group.isOpen;
                    };
                    $scope.save = function() {
                        $scope.saving = true;
                        var alignments = [];
                        $scope.questionGroups.items.forEach(function(group) {
                            group.questions.forEach(function(question) {
                                if (question.alignment.isAligned) {
                                    alignments.push(question.alignment);
                                }
                            });
                        });
                        eventAlignments.save($stateParams.eventId, alignments).then(
                            function(response) {
                                if (response.data.status != 1) {
                                    alert('could not save event alignments not implemented');
                                    return;
                                }
                                $scope.isDirty(false);
                            },
                            function(error) {
                            alert('could not save event alignments not implemented');
                        }).finally(function(callback) {
                            $scope.data.saving = false;
                        });
                    };
                    $scope.data.isLoading = false;
                },
                function(error) {
                    return $q.reject(error);
                });
           }, function(error) {
                alert('not implemented' + error);
            });
		});