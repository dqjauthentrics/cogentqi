/// <reference types="core-js" />
import { OnChanges, OnInit, EventEmitter, ExistingProvider } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { SelectDropdownComponent } from './select-dropdown.component';
export declare const SELECT_VALUE_ACCESSOR: ExistingProvider;
export declare class SelectComponent implements ControlValueAccessor, OnInit, OnChanges {
    private S2;
    private S2_CONTAINER;
    private S2_SELECTION;
    options: Array<any>;
    theme: string;
    multiple: boolean;
    placeholder: string;
    allowClear: boolean;
    opened: EventEmitter<null>;
    closed: EventEmitter<null>;
    selected: EventEmitter<any>;
    deselected: EventEmitter<any>;
    container: any;
    selectionSpan: any;
    dropdown: SelectDropdownComponent;
    searchInput: any;
    isDisabled: boolean;
    isBelow: boolean;
    isOpen: boolean;
    hasFocus: boolean;
    width: number;
    top: number;
    left: number;
    optionValues: Array<string>;
    optionsDict: any;
    selection: Array<any>;
    value: Array<string>;
    onChange: (_: any) => void;
    onTouched: () => void;
    /***************************************************************************
     * Event handlers.
     **************************************************************************/
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    onSelectionClick(event: any): void;
    /**
     * Event handler of the single select clear (x) button click. It is assumed
     * that there is exactly one item selected.
     *
     * The `deselect` method is used instead of `clear`, to heve the deselected
     * event emitted.
     */
    onClearClick(event: any): void;
    onClearItemClick(event: any): void;
    onToggleSelect(optionValue: any): void;
    onClose(focus: any): void;
    onWindowClick(): void;
    onWindowResize(): void;
    onKeydown(event: any): void;
    onInput(event: any): void;
    onSearchKeydown(event: any): void;
    /***************************************************************************
     * Initialization.
     **************************************************************************/
    init(): void;
    initOptions(): void;
    initDefaults(): void;
    /***************************************************************************
     * Dropdown toggle.
     **************************************************************************/
    toggleDropdown(): void;
    open(): void;
    close(focus: boolean): void;
    /***************************************************************************
     * Select.
     **************************************************************************/
    toggleSelect(value: string): void;
    select(value: string): void;
    deselect(value: string): void;
    updateSelection(): void;
    popSelect(): void;
    clear(): void;
    getOutputValue(): any;
    /***************************************************************************
     * ControlValueAccessor interface methods.
     **************************************************************************/
    writeValue(value: any): void;
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: () => void): void;
    /***************************************************************************
     * Keys.
     **************************************************************************/
    private KEYS;
    handleKeyDown(event: any): void;
    handleInput(event: any): void;
    handleSearchKeyDown(event: any): void;
    /***************************************************************************
     * Layout/Style/Classes/Focus.
     **************************************************************************/
    focus(): void;
    blur(): void;
    updateWidth(): void;
    updatePosition(): void;
    getContainerClass(): any;
    getSelectionClass(): any;
    showPlaceholder(): boolean;
    getPlaceholder(): string;
    getInputStyle(): any;
}
