'use strict';

angular.module('app.controllers.manager', [])

    .controller('DashboardCtrl', function ($scope, Members) {
        $scope.m = Members;
        Members.initialize();
    })

    .controller('MemberCtrl', function ($scope, $stateParams, Utility, Organizations, Members, Evaluations) {
        $scope.m = Members;
        $scope.a = Evaluations;
        $scope.member = null;
        Organizations.initialize();
        Members.initialize();
        if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
            $scope.member = Members.get($stateParams.memberId);
        }
    })

    .controller('OutcomeCtrl', function ($scope, Outcomes, Resources) {
        $scope.o = Outcomes;
        $scope.r = Resources;

        $scope.getResource = function (resourceId) {
            for (var i = 0; i < $scope.r.resources.length; i++) {
                if ($scope.r.resources[i].id == resourceId) {
                    return $scope.r.resources[i];
                }
            }
            return null;
        };
    })

    .controller('ResourceCtrl', function ($scope, $stateParams, Utility, Resources) {
        $scope.playerVars = {controls: 2, autoplay: 0, modestbranding: 1, rel: 0, theme: 'light'};
        $scope.r = Resources;
        $scope.resource = null;
        if (!Utility.empty($stateParams)) {
            var resourceId = $stateParams.resourceId;
            if (!Utility.empty(resourceId)) {
                $scope.resource = $scope.r.get($stateParams.resourceId);
            }
        }
    })
    .controller('ClassCtrl', function ($scope, $stateParams, Utility, Classes) {
        $scope.cl = Classes;
    })

    .controller('SettingsCtrl', function ($scope) {
        $scope.settings = {
            sampleSetting: true
        };
    });

