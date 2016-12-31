"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var OutcomeListPage = (function () {
    function OutcomeListPage(nav, session, outcomeProvider, icon) {
        var _this = this;
        this.nav = nav;
        this.session = session;
        this.outcomeProvider = outcomeProvider;
        this.icon = icon;
        this.outcomes = [];
        this.loading = false;
        this.filterQuery = "";
        this.rowsOnPage = 5;
        this.sortBy = "orderedOn";
        this.sortOrder = "desc";
        this.loading = true;
        outcomeProvider.byOrganization(session.user.organizationId).then(function (outcomes) {
            _this.outcomes = outcomes;
            _this.loading = false;
        });
    }
    OutcomeListPage = __decorate([
        core_1.Component({
            templateUrl: 'list.html'
        })
    ], OutcomeListPage);
    return OutcomeListPage;
}());
exports.OutcomeListPage = OutcomeListPage;
