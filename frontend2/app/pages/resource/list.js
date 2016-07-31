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
var resource_1 = require("../../providers/resource");
var detail_1 = require("./detail");
var ResourceListPage = (function () {
    function ResourceListPage(nav, resourceData) {
        var _this = this;
        this.nav = nav;
        this.resources = [];
        resourceData.getAll(null).then(function (resources) {
            _this.resources = resources;
        });
    }
    ResourceListPage.prototype.goToResourceDetail = function (resourceName) {
        this.nav.push(detail_1.ResourceDetailPage, resourceName);
    };
    ResourceListPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/resource/list.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, resource_1.ResourceProvider])
    ], ResourceListPage);
    return ResourceListPage;
}());
exports.ResourceListPage = ResourceListPage;
