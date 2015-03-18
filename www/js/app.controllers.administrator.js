'use strict';

angular.module('app.controllers.administrator', [])

    .controller('AdminDashboardCtrl', function ($scope) {
    })
    .controller('AdminOrganizationCtrl', function ($scope, Organizations) {
        $scope.o = Organizations;
        $scope.o.loadChildOrganizations(0);
    })
    .controller('AdminSettingsCtrl', function ($scope) {
        $scope.settings = {
            sampleSetting: true
        };
    });
