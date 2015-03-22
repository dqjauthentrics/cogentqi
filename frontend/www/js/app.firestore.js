'use strict';

angular.module('app.firestore', ['firebase']).factory('Firestore', function ($firebaseArray, Installation, Utility) {
    var svc = this;
    var installation = Installation.get();
    var rootRef = new Firebase(installation.fireBaseUrl);

    return {
        getRef: function (path) {
            var ref = rootRef;
            if (!Utility.empty(path)) {
                ref = rootRef.child(path);
            }
            return ref;
        }
    }
});
