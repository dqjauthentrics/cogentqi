(function () {
	'use strict';

	/**
	 * usage: <textarea ng-model="content" redactor></textarea>
	 *
	 *    additional options:
	 *      redactor: hash (pass in a redactor options hash)
	 *
	 */

	var redactorOptions = {
		formatting: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5'],
		buttons: ['format', 'bold', 'italic', 'deleted', 'link', 'alignment', 'horizontalrule', 'table', 'image', 'video', 'file'],
		plugins: ['bufferbuttons', 'inlinestyle', 'alignment', 'table', 'video', 'imagelink', 'fullscreen', 'source', 'iconic2']
	};

	angular.module('angular-redactor', [])
		.constant('redactorOptions', redactorOptions)

		.directive('redactor', [
			'$timeout', function ($timeout) {
				return {
					restrict: 'A',
					require: 'ngModel',
					link: function (scope, element, attrs, ngModel) {

						// Expose scope var with loaded state of Redactor
						scope.redactorLoaded = false;

						var updateModel       = function updateModel(value) {
								// $timeout to avoid $digest collision
								$timeout(function () {
									scope.$apply(function () {
										ngModel.$setViewValue(value);
									});
								});
							},
							options           = {
								callbacks: {
									change: updateModel
								}
							},
							additionalOptions = attrs.redactor ? scope.$eval(attrs.redactor) : {}, editor;

						angular.extend(options, redactorOptions, additionalOptions);

						// put in timeout to avoid $digest collision.  call render()
						// to set the initial value.
						$timeout(function () {
							try {
								editor = element.redactor(options);
								ngModel.$render();
							}
							catch (exception) {
								console.log("exception", exception);
							}
						});

						ngModel.$render = function () {
							if (angular.isDefined(editor)) {
								$timeout(function () {
									element.redactor('code.set', ngModel.$viewValue || '');
									scope.redactorLoaded = true;
								});
							}
						};
					}
				};
			}
		]);
})();