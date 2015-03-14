'use strict';

angular.module('app.controllers.administrator', [])

    .controller('AdminDashboardCtrl', function ($scope) {
    })
    .controller('AdminOrganizationCtrl', function ($scope) {
    })
    .controller('AdminSettingsCtrl', function ($scope) {
        $scope.settings = {
            sampleSetting: true
        };
    })
;
