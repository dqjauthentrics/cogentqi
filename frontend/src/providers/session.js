"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var storage_1 = require("@ionic/storage");
var SessionProvider = (function () {
    function SessionProvider(toastCtrl, http, globals, config, events) {
        this.toastCtrl = toastCtrl;
        this.http = http;
        this.globals = globals;
        this.config = config;
        this.events = events;
        this.user = null;
        this.isLoggedIn = false;
        this.storage = new storage_1.Storage();
        this.loginError = 'okay';
        this.checkLogin();
    }
    SessionProvider.prototype.validate = function (jsonInfo, refresh) {
        this.loginError = null;
        if (this.globals.debug) {
            console.log('SessionProvider:validate(entry)');
        }
        if (jsonInfo && jsonInfo.data) {
            if (!jsonInfo.status) {
                if (this.globals.debug) {
                    console.log('SessionProvider:validate(logout)');
                }
                if (this.isLoggedIn) {
                    this.logout();
                }
            }
            else {
                this.user = jsonInfo.data;
                if (this.user.id) {
                    this.storage.set('user', JSON.stringify(this.user));
                    this.isLoggedIn = true;
                    if (this.globals.debug) {
                        console.log('SessionProvider:validate(logged in, published)');
                    }
                    this.events.publish('session:login');
                }
                else {
                    this.loginError = 'Unable to locate user with those credentials.';
                    this.logout();
                }
            }
        }
        else {
            if (!refresh) {
                this.loginError = 'Unable to log into server.';
            }
            if (this.isLoggedIn) {
                this.logout();
            }
        }
    };
    SessionProvider.prototype.refreshUser = function () {
        var _this = this;
        if (this.globals.debug) {
            console.log('SessionProvider:refreshUser(entry)');
        }
        return new Promise(function (resolve) {
            _this.http.post('/assets/api/session/refreshUser', null, null).subscribe(function (res) {
                var jsonResponse = res.json();
                _this.validate(jsonResponse, true);
                if (_this.globals.debug) {
                    console.log('SessionProvider:refreshUser(validated)');
                }
                resolve(jsonResponse);
            });
        });
    };
    SessionProvider.prototype.login = function (username, password) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.globals.showLoading('Logging in...');
            var data = { username: username, password: password };
            _this.http.post('/assets/api/session/login', data, null).subscribe(function (res) {
                var jsonResponse = res.json();
                _this.validate(jsonResponse, false);
                resolve(jsonResponse);
            });
        });
    };
    SessionProvider.prototype.logout = function () {
        this.isLoggedIn = false;
        this.storage.remove('user');
        this.user = null;
        if (this.globals.debug) {
            console.log('SessionProvider:logout(publish)');
        }
        this.events.publish('session:logout');
    };
    SessionProvider.prototype.checkLogin = function () {
        var _this = this;
        if (this.globals.debug) {
            console.log('SessionProvider:checkLogin(entry)');
        }
        return this.storage.get('user').then(function (value) {
            if (value) {
                _this.user = JSON.parse(value);
                if (_this.user.id) {
                    _this.isLoggedIn = true;
                    if (_this.globals.debug) {
                        console.log('SessionProvider:checkLogin(publish login)');
                    }
                    _this.events.publish('session:login');
                }
            }
            else {
                _this.isLoggedIn = false;
            }
            return value;
        });
    };
    SessionProvider = __decorate([
        core_1.Injectable()
    ], SessionProvider);
    return SessionProvider;
}());
exports.SessionProvider = SessionProvider;
