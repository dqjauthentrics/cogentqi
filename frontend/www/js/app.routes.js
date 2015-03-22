'use strict';

angular.module('app.routes', ['ionic']).config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('login', {
            url: '/login', templateUrl: 'templates/manager/login.html', controller: 'LoginController'
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
        .state('administrator.organizations', {
            url: '/organizations',
            views: {
                administratorOrganizations: {templateUrl: 'templates/administrator/organizations.html', controller: 'AdminOrganizationCtrl'}
            }
        })
        .state('administrator.settings', {
            url: '/settings',
            views: {administratorSettings: {templateUrl: 'templates/administrator/settings.html', controller: 'AdminSettingsCtrl'}}
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
                professionalHelp: {templateUrl: 'templates/professional/help.html', controller: 'ProfOrganizationCtrl'}
            }
        })
        .state('professional.settings', {
            url: '/settings',
            views: {professionalSettings: {templateUrl: 'templates/professional/settings.html', controller: 'ProfSettingsCtrl'}}
        })

    /**
     * Manager user states.
     */
        .
        state('manager', {url: "/manager", abstract: true, templateUrl: "templates/manager/tabs.html"})

        .state('manager.dashboard', {
            url: '/dashboard',
            views: {
                managerDashboard: {
                    templateUrl: 'templates/manager/dashboard.html', controller: 'DashboardCtrl'
                }
            }
        })
        .state('manager.assessmentMatrix', {
            url: '/dashboard/matrix',
            views: {
                managerDashboard: {
                    templateUrl: 'templates/manager/assessmentMatrix.html',
                    controller: 'AssessmentCtrl'
                }
            }
        })
        .state('manager.outcomes', {
            url: '/outcomes',
            views: {
                managerOutcomes: {
                    templateUrl: 'templates/manager/outcomes.html',
                    controller: 'OutcomeCtrl'
                }
            }
        })
        .state('manager.members', {
            url: '/members',
            views: {
                managerMembers: {
                    templateUrl: 'templates/manager/members.html',
                    controller: 'MemberCtrl'
                }
            }
        })
        .state('manager.member', {
            url: '/members/:memberId',
            views: {
                managerMembers: {
                    templateUrl: 'templates/manager/member.html',
                    controller: 'MemberCtrl'
                }
            }
        })
        .state('manager.assessments', {
            url: '/assessments',
            views: {
                managerAssessments: {
                    templateUrl: 'templates/manager/assessments.html',
                    controller: 'AssessmentCtrl'
                }
            }
        })
        .state('manager.assessmentA', {
            url: '/assessment/a/:assessmentId',
            views: {
                managerAssessments: {
                    templateUrl: 'templates/manager/assessment.html',
                    controller: 'AssessmentCtrl'
                }
            }
        })

        .state('manager.assessmentE', {
            url: '/assessment/e/:memberId',
            views: {
                managerAssessments: {
                    templateUrl: 'templates/manager/assessment.html',
                    controller: 'AssessmentCtrl'
                }
            }
        })
        .state('manager.classes', {
            url: '/classes',
            views: {
                managerResources: {
                    templateUrl: 'templates/manager/classes.html',
                    controller: 'ClassCtrl'
                }
            }
        })
        .state('manager.resources', {
            url: '/resources',
            views: {
                managerResources: {
                    templateUrl: 'templates/manager/resources.html',
                    controller: 'ResourceCtrl'
                }
            }
        })
        .state('manager.resourceDetail', {
            url: '/resource/:resourceId',
            views: {
                managerResources: {
                    templateUrl: 'templates/manager/resource.html',
                    controller: 'ResourceCtrl'
                }
            }
        })
        .state('manager.assessmentEmpSection', {
            url: '/assessment/:assessmentId/:memberId/:sectionIdx',
            views: {
                managerAssessments: {
                    templateUrl: 'templates/manager/assessment.html',
                    controller: 'AssessmentCtrl'
                }
            }
        })
        .state('manager.latestAssessment', {
            url: '/assessment/:memberId',
            views: {
                managerAssessments: {
                    templateUrl: 'templates/manager/assessment.html',
                    controller: 'AssessmentCtrl'
                }
            }
        })
        .state('manager.settings', {
            url: '/settings',
            views: {
                managerSettings: {
                    templateUrl: 'templates/manager/settings.html',
                    controller: 'SettingsCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/manager/dashboard');

});