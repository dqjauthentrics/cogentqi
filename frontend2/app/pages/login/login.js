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
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var ng2_translate_1 = require("ng2-translate/ng2-translate");
var tabs_1 = require("../tabs/tabs");
var user_1 = require("../../providers/user");
var config_1 = require("../../providers/config");
var LoginPage = (function () {
    function LoginPage(nav, translate, userData, config) {
        this.nav = nav;
        this.translate = translate;
        this.userData = userData;
        this.config = config;
        this.login = {};
        this.submitted = false;
    }
    LoginPage.prototype.onLogin = function (form) {
        this.submitted = true;
        if (form.valid) {
            this.userData.login(this.login.username, this.login.password);
            this.nav.push(tabs_1.TabsPage);
        }
    };
    LoginPage.prototype.onLogout = function () {
        this.userData.logout();
        this.nav.push(tabs_1.TabsPage);
    };
    LoginPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/login/login.html',
            pipes: [ng2_translate_1.TranslatePipe]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ng2_translate_1.TranslateService, user_1.UserProvider, config_1.Config])
    ], LoginPage);
    return LoginPage;
}());
exports.LoginPage = LoginPage;
