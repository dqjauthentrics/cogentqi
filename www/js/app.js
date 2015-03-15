'use strict';

angular.module('app',
    [
        'ionic',
        'firebase',
        'angularLoad',
        'app.installation',
        'app.routes',
        'app.icons',
        'app.auth',
        'app.organizations',
        'app.members',
        'app.assessments',
        'app.resources',
        'app.classes',
        'app.controllers.manager',
        'app.controllers.administrator',
        'app.controllers.professional',
        'app.outcomes',
        'ngSanitize',
        'ngTouch',
        'ngAnimate',
        'vr.directives.slider',
        'youtube-embed'
    ]
)
    .run(function ($ionicPlatform, $rootScope, $location, $window, angularLoad, Installation, Icons, Utility, Authentication) {
        $ionicPlatform.ready(function () {

            var host = $location.host();
            var parts = host.split('.');
            var subdomain = "default";
            var operationalMode = "Development";
            if (parts.length >= 2 && parts[0] != "www" && parts[0] != "app") {
                subdomain = parts[0];
            }
            if (parts.length > 1 && parts[(parts.length - 1)] == "com") {
                operationalMode = "Production";
            }
            angularLoad.loadCSS('css/themes/' + subdomain + '.css').then(function () {
            }).catch(function () {
            });
            angularLoad.loadScript('js/config/' + subdomain + '/installation.js').then(function () {
                $rootScope.installation = installation;
                $rootScope.installation.subdomain = subdomain;
                $rootScope.installation.operationalMode = operationalMode;
            }).catch(function () {
            });

            $rootScope.i = Icons;

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            $rootScope.auth = null;

            $rootScope.checkSession = function () {
                Authentication.check();
                if (Utility.empty($rootScope.auth)) {
                    $window.location.href = '/#/login';
                }
                else {
                    $window.location.href = ('/#/tab/dashboard');
                }
            };
            $rootScope.logout = function () {
                Authentication.logout();
                window.location.href = "/#/login";
                return 'logged out';
            };
            $rootScope.checkSession();
        });
    })
    .value('FIREBASE_URL', 'https://cogentqi.firebaseio.com')

    .directive('headerButtons', function () {
        return {restrict: 'E', templateUrl: 'templates/_headerButtons.html'};
    })
    .directive('levelTag', function () {
        return {
            restrict: 'E',
            templateUrl: '../templates/common/levelTag.html',
            scope: {text: '=', level: '=', icon: '='}
        };
    })
    .directive('microBadge', function () {
        return {
            restrict: 'E',
            templateUrl: '../templates/common/microBadge.html',
            scope: {text: '=', size: '='}
        };
    })
    .directive('recommendationRanking', function () {
        return {
            restrict: 'E',
            templateUrl: '../templates/common/recommendationRanking.html',
            scope: {weight: '=', range: '='}
        };
    })
    .filter('currentDateTime', [
        '$filter', function ($filter) {
            return function () {
                return $filter('date')(new Date(), 'medium');
            };
        }
    ]);
