"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var IconProvider = (function () {
    function IconProvider() {
    }
    IconProvider.prototype.getClass = function (name) {
        var className = name;
        var isAwesome = false;
        switch (name) {
            case 'add':
                isAwesome = true;
                className = 'plus-circle';
                break;
            case 'assessments':
            case 'assessment':
                className = 'options';
                break;
            case 'dashboard':
                className = 'pulse';
                break;
            case 'delete':
            case 'remove':
                isAwesome = true;
                className = 'minus-circle';
                break;
            case 'event':
            case 'events':
                className = 'warning';
                break;
            case 'help':
                className = 'information-circle';
                break;
            case 'instrument':
            case 'instruments':
                className = 'clipboard';
                break;
            case 'level-down':
                isAwesome = true;
                break;
            case 'level-up':
                isAwesome = true;
                break;
            case 'flag':
                isAwesome = true;
                break;
            case 'drilldown':
                className = 'chevron-right';
                isAwesome = true;
                break;
            case 'logout':
                className = 'power-off';
                break;
            case 'member':
            case 'members':
                className = 'person';
                break;
            case 'okay':
                isAwesome = true;
                className = 'thumbs-up';
                break;
            case 'not-okay':
                isAwesome = true;
                className = 'thumbs-down';
                break;
            case 'organization':
            case 'organizations':
                className = 'git-network';
                break;
            case 'people':
                className = 'people';
                break;
            case 'pdf':
                isAwesome = true;
                className = 'file-pdf-o';
                break;
            case 'bar-chart':
            case 'line-chart':
                isAwesome = true;
                break;
            case 'note':
            case 'notes':
                isAwesome = true;
                className = 'sticky-note';
                break;
            case 'spinner':
            case 'loading':
                isAwesome = true;
                className = 'refresh fa-spin';
                break;
            case 'report':
            case 'reports':
                className = 'trending-up';
                break;
            case 'resources':
            case 'resource':
                className = 'school';
                break;
            case 'save':
                isAwesome = true;
                className = 'cloud-upload';
                break;
            case 'schedule':
                className = 'calendar';
                break;
            case 'configuration':
            case 'settings':
            case 'setting':
                className = 'settings';
                break;
            case 'outcome':
            case 'outcomes':
                className = 'speedometer';
                break;
            case 'weight':
            case 'weights':
                isAwesome = true;
                className = 'balance-scale';
                break;
        }
        if (isAwesome) {
            className = 'fa fa-' + className + '';
        }
        else {
            className = 'ion-ios-' + className;
        }
        return className;
    };
    IconProvider = __decorate([
        core_1.Injectable()
    ], IconProvider);
    return IconProvider;
}());
exports.IconProvider = IconProvider;
