'use strict';

angular.module('app.auth', [])
    .service('Authentication', function ($rootScope, Utility, Log, FIREBASE_URL) {
        var svc = this;
        svc.fbRootRef = new Firebase(FIREBASE_URL);
        svc.fbUsersRef = svc.fbRootRef.child("users");

        var User = function () {
            this.uid = null;
            this.provider = null;
            this.email = null;
            this.firstName = null;
            this.lastName = null;
            this.displayName = null;
            this.avatar = null;
        };

        svc.get = function(userId) {

        };

        svc.userAddOrUpdate = function (user) {
            svc.fbUsersRef.child(user.uid).once('value', function (snapshot) {
                var exists = (snapshot.val() !== null);
                var userRef = svc.fbUsersRef.child(user.uid);
                if (exists) {
                    userRef.update(user);
                }
                else {
                    userRef.set(user);
                }
            });
        };

        svc.extractAuthData = function (authData) {
            var user = null;
            try {
                if (!Utility.empty(authData)) {
                    user = new User();
                    user.provider = authData.provider;
                    user.uid = authData.uid;
                    switch (user.provider) {
                        case 'google':
                            if (!Utility.empty(authData.google)) {
                                if (!Utility.empty(authData.google.cachedUserProfile)) {
                                    user.firstName = authData.google.cachedUserProfile.given_name;
                                    user.lastName = authData.google.cachedUserProfile.family_name;
                                    user.avatar = authData.google.cachedUserProfile.picture;
                                    user.displayName = authData.google.displayName;
                                    user.email = !Utility.empty(authData.google.email) ? authData.google.email : null;
                                }
                            }
                            break;
                        case 'twitter':
                            if (!Utility.empty(authData.twitter)) {
                                if (!Utility.empty(authData.twitter.cachedUserProfile)) {
                                    user.firstName = authData.twitter.cachedUserProfile.name;
                                    if (!Utility.empty(user.firstName)) {
                                        var pos = user.firstName.indexOf(' ');
                                        if (pos > 0) {
                                            user.firstName = user.firstName.substr(0, pos);
                                        }
                                    }
                                    user.avatar = authData.twitter.cachedUserProfile.profile_image_url;
                                }
                                user.displayName = authData.twitter.displayName;
                                user.email = !Utility.empty(authData.twitter.email) ? authData.twitter.email : null;
                            }
                            break;
                        case 'facebook':
                            if (!Utility.empty(authData.facebook)) {
                                if (!Utility.empty(authData.facebook.cachedUserProfile)) {
                                    user.firstName = authData.facebook.cachedUserProfile.first_name;
                                    user.lastName = authData.facebook.cachedUserProfile.last_name;
                                    user.avatar = authData.facebook.cachedUserProfile.picture.data.url;
                                }
                                user.displayName = authData.facebook.displayName;
                                user.email = !Utility.empty(authData.facebook.email) ? authData.facebook.email : null;
                            }
                            break;
                        case 'password':
                            user.email = authData.password.email;
                            break;
                        default:
                    }
                }
            }
            catch (exception) {
                Log(exception.message);
            }
            if (!Utility.empty(user)) {
                svc.userAddOrUpdate(user);
            }
            console.log("user auth:", user);
            return user;
        };

        svc.check = function () {
            $rootScope.auth = svc.fbRootRef.getAuth();
            $rootScope.currentUser = svc.extractAuthData($rootScope.auth);
        };

        svc.loginSecondTryHandler = function (error, authData) {
            console.log("loginSecondTryHandler:: error:", error);
            console.log("loginSecondTryHandler:: authData:", authData);
            if (error == null) {
                $rootScope.currentUser = svc.extractAuthData(authData);
                $rootScope.checkSession();
            }
            $rootScope.auth = authData;
        };

        svc.loginResponseHandler = function (error, authData) {
            console.log("loginResponseHandler:: error:", error);
            console.log("loginResponseHandler:: authData:", authData);
            if (error == null) {
                $rootScope.currentUser = svc.extractAuthData(authData);
                $rootScope.checkSession();
            }
            else {
                if (error.code === "TRANSPORT_UNAVAILABLE") {
                    svc.fbRootRef.authWithOAuthRedirect(authData.provider, svc.loginSecondTryHandler, {scope: "email"});
                }
            }
            $rootScope.auth = authData;
        };

        svc.logout = function () {
            if (!Utility.empty($rootScope.auth)) {
                svc.fbRootRef.unauth();
            }
        };

        svc.login = function (loginType, email, password) {
            switch (loginType) {
                case 'google':
                case 'twitter':
                case 'facebook':
                    svc.fbRootRef.authWithOAuthPopup(loginType, svc.loginResponseHandler, {scope: "email"});
                    break;
                case 'password':
                    svc.fbRootRef.authWithPassword({email: email, password: password}, svc.loginResponseHandler);
                    break;
                default:
            }
        };
    }
)
;


