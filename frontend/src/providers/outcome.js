"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var data_model_1 = require("./data-model");
var OutcomeProvider = (function (_super) {
    __extends(OutcomeProvider, _super);
    function OutcomeProvider(toastCtrl, http, globals, config, session) {
        _super.call(this, 'outcome', toastCtrl, http, globals, config, session);
        this.toastCtrl = toastCtrl;
        this.http = http;
        this.globals = globals;
        this.config = config;
        this.session = session;
    }
    OutcomeProvider.prototype.getTrends = function (organizationId) {
        return this.getData('/trends/' + organizationId);
    };
    OutcomeProvider.prototype.byOrganization = function (organizationId) {
        return this.getData('/byOrganization/' + organizationId + '/1');
    };
    OutcomeProvider = __decorate([
        core_1.Injectable()
    ], OutcomeProvider);
    return OutcomeProvider;
}(data_model_1.DataModel));
exports.OutcomeProvider = OutcomeProvider;
