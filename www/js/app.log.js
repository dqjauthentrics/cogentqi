'use strict';

angular.module('app.log', []).factory('Log', ['$rootScope', function ($rootScope) {
    return {
        log: function (msg) {
            console.log("LOG:", $rootScope.user.id, msg);
        }
    }
}])
;