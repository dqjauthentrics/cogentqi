/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('EventAlignments', []).service('EventAlignments', function ($cookieStore, $q, $http, Utility) {
    var svc = this;
    svc.tempId = -1;
    svc.eventId = -1;
    svc.alignments = null;
    svc.questions = {};

    svc.load = function (eventId) {
        return $http.get('/api3/event/alignments/' + eventId).
        then(function (result) {
                if (result.data.status !== 1) {
                    return $q.reject(result.data);
                }
                var response = result.data;
                svc.alignments = response.data;
                svc.alignments.forEach(function(alignment) {
                   svc.questions[alignment.qi] = true;
                });
                return svc;
            },
            function (error) {
                $q.reject(error);
            });
    };
    svc.create = function(questionId) {
      return {
          qi: questionId,
          inc: 1
      };
    };
    svc.find = function (questionId) {
        for (var i = 0; i < svc.alignments.length; i++) {
            if (svc.alignments[i].qi == questionId) {
                return svc.alignments[i];
            }
        }
        return null;
    };
    svc.save = function (eventId, alignments) {
        return $http.post("/api3/event/saveAlignments",
            {eventId: eventId, alignments: alignments});
    };
});
