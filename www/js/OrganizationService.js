'use strict';

angular.module('app.organizations', ['app.utils', 'app.members']).service('Organizations', function ($rootScope, angularLoad, Utility, Members) {
    var svc = this;
    svc.organizations = [];

    svc.load = function (callback) {
        if (Utility.empty(svc.organizations) && !Utility.empty($rootScope.installation) && !Utility.empty($rootScope.installation.subdomain)) {
            angularLoad.loadScript('js/config/' + $rootScope.installation.subdomain + '/organizations.js').then(function () {
                svc.organizations = organizations;
                console.log("organizations loaded", svc.organizations);
                callback();
            }).catch(function () {
                console.log("ERROR: Unable to load organizations.")
            });
        }
        else {
            callback();
        }
    };

});