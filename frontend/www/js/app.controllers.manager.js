'use strict';

angular.module('app.controllers.manager', [])

    .controller('LoginController', [
        '$scope', '$location', 'Authentication', function ($scope, $location, Authentication) {
            var email = null;
            var password = null;
            var createEmail = null;
            var createPassword = null;
            $scope.auth = Authentication;

            $scope.login = function (loginType) {
                Authentication.login(loginType, this.email, this.password);
            };
            $scope.createAccount = function () {
                Authentication.createAccount(this.createEmail, this.createPassword);
            };
            $scope.logout = function () {
                Authentication.logout();
                window.location.href = "/#/login";
                return 'logged out';
            };
        }
    ])

    .controller('DashboardCtrl', function ($scope, Members) {
        $scope.m = Members;
        Members.initialize();
    })

    .controller('MemberCtrl', function ($scope, $stateParams, Utility, Organizations, Members, Assessments) {
        $scope.m = Members;
        $scope.a = Assessments;
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

    .controller('AssessmentCtrl', function ($scope, $stateParams, Utility, Assessments, Members, Resources) {
        $scope.a = Assessments;
        $scope.m = Members;
        $scope.r = Resources;
        $scope.assessment = null;

        $scope.r0 = [];
        $scope.r1 = [1];
        $scope.r2 = [1, 1];
        $scope.r3 = [1, 1, 1];
        $scope.r4 = [1, 1, 1, 1];
        $scope.r5 = [1, 1, 1, 1, 1];

        Members.initialize();
        if (!Utility.empty($stateParams)) {
            if (!Utility.empty($stateParams.assessmentId)) {
                $scope.assessment = Assessments.get($stateParams.assessmentId);
            }
            else if (!Utility.empty($stateParams.memberid)) {
                $scope.member = Members.get($stateParams.memberid);
                $scope.assessment = member.assessment;
            }
        }
        $scope.getRange = function (n) {
            switch (Math.round(n)) {
                case 1:
                    return $scope.r1;
                case 2:
                    return $scope.r2;
                case 3:
                    return $scope.r3;
                case 4:
                    return $scope.r4;
                case 5:
                    return $scope.r5;
            }
            return $scope.r0;
        };
    })

    .controller('SettingsCtrl', function ($scope) {
        $scope.settings = {
            sampleSetting: true
        };
    });

