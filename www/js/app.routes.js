angular.module('app.routes', ['ionic']).config(function ($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider
		.state('login', {
				   url: '/login', templateUrl: 'templates/login.html', controller: 'LoginController'
			   })

		// setup an abstract state for the tabs directive
		.state('tab', {url: "/tab", abstract: true, templateUrl: "templates/tabs.html"})

		// Each tab has its own nav history stack:
		.state('tab.dashboard', {
				   url: '/dashboard',
				   views: {
					   tabDashboard: {
						   templateUrl: 'templates/dashboard.html', controller: 'DashboardCtrl'
					   }
				   }
			   })
		.state('tab.assessmentMatrix', {
				   url: '/dashboard/matrix',
				   views: {
					   tabDashboard: {
						   templateUrl: 'templates/assessmentMatrix.html',
						   controller: 'AssessmentCtrl'
					   }
				   }
			   })

		.state('tab.outcomes', {
				   url: '/outcomes',
				   views: {
					   tabOutcomes: {
						   templateUrl: 'templates/outcomes.html',
						   controller: 'OutcomeCtrl'
					   }
				   }
			   })
		.state('tab.employees', {
				   url: '/employees',
				   views: {
					   tabEmployees: {
						   templateUrl: 'templates/employees.html',
						   controller: 'EmployeeCtrl'
					   }
				   }
			   })
		.state('tab.employee', {
				   url: '/employees/:employeeId',
				   views: {
					   tabEmployees: {
						   templateUrl: 'templates/employee.html',
						   controller: 'EmployeeCtrl'
					   }
				   }
			   })
		.state('tab.assessments', {
				   url: '/assessments',
				   views: {
					   tabAssessments: {
						   templateUrl: 'templates/assessments.html',
						   controller: 'AssessmentCtrl'
					   }
				   }
			   })
		.state('tab.assessmentA', {
				   url: '/assessment/a/:assessmentId',
				   views: {
					   tabAssessments: {
						   templateUrl: 'templates/assessment.html',
						   controller: 'AssessmentCtrl'
					   }
				   }
			   })

		.state('tab.assessmentE', {
				   url: '/assessment/e/:employeeId',
				   views: {
					   tabAssessments: {
						   templateUrl: 'templates/assessment.html',
						   controller: 'AssessmentCtrl'
					   }
				   }
			   })
		.state('tab.classes', {
				   url: '/classes',
				   views: {
					   tabResources: {
						   templateUrl: 'templates/classes.html',
						   controller: 'ClassCtrl'
					   }
				   }
			   })
		.state('tab.resources', {
				   url: '/resources',
				   views: {
					   tabResources: {
						   templateUrl: 'templates/resources.html',
						   controller: 'ResourceCtrl'
					   }
				   }
			   })
		.state('tab.resourceDetail', {
				   url: '/resource/:resourceId',
				   views: {
					   tabResources: {
						   templateUrl: 'templates/resource.html',
						   controller: 'ResourceCtrl'
					   }
				   }
			   })
		.state('tab.assessmentEmpSection', {
				   url: '/assessment/:assessmentId/:employeeId/:sectionIdx',
				   views: {
					   tabAssessments: {
						   templateUrl: 'templates/assessment.html',
						   controller: 'AssessmentCtrl'
					   }
				   }
			   })
		.state('tab.latestAssessment', {
				   url: '/assessment/:employeeId',
				   views: {
					   tabAssessments: {
						   templateUrl: 'templates/assessment.html',
						   controller: 'AssessmentCtrl'
					   }
				   }
			   })
		.state('tab.settings', {
				   url: '/settings',
				   views: {
					   tabSettings: {
						   templateUrl: 'templates/settings.html',
						   controller: 'SettingsCtrl'
					   }
				   }
			   });

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/dashboard');

});