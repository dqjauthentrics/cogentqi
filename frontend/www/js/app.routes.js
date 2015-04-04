'use strict';

angular.module('app.routes', ['ionic']).config(function ($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider
		.state('login', {
				   url: '/login', templateUrl: 'templates/common/login.html', controller: 'LoginController'
			   })

	/**
	 * Administrator user states.
	 */
		.state('administrator', {url: "/administrator", abstract: true, templateUrl: "templates/administrator/tabs.html"})

		.state('administrator.dashboard', {
				   url: '/dashboard',
				   views: {
					   administratorDashboard: {templateUrl: 'templates/administrator/dashboard.html', controller: 'AdminDashboardCtrl'}
				   }
			   })
		.state('administrator.members', {
				   url: '/members',
				   views: {
					   administratorMembers: {templateUrl: 'templates/administrator/members.html', controller: 'AdminMemberCtrl'}
				   }
			   })
		.state('administrator.outcomes', {
				   url: '/outcomes',
				   views: {
					   administratorOutcomes: {templateUrl: 'templates/administrator/outcomes.html', controller: 'AdminOutcomeCtrl'}
				   }
			   })
		.state('administrator.alignment', {
				   url: '/alignment/:resourceId',
				   views: {
					   administratorAlignments: {templateUrl: 'templates/administrator/alignment.html', controller: 'AdminAlignmentCtrl'}
				   }
			   })
		.state('administrator.outcome', {
				   url: '/outcome/:outcomeId',
				   views: {
					   administratorAlignments: {templateUrl: 'templates/administrator/outcome.html', controller: 'AdminAlignmentCtrl'}
				   }
			   })
		.state('administrator.evaluationMatrix', {
				   url: '/dashboard/matrix',
				   views: {
					   administratorDashboard: {templateUrl: 'templates/administrator/evaluationMatrix.html', controller: 'AdminMatrixCtrl'}
				   }
			   })
		.state('administrator.configuration', {
				   url: '/configuration',
				   views: {administratorConfiguration: {templateUrl: 'templates/administrator/configuration.html', controller: 'AdminConfigurationCtrl'}}
			   })

	/**
	 * Professional user states.
	 */
		.state('professional', {url: "/professional", abstract: true, templateUrl: "templates/professional/tabs.html"})

		.state('professional.dashboard', {
				   url: '/dashboard',
				   views: {
					   professionalDashboard: {templateUrl: 'templates/professional/dashboard.html', controller: 'ProfDashboardCtrl'}
				   }
			   })
		.state('professional.help', {
				   url: '/help',
				   views: {
					   professionalHelp: {templateUrl: 'templates/professional/help.html', controller: 'ProfHelpCtrl'}
				   }
			   })
		.state('professional.settings', {
				   url: '/settings',
				   views: {professionalSettings: {templateUrl: 'templates/professional/settings.html', controller: 'ProfSettingsCtrl'}}
			   })

	/**
	 * Manager user states.
	 */
		.state('manager', {url: "/manager", abstract: true, templateUrl: "templates/manager/tabs.html"})

		.state('manager.dashboard', {
				   url: '/dashboard',
				   views: {
					   managerDashboard: {
						   templateUrl: 'templates/manager/dashboard.html', controller: 'DashboardCtrl'
					   }
				   }
			   })
		.state('manager.evaluationMatrix', {
				   url: '/dashboard/matrix',
				   views: {
					   managerDashboard: {templateUrl: 'templates/common/evaluationMatrix.html', controller: 'MgrMatrixCtrl'}
				   }
			   })
		.state('manager.outcomes', {
				   url: '/outcomes',
				   views: {
					   managerOutcomes: {templateUrl: 'templates/manager/outcomes.html', controller: 'OutcomeCtrl'}
				   }
			   })
		.state('manager.members', {
				   url: '/members',
				   views: {
					   managerMembers: {templateUrl: 'templates/manager/members.html', controller: 'MemberCtrl'}
				   }
			   })
		.state('manager.member', {
				   url: '/member/:memberId',
				   views: {
					   managerMembers: {templateUrl: 'templates/manager/member.html', controller: 'MemberCtrl'}
				   }
			   })
		.state('manager.evaluations', {
				   url: '/evaluations',
				   views: {
					   managerEvaluations: {templateUrl: 'templates/common/evaluations.html', controller: 'EvaluationsCtrl'}
				   }
			   })
		.state('manager.evaluation', {
				   url: '/evaluation/:evaluationId',
				   views: {
					   managerEvaluations: {templateUrl: 'templates/common/evaluation.html', controller: 'EvaluationCtrl'}
				   }
			   })

		.state('manager.newEvaluation', {
				   url: '/evaluation/n/:memberId',
				   views: {
					   managerEvaluations: {templateUrl: 'templates/common/evaluation.html', controller: 'EvaluationCtrl'}
				   }
			   })
		.state('manager.planning', {
				   url: '/planning',
				   views: {
					   managerResources: {templateUrl: 'templates/manager/planning.html', controller: 'PlanningCtrl'}
				   }
			   })
		.state('manager.resources', {
				   url: '/resources',
				   views: {
					   managerResources: {templateUrl: 'templates/manager/resources.html', controller: 'ResourceCtrl'}
				   }
			   })
		.state('manager.resourceDetail', {
				   url: '/resource/:resourceId',
				   views: {
					   managerResources: {templateUrl: 'templates/manager/resource.html', controller: 'ResourceCtrl'}
				   }
			   })
		.state('manager.evaluationEmpSection', {
				   url: '/evaluation/:evaluationId/:memberId/:sectionIdx',
				   views: {
					   managerEvaluations: {templateUrl: 'templates/common/evaluation.html', controller: 'EvaluationCtrl'}
				   }
			   })
		.state('manager.latestEvaluation', {
				   url: '/evaluation/:memberId',
				   views: {
					   managerEvaluations: {templateUrl: 'templates/common/evaluation.html', controller: 'EvaluationCtrl'}
				   }
			   })
		.state('manager.settings', {
				   url: '/settings',
				   views: {
					   managerSettings: {templateUrl: 'templates/manager/settings.html', controller: 'SettingsCtrl'}
				   }
			   });

	//$urlRouterProvider.otherwise('/manager/dashboard');
	$urlRouterProvider.otherwise(function ($injector, $location) {
		var $cookieStore = $injector.get('$cookieStore');
		var user = $cookieStore.get('user');
		if (user !== undefined && user !== null) {
			return user.home;
		}
		else {
			return '/professional/dashboard';
		}
	});
});