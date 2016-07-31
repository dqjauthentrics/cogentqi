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
var user_1 = require("../../providers/user");
var config_1 = require("../../providers/config");
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var list_1 = require("../resource/list");
var matrix_1 = require("../matrix/matrix");
var DashboardPage = (function () {
    function DashboardPage(config, nav, navParams, user) {
        this.config = config;
        this.nav = nav;
        this.navParams = navParams;
        this.user = user;
    }
    DashboardPage.prototype.goToPage = function (pageName) {
        var page = matrix_1.MatrixPage;
        switch (pageName) {
            case 'resources':
                page = list_1.ResourceListPage;
        }
        this.nav.push(page);
    };
    DashboardPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/dashboard/dashboard.html',
        }), 
        __metadata('design:paramtypes', [config_1.Config, ionic_angular_1.NavController, ionic_angular_1.NavParams, user_1.UserProvider])
    ], DashboardPage);
    return DashboardPage;
}());
exports.DashboardPage = DashboardPage;
