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
var assessment_1 = require("../../providers/assessment");
var AssessmentDetailPage = (function () {
    function AssessmentDetailPage(nav, navParams, assessmentData) {
        var _this = this;
        this.nav = nav;
        this.navParams = navParams;
        this.assessment = this.navParams.data;
        assessmentData.getSingle(this.assessment.id).then(function (assessment) {
            _this.assessment = assessment;
        });
    }
    AssessmentDetailPage.prototype.goToAssessment = function (assessment) {
        alert(assessment.instrument.name);
    };
    AssessmentDetailPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/assessment/detail.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.NavParams, assessment_1.AssessmentProvider])
    ], AssessmentDetailPage);
    return AssessmentDetailPage;
}());
exports.AssessmentDetailPage = AssessmentDetailPage;
