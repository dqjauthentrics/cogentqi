"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var Globals = (function () {
    function Globals(loading, alerts, events) {
        this.loading = loading;
        this.alerts = alerts;
        this.events = events;
        this.tabMode = 'normal';
        this.debug = false;
        this.loadingObject = null;
        this.STATUS_ERROR = 'error';
        this.STATUS_SUCCESS = 'success';
        this.STATUS_WARNING = 'warning';
        this.STATUS_INFO = 'info';
        this.URL_API = '/assets/api/';
        this.MESSAGE_DURATION = 14000;
        this.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    }
    Globals.prototype.safeName = function (str) {
        if (str) {
            var name_1 = str.replace(/\W+/g, '');
            name_1 = name_1.replace(/[^a-zA-Z0-9]/g, '');
            return name_1;
        }
        return str;
    };
    Globals.prototype.findObjectById = function (items, id) {
        if (items && items.length > 0) {
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (item.id && item.id == id) {
                    return item;
                }
            }
        }
        return null;
    };
    Globals.prototype.showLoading = function (message) {
        this.loadingObject = this.loading.create({ content: message, dismissOnPageChange: true });
        this.loadingObject.present();
        return this.loadingObject;
    };
    Globals.prototype.dismissLoading = function () {
        if (this.loadingObject) {
            this.loadingObject.dismiss();
            this.loadingObject = null;
        }
    };
    Globals.prototype.alert = function (title, message, cssClass) {
        this.alerts.create({ title: title, subTitle: message, buttons: ['Dismiss'], cssClass: cssClass }).present();
    };
    Globals.prototype.alertError = function (message) {
        this.alert('Error', message, 'error');
    };
    Globals.prototype.alertWarning = function (message) {
        this.alert('Warning', message, 'warning');
    };
    Globals.prototype.alertInfo = function (message) {
        this.alert('FYI', message, 'info');
    };
    Globals.prototype.alertSuccess = function (message) {
        this.alert('Success!', message, 'success');
    };
    Globals.prototype.confirm = function (message, cbFn) {
        var alert = this.alerts.create({
            title: 'Confirmation',
            message: message,
            cssClass: 'warning',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Confirmed',
                    handler: function () {
                        cbFn();
                    }
                }
            ]
        });
        alert.present();
    };
    Globals.isProduction = true;
    Globals = __decorate([
        core_1.Injectable()
    ], Globals);
    return Globals;
}());
exports.Globals = Globals;
