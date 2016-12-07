"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var select_component_1 = require('./src/select.component');
var select_dropdown_component_1 = require('./src/select-dropdown.component');
var diacritics_service_1 = require('./src/diacritics.service');
var SelectModule = (function () {
    function SelectModule() {
    }
    SelectModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        select_component_1.SelectComponent,
                        select_dropdown_component_1.SelectDropdownComponent
                    ],
                    exports: [
                        select_component_1.SelectComponent
                    ],
                    imports: [
                        common_1.CommonModule,
                        forms_1.FormsModule
                    ],
                    providers: [
                        diacritics_service_1.DiacriticsService
                    ]
                },] },
    ];
    /** @nocollapse */
    SelectModule.ctorParameters = [];
    return SelectModule;
}());
exports.SelectModule = SelectModule;
