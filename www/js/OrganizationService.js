'use strict';

angular.module('app.organizations', ['app.members']).service('Organizations', function ($firebaseArray, $firebaseObject, angularLoad, Firestore, Utility, Installation) {
    var svc = this;
    svc.mine = null;
    svc.organizations = [];

    svc.loadUserOrganization = function (organizationId) {
        if (Utility.empty(svc.mine)) {
            var ref = Firestore.getRef("organizations");
            var query = ref.child(organizationId);
            svc.mine = $firebaseObject(query);
            svc.mine.$loaded().
                then(function (data) {
                    if (data.length == 0) {
                        console.log("ERROR: NO ORGANIZATION FOR USER.", organizationId);
                    }
                    else {
                        console.log("FYI: Found user organization.", data.name);
                    }
                })
                .catch(function (error) {
                    console.log("ERROR: Unable to load user organization. ", error);
                });
        }
    };

    svc.loadChildOrganizations = function (organizationId) {
        console.log("o.loadChildOrganizations(start)");
        if (Utility.empty(svc.organizations) || svc.organizations.length == 0) {
            var ref = Firestore.getRef("organizations");
            var query = ref.equalTo(organizationId, 'parentId');
            svc.organizations = $firebaseArray(query);
            svc.organizations.$loaded().
                then(function (data) {
                    if (data.length == 0) {
                        console.log("FYI: No child organizations exist.", data);
                    }
                    else {
                        console.log("FYI: Found child organizations.", data);
                    }
                })
                .catch(function (error) {
                    console.log("ERROR: Unable to load child organizations. ", error);
                });
        }
    };

    svc.initialize = function () {
        console.log("Organizations initializing.");
        if (Utility.empty(svc.organizations) || svc.organizations.length == 0) {
            var ref = Firestore.getRef("organizations");
            var query = ref.limitToFirst(1);
            var fbOrgs = $firebaseArray(query);
            fbOrgs.$loaded().
                then(function (data) {
                    if (data.length == 0) { // no organizations exist, add faux data to initialize
                        angularLoad.loadScript(Installation.path() + '/organizations.js').then(function () { // has organizations array
                            if (!Utility.empty(organizations)) {
                                ref.set(organizations);
                                svc.loadUserOrganization(0);
                            }
                            console.log("FYI: faux organizations stored.", fbOrgs);
                        }).catch(function () {
                            console.log("ERROR: Unable to load faux organizations.")
                        });
                    }
                    else {
                        console.log("FYI: Some organizations exist in firebase already.");
                        svc.loadUserOrganization(0);
                        /** @todo Use logged in user org id **/
                    }
                })
                .catch(function (error) {
                    console.log("ERROR: Unable to load organizations for initialization.", error);
                });
        }
    };
});