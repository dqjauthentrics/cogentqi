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
var dashboard_1 = require("../dashboard/dashboard");
var help_1 = require("../help/help");
var list_1 = require("../assessment/list");
var list_2 = require("../resource/list");
var list_3 = require("../member/list");
var TabsPage = (function () {
    function TabsPage(navParams) {
        this.dashboardRoot = dashboard_1.DashboardPage;
        this.memberRoot = list_3.MemberListPage;
        this.resourceRoot = list_2.ResourceListPage;
        this.assessmentRoot = list_1.AssessmentListPage;
        this.helpRoot = help_1.helpPage;
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
    TabsPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/tabs/tabs.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams])
    ], TabsPage);
    return TabsPage;
}());
exports.TabsPage = TabsPage;
