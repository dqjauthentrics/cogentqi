/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('app')
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

	.directive('dashboardCycle', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_dashboardCycle.html'
		};
	})

	.directive('infoBadge', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_infoBadge.html',
			scope: {n: '='}
		};
	})

	.directive('avatar', function () {
		return {
			restrict: 'E', templateUrl: '../templates/common/_avatar.html',
			scope: {site: '=', memberId: '=', level: '=', alt: '=', sz: '='}
		};
	})

	.directive('equalizer', function () {
		return {
			restrict: 'E', templateUrl: '../templates/common/_equalizer.html',
			scope: {alignment: '=', choices: '=', values: '=', min: '=', max: '=', dirty: '='}
		};
	})

	.directive('memberItem', function () {
		return {restrict: 'E', templateUrl: '../templates/common/_memberItem.html'};
	})

	.directive('assessmentItem', function () {
		return {
			restrict: 'E', templateUrl: '../templates/assessment/_item.html',
			scope: {assessment: '=', i: '=', showMember: '=', site: '=', prefix: '='}
		};
	})

	.directive('assessmentList', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_assessmentList.html',
			scope: {i: '=', assessments: '=', showMember: '=', site: '=', remover: '='}
		};
	})

	.directive('assessmentResponse', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/assessment/_response.html'
		};
	})

	.directive('assessmentNameCard', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/assessment/_nameCard.html',
			scope: {member: '=', assessment: '=', site: '='}
		};
	})

	.directive('assessmentRecommendations', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/assessment/_recommendations.html',
			scope: {title: '=', items: '='}
		};
	})

	.directive('assessmentRecommendationRanking', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/assessment/_recommendationRanking.html',
			scope: {weight: '=', range: '=', n: '='}
		};
	})

	.directive('levelTag', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_levelTag.html',
			scope: {text: '=', level: '=', icon: '='}
		};
	})
	.directive('listSearcher', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_listSearcher.html'
		};
	})
	.directive('headerNavigation', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_headerNavigation.html'
		};
	})

	.directive('outcomeLevelTag', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_outcomeLevelTag.html',
			scope: {text: '=', level: '=', icon: '='}
		};
	})
	.directive('outcomeItemTable', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/outcome/_itemTable.html'
		};
	})

	.directive('scheduleTable', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/administrator/_scheduleTable.html'
		};
	})

	.directive('memberAssessments', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/member/_assessments.html'
		};
	})

	.directive('memberContact', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/member/_contact.html'
		};
	})

	.directive('memberEvents', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/member/_events.html'
		};
	})
	.directive('memberOverview', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/member/_overview.html'
		};
	})

	.directive('microBadge', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_microBadge.html',
			scope: {text: '=', size: '=', src: '=', completed: '='}
		};
	})

	.directive('planItem', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_planItem.html',
			scope: {item: '=', i: '=', verb: '='}
		};
	})

	.directive('pageLoader', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_pageLoader.html',
			scope: {loading: '=', i: '='}
		};
	})

	.directive('quiz', function (Quizzes) {
		return {
			restrict: 'AE',
			scope: {},
			templateUrl: 'templates/common/_quiz.html',
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
;
