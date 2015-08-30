'use strict';

angular.module('app',
	[
		'ionic',
		'angularLoad',
		'highcharts-ng',
		'ngSanitize',
		/*				   'ngTouch', */
		'ngCookies',
		'ngAnimate',
		'ngResource',
		'xeditable',
		'vr.directives.slider',
		'youtube-embed',
		'webcam',
		'Roles',
		'Routing',
		'Icons',
		'PDF',
		'Instruments',
		'Settings',
		'Plans',
		'Utility',
		'Authentication',
		'Quizzes',
		'Organizations',
		'Members',
		'MemberNotes',
		'Assessments',
		'Resources',
		'LearningModules',
		'Outcomes',
		'ControllerCommon',
		'ControllerManager',
		'ControllerAdministrator',
		'ControllerProfessional'
	]
)
	.config([
		'$httpProvider', function ($httpProvider) {
			$httpProvider.defaults.useXDomain = true;
			delete $httpProvider.defaults.headers.common['X-Requested-With'];
		}
	])
	.run(function ($ionicPlatform, $ionicPopup, $rootScope, $location, $window, $cookieStore, editableOptions, angularLoad, Icons, Utility, Roles, Authentication) {
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

				 /** Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
				  */
				 if (window.cordova && window.cordova.plugins.Keyboard) {
					 cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				 }
				 if (window.StatusBar) {
					 // org.apache.cordova.statusbar required
					 StatusBar.styleDefault();
				 }
				 Utility.getResource(Roles.retrieve(), function (response) {
					 $rootScope.roles = response;
				 });

				 angularLoad.loadCSS('/site/' + subdomain + '/theme.css').then(function () {
				 }).catch(function () {
				 });
				 angularLoad.loadScript('site/' + subdomain + '/installation.js').then(function () {
					 $rootScope.installation = installation;
					 $rootScope.installation.subdomain = subdomain;
					 $rootScope.installation.operationalMode = operationalMode;
				 }).catch(function () {
				 });

				 $rootScope.siteDir = function () {
					 if (!Utility.empty($rootScope.installation) && !Utility.empty($rootScope.installation.subdomain)) {
						 return "/site/" + $rootScope.installation.subdomain;
					 }
					 return '/site/target'; //@todo fallback
				 };
				 $rootScope.avatarUrl = function (memberId) {
					 if (!Utility.empty($rootScope.installation) && !Utility.empty($rootScope.installation.subdomain) && !Utility.empty(memberId)) {
						 return "/site/" + $rootScope.installation.subdomain + "/avatars/" + memberId + ".jpg";
					 }
					 return '';
				 };
				 $rootScope.avatarAlt = function (member) {
					 if (!Utility.empty(member)) {

						 if (!Utility.empty(member.fn)) {
							 return member.fn + ' ' + member.ln;
						 }
						 else {
							 return member.firstName + ' ' + member.lastName;
						 }
					 }
					 return '';
				 };
				 $rootScope.checkSession = function () {
					 Authentication.check();
				 };
				 $rootScope.logout = function () {
					 var confirmPopup = $ionicPopup.confirm({title: 'Logout Confirmation', template: 'Are you sure you want to log out of the application?'});
					 confirmPopup.then(function (res) {
						 if (res) {
							 Authentication.logout();
							 window.location.href = "/#/login";
							 return 'logged out';
						 }
					 });
					 return '';
				 };
				 $rootScope.dashboardUrl = function () {
					 return Authentication.getUserDashUrl($cookieStore.get('user'));
				 };

				 $rootScope.checkSession();

				 var deviceInformation = ionic.Platform.device();

				 $rootScope.isWebView = ionic.Platform.isWebView();
				 $rootScope.isIPad = ionic.Platform.isIPad();
				 $rootScope.isIOS = ionic.Platform.isIOS();
				 $rootScope.isAndroid = ionic.Platform.isAndroid();
				 $rootScope.isWindowsPhone = ionic.Platform.isWindowsPhone();

				 $rootScope.currentPlatform = ionic.Platform.platform();
				 $rootScope.currentPlatformVersion = ionic.Platform.version();

				 editableOptions.theme = 'bs3';
			 });
		 })

	.directive('errSrc', function () {
				   return {
					   link: function (scope, element, attrs) {
						   element.bind('error', function () {
							   if (attrs.src != attrs.errSrc) {
								   attrs.$set('src', attrs.errSrc);
							   }
						   });
					   }
				   }
			   })
	.directive('headerButtons', function () {
				   return {restrict: 'E', templateUrl: 'templates/_headerButtons.html'};
			   })
	.directive('dashboardCycle', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/dashboardCycle.html'
				   };
			   })
	.directive('avatar', function () {
				   return {
					   restrict: 'E', templateUrl: '../templates/common/avatar.html',
					   scope: {site: '=', memberId: '=', level: '=', alt: '=', sz: '='}
				   };
			   })
	.directive('memberItem', function () {
				   return {restrict: 'E', templateUrl: '../templates/common/memberItem.html'};
			   })
	.directive('assessmentItem', function () {
				   return {restrict: 'E', templateUrl: '../templates/common/assessmentItem.html', scope: {assessment: '=', i: '=', showMember: '=', site: '='}};
			   })
	.directive('assessmentList', function () {
				   return {
					   restrict: 'E',
					   templateUrl: '../templates/common/assessmentList.html',
					   scope: {i: '=', assessments: '=', showMember: '=', site: '='}
				   };
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
					   scope: {weight: '=', range: '=', n: '='}
				   };
			   })
	.directive('quiz', function (Quizzes) {
				   return {
					   restrict: 'AE',
					   scope: {},
					   templateUrl: 'templates/common/quiz.html',
					   link: function (scope, elem, attrs) {

						   scope.start = function () {
							   scope.id = 0;
							   scope.quizOver = false;
							   scope.showingResults = false;
							   scope.inProgress = true;
							   scope.getQuestion();
						   };

						   scope.reset = function () {
							   scope.inProgress = false;
							   scope.showingResults = false;
							   scope.score = 0;
							   scope.id = 0;
						   };

						   scope.isPassingScore = function () {
							   return scope.quizOver && scope.score == scope.getPassingScore();
						   };

						   scope.getQuestion = function () {
							   var q = Quizzes.getQuestion(scope.id);
							   if (q) {
								   scope.question = q.question;
								   scope.options = q.options;
								   scope.answer = q.answer;
								   scope.answerMode = true;
							   }
							   else {
								   scope.quizOver = true;
								   scope.showingResults = true;
							   }
						   };

						   scope.getPassingScore = function () {
							   return Quizzes.getPassingScore();
						   };

						   scope.checkAnswer = function () {
							   if (!$('input[name=answer]:checked').length) {
								   return;
							   }
							   var ans = $('input[name=answer]:checked').val();
							   if (ans == scope.options[scope.answer]) {
								   scope.score++;
								   scope.correctAns = true;
							   }
							   else {
								   scope.correctAns = false;
							   }
							   scope.answerMode = false;
						   };

						   scope.nextQuestion = function () {
							   scope.id++;
							   scope.getQuestion();
						   };

						   scope.reset();
					   }
				   }
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
						span   = [],
						MINUTE = 60,
						HOUR   = 3600,
						DAY    = 86400,
						WEEK   = 604800,
						MONTH  = 2629744,
						YEAR   = 31556926,
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
