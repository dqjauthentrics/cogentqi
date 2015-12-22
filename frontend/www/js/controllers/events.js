/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('EventControllers', [])

	.controller(
		'EventEditCtrl',
		function ($scope, $stateParams, Utility, Events) {
            $scope.data = {isLoading: true};
            Events.get().then(function (events) {
                $scope.event = events.find($stateParams.eventId);
                $scope.data.isLoading = false;
                $scope.save = function() {
                    Events.saveEvent($scope.event, function(error) {
                        alert('not implemented ' + error);
                    });
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
		function ($scope, $stateParams, Utility, EventAlignments, QuestionGroups) {
            $scope.data = {isLoading: true, searchFilter: ''};
            Events.get().then(function (events) {
                $scope.event = events.find($stateParams.eventId);
                $scope.data.isLoading = false;
            }, function(error) {
                return $q.reject(error);
            }).then(function(response) {
                return EventAlignments.load($stateParams.eventId)
            }, function(error) {
                return $q.reject(error);
            }).then(function(response) {
                return QuestionGroups.get().then(function(questionGroups) {
                    $scope.questionGroups = questionGroups;
                    $scope.questionGroups.items.forEach(function(group) {
                        group.isOpen = false;
                        group.questions.forEach(function(question) {
                            var alignment = null;
                            if (EventAlignments.quetions[question.id] === true) {
                                alignment = EventAlignments.find(question.id);
                                alignment.isAligned = true;
                            }
                            else {
                                alignment = EventAlignments.create(question.id);
                                alignment.isAligned = false;
                            }
                            question.alignment = alignment;
                        });
                    });
                    $scope.toggleOpen = function(group) {
                        group.isOpen = !group.isOpen;
                    };
                    $scope.save = function() {
                        var alignments = [];
                        $scope.questionGroups.items.forEach(function(group) {
                            group.questions.forEach(function(question) {
                                if (question.alignment.isAligned) {
                                    delete question.alignment;
                                    alignments.push(question.alignment);
                                }
                            });
                        });
                        EventAlignments.save($stateParams.eventId, alignments, function(error) {
                            alert('could not save event alignments not implemented');
                        });
                    };
                    $scope.date.isLoading = false;
                },
                function(error) {
                    return $q.reject(error);
                });
           }, function(error) {
                alert('not implemented' + error);
            });
		});