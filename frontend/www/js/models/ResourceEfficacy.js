/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ResourceEfficacy', []).service('ResourceEfficacy', function ($q, $http) {
	var svc = this;
	svc.items = [];

    svc.get = function () {
        if (svc.list == null) {
            return $http.get('/api3/resource/efficacy')
                .then(
                    function (result) {
                        if (result.data.status !== 1) {
                            return $q.reject(result.data);
                        }
                        svc.items = result.data.data;
                        return svc;
                    },
                    function (error) {
                        return $q.reject(error);
                    }
                );
        }
        else {
            return $q.when(svc);
        }
    };
});
