'use strict';

angular.module('app.installation', ['app.utils']).factory('Installation', function ($location, angularLoad, Utility) {
    var host = $location.host();
    var parts = host.split('.');
    var subdomain = "default";
    var operationalMode = "Development";
    var installation = {fireBaseUrl: 'https://cogentqi.firebaseio.com'};

    if (parts.length >= 2 && parts[0] != "www" && parts[0] != "app") {
        subdomain = parts[0];
    }
    if (parts.length > 1 && parts[(parts.length - 1)] == "com") {
        operationalMode = "Production";
    }
    installation.subdomain = subdomain;
    installation.operationalMode = operationalMode;

    if (subdomain != 'default') {
        installation.fireBaseUrl = 'https://cogentqi-' + subdomain + '.firebaseio.com';
    }

    angularLoad.loadCSS('css/themes/' + subdomain + '.css').then(function () {
    }).catch(function () {
    });
    angularLoad.loadScript('js/config/' + subdomain + '/installation.js').then(function () {
        installation.config = installation;
    }).catch(function () {
    });

    return {
        get: function () {
            return installation;
        }
    };
});
