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

	.directive('avatar', function () {
		return {
			restrict: 'E', templateUrl: '../templates/common/_avatar.html',
			scope: {site: '=', memberId: '=', level: '=', alt: '=', sz: '='}
		};
	})

	.directive('memberItem', function () {
		return {restrict: 'E', templateUrl: '../templates/common/_memberItem.html'};
	})

	.directive('assessmentItem', function () {
		return {
			restrict: 'E', templateUrl: '../templates/assessment/_item.html',
			scope: {assessment: '=', i: '=', showMember: '=', site: '=', name: '=', role: '=', prefix: '='}
		};
	})

	.directive('assessmentList', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_assessmentList.html',
			scope: {i: '=', assessments: '=', showMember: '=', site: '=', removeAssessment: '='}
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

	.directive('microBadge', function () {
		return {
			restrict: 'E',
			templateUrl: '../templates/common/_microBadge.html',
			scope: {text: '=', size: '='}
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