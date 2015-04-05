'use strict';

angular.module('app',
			   [
				   'ionic',
				   'angularLoad',
				   'highcharts-ng',
				   'ngSanitize',
				   'ngTouch',
				   'ngCookies',
				   'ngAnimate',
				   'ngResource',
				   'vr.directives.slider',
				   'youtube-embed',
				   'Camera',
				   'app.routes',
				   'app.icons',
				   'app.instruments',
				   'app.settings',
				   'app.utility',
				   'app.authentication',
				   'app.organizations',
				   'app.members',
				   'app.evaluations',
				   'app.resources',
				   'app.learningModules',
				   'app.controllers.common',
				   'app.controllers.manager',
				   'app.controllers.administrator',
				   'app.controllers.professional',
				   'app.outcomes'
			   ]
)
	.config([
				'$httpProvider', function ($httpProvider) {
					$httpProvider.defaults.useXDomain = true;
					delete $httpProvider.defaults.headers.common['X-Requested-With'];
				}
			])
	.run(function ($ionicPlatform, $rootScope, $location, $window, $cookieStore, angularLoad, Icons, Utility, Authentication) {
			 $ionicPlatform.ready(function () {

				 $rootScope.i = Icons;

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

				 // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				 // for form inputs)
				 if (window.cordova && window.cordova.plugins.Keyboard) {
					 cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				 }
				 if (window.StatusBar) {
					 // org.apache.cordova.statusbar required
					 StatusBar.styleDefault();
				 }

				 $rootScope.checkSession = function () {
					 Authentication.check();
				 };
				 $rootScope.logout = function () {
					 Authentication.logout();
					 window.location.href = "/#/login";
					 return 'logged out';
				 };
				 $rootScope.checkSession();
				 $rootScope.user = $cookieStore.get('user');

				 $rootScope.dashboardUrl = function () {
					 return Authentication.getUserDashUrl($cookieStore.get('user'));
				 };
			 });
		 })

	.directive('headerButtons', function () {
				   return {restrict: 'E', templateUrl: 'templates/_headerButtons.html'};
			   })
	.directive('dashboardCycle', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/dashboardCycle.html',
					   scope: {Members: '=', role: '=', user: '=', jobtitle: '='}
				   };
			   })
	.directive('memberItem', function () {
				   return {restrict: 'E', templateUrl: '../templates/common/memberItem.html'};
			   })
	.directive('memberProfile', function () {
				   return {restrict: 'E', templateUrl: '../templates/common/memberProfile.html'};
			   })
	.directive('levelTag', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/levelTag.html',
					   scope: {text: '=', level: '=', icon: '='}
				   };
			   })
	.directive('outcomeLevelTag', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/outcomeLevelTag.html',
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
			])
	.filter("timeAgo", function () {
				//time: the time
				//local: compared to what time? default: now
				//raw: whether you want in a format of "5 minutes ago", or "5 minutes"
				return function (time, local, raw) {
					if (!time) {
						return "";
					}

					if (!local) {
						(local = Date.now())
					}

					if (angular.isDate(time)) {
						time = time.getTime();
					}
					else if (typeof time === "string") {
						time = new Date(time).getTime();
					}

					if (angular.isDate(local)) {
						local = local.getTime();
					}
					else if (typeof local === "string") {
						local = new Date(local).getTime();
					}

					if (typeof time !== 'number' || typeof local !== 'number') {
						return;
					}

					var
						offset = Math.abs((local - time) / 1000),
						span = [],
						MINUTE = 60,
						HOUR = 3600,
						DAY = 86400,
						WEEK = 604800,
						MONTH = 2629744,
						YEAR = 31556926,
						DECADE = 315569260;

					if (offset <= MINUTE) {
						span = ['', raw ? 'now' : 'less than a minute'];
					}
					else if (offset < (MINUTE * 60)) {
						span = [Math.round(Math.abs(offset / MINUTE)), 'min'];
					}
					else if (offset < (HOUR * 24)) {
						span = [Math.round(Math.abs(offset / HOUR)), 'hr'];
					}
					else if (offset < (DAY * 7)) {
						span = [Math.round(Math.abs(offset / DAY)), 'day'];
					}
					else if (offset < (WEEK * 52)) {
						span = [Math.round(Math.abs(offset / WEEK)), 'week'];
					}
					else if (offset < (YEAR * 10)) {
						span = [Math.round(Math.abs(offset / YEAR)), 'year'];
					}
					else if (offset < (DECADE * 100)) {
						span = [Math.round(Math.abs(offset / DECADE)), 'decade'];
					}
					else {
						span = ['', 'a long time'];
					}

					span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
					span = span.join(' ');

					if (raw === true) {
						return span;
					}
					return (time <= local) ? span + ' ago' : 'in ' + span;
				}
			})


;
