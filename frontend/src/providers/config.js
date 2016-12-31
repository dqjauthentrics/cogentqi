"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var Config = (function () {
    function Config(http) {
        this.http = http;
        this.appName = "NOCTI";
        this.copyright = "Copyright \u00a9 2015, PLS 3rd Learning.com.  All rights reserved.";
        this.trademarkName = "PLS 3rd Learning&#8482;";
        this.name = "Demonstration";
        this.site = '/assets/site/default';
        this.siteDir = 'default';
        this.css = this.site + '/theme.css';
        this.logoFull = '/assets/site/default/images/logoFull.png';
        this.logoHeader = '/assets/site/default/images/logoHeader.png';
        this.logoPrint = '/assets/site/default/images/logoPrint.png';
        this.isAdmin = false;
        this.language = "us-en";
        try {
            var hostname = window.location.hostname;
            var parts = hostname.split('.');
            if (parts.length >= 2 && parts[0]) {
                if (parts[0] == 'admin') {
                    this.siteDir = parts[1];
                    this.isAdmin = true;
                }
                else {
                    this.siteDir = parts[0];
                }
                this.site = '/assets/site/' + this.siteDir;
                this.css = this.site + '/theme.css';
                this.logoFull = '/assets/site/' + this.siteDir + '/images/logoFull.png';
                this.logoHeader = '/assets/site/' + this.siteDir + '/images/logoHeader.png';
                this.logoPrint = '/assets/site/' + this.siteDir + '/images/logoPrint.png';
                this.load();
            }
        }
        catch (exception) {
            console.error("CONFIGURATION ERROR:", exception);
        }
    }
    Config.checkProduction = function () {
        return window && window.location && window.location.hostname && window.location.hostname.indexOf('.com') > 0;
    };
    Config.prototype.roleName = function (roleId) {
        try {
            if (roleId && this.roles[roleId]) {
                return this.roles[roleId];
            }
        }
        catch (exception) {
            console.error("CONFIGURATION ROLE ERROR:", exception);
        }
        return roleId;
    };
    Config.prototype.load = function () {
        var _this = this;
        if (this.data) {
            return Promise.resolve(this.data);
        }
        return new Promise(function (resolve) {
            _this.http.get(_this.site + '/config.json').subscribe(function (res) {
                var jsonObject = res.json();
                if (jsonObject.copyright) {
                    _this.copyright = jsonObject.copyright;
                }
                if (jsonObject.trademarkName) {
                    _this.trademarkName = jsonObject.trademarkName;
                }
                if (jsonObject.appName) {
                    _this.appName = jsonObject.appName;
                }
                if (jsonObject.translations) {
                    _this.translations = jsonObject.translations;
                }
                if (jsonObject.roles) {
                    _this.roles = jsonObject.roles;
                }
                resolve(_this.data);
            });
        });
    };
    Config.isProduction = Config.checkProduction();
    Config = __decorate([
        core_1.Injectable()
    ], Config);
    return Config;
}());
exports.Config = Config;
