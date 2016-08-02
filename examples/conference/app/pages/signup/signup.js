"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var tabs_1 = require('../tabs/tabs');
var user_data_1 = require('../../providers/user-data');
var SignupPage = (function () {
    function SignupPage(nav, userData) {
        this.nav = nav;
        this.userData = userData;
        this.signup = {};
        this.submitted = false;
    }
    SignupPage.prototype.onSignup = function (form) {
        this.submitted = true;
        if (form.valid) {
            this.userData.signup(this.signup.username);
            this.nav.push(tabs_1.TabsPage);
        }
    };
    SignupPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/signup/signup.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, user_data_1.UserData])
    ], SignupPage);
    return SignupPage;
}());
exports.SignupPage = SignupPage;
