'use strict';

angular.module('app.controllers.professional', [])

    .controller('ProfDashboardCtrl', function ($scope) {
    })
    .controller('ProfOrganizationCtrl', function ($scope) {
    })
    .controller('ProfSettingsCtrl', function ($scope) {
        $scope.settings = {
            sampleSetting: true
        };
    })
;
