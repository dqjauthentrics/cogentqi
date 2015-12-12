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
			scope: {text: '=', size: '='}
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
	.directive('clearableInput', [
		'$compile',
		/**
		 * Directive clearable-input for <input> elements. Simulates the "clear icon" of the Android EditText.
		 *
		 * Based on the work of "Udi": http://codepen.io/udfalkso/pen/cdfsp
		 *
		 * IMPORTANT NOTE:
		 * The parent node of the input should be a <div>.
		 * The "clear icon" does not work in a <label> element.
		 * Ionitron's answer: https://github.com/driftyco/ionic/issues/2311#issuecomment-74161442
		 * M. Hartington's answer: http://forum.ionicframework.com/t/cannot-tap-click-a-clear-search-icon-inside-an-input-label/4237/7
		 *
		 * Exemple of HTML code:
		 * <div class="item item-input">
		 *     <i class="icon ion-search placeholder-icon"></i>
		 *     <input    type="search" ng-model="ctrl.number" placeholder="Number"
		 *                clearable-input required>
		 * </div>
		 *
		 * @author VinceOPS https://github.com/VinceOPS
		 */
			function ClearableInput($compile) {
			// limit to input element of specific types
			var inputTypes = /^(text|search|number|tel|url|email|password)$/i;

			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {},
				link: function (isolateScope, elem, attrs, ngModelCtrl) {
					var inputElem = elem[0];

					if (inputElem.nodeName.toUpperCase() !== "INPUT") {
						// reserved to <input> elements
						throw new Error('Directive clearable-input is reserved to input elements');
					}
					else if (!inputTypes.test(attrs.type)) {
						// with a correct "type" attribute
						throw new Error("Invalid input type for clearableInput: " + attrs.type);
					}

					// initialized to false so the clear icon is hidden (see the ng-show directive)
					isolateScope.clearable = false;
					// more "testable" when exposed in the scope...
					isolateScope.clearInput = clearInput;

					// build and insert the "clear icon"
					var iconCss = 'margin-right: 15px; ';
					iconCss += 'color: ' + (attrs.clearableInput !== '' ? attrs.clearableInput : '#888');
					var iconTemplate = '<i style="float:right; margin:-1.8em 0.4em 0 0; color:red;" class="icon ion-android-close" ng-show="clearable" style="' + iconCss + '"></i>';
					var clearIconElem = $compile(iconTemplate)(isolateScope);
					elem.after(clearIconElem);
					// make it clear the <input> on click
					clearIconElem.bind('click', isolateScope.clearInput);

					// --- Event-driven behavior ---
					// if the user types something: show the "clear icon" if <input> is not empty
					elem.bind('input', showIconIfInputNotEmpty);
					// if the user focuses the input: show the "clear icon" if it is not empty
					elem.bind('focus', showIconIfInputNotEmpty);
					// if the <input> loses the focus: hide the "clear icon"
					elem.bind('blur', hideIcon);

					function clearInput() {
						ngModelCtrl.$setViewValue('');
						// rendering the updated viewValue also updates the value of the bound model
						ngModelCtrl.$render();

						// hide the "clear icon" as it is not necessary anymore
						isolateScope.clearable = false;

						// as user may want to types again, put the focus back on the <input>
						inputElem.focus();
					}

					/**
					 * Used to show or hide the "clear icon" by updating the scope "clearable" property.
					 *
					 * @param {boolean} newValue If true, show the icon. Otherwise, hide it.
					 */
					function setContainerClearable(newValue) {
						isolateScope.clearable = newValue;
						isolateScope.$apply();
					}

					function showIconIfInputNotEmpty() {
						setContainerClearable(!ngModelCtrl.$isEmpty(elem.val()));
					}

					function hideIcon() {
						setContainerClearable(false);
					}
				}
			};
		}
	])
;
