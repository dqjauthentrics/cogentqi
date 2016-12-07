/// <reference types="core-js" />
import { AfterViewInit, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { DiacriticsService } from './diacritics.service';
export declare class SelectDropdownComponent implements AfterViewInit, OnChanges, OnInit {
    private diacriticsService;
    private MSG_LOADING;
    private MSG_NOT_FOUND;
    private S2;
    private S2_RESULTS;
    private S2_MSG;
    private S2_OPTIONS;
    private S2_OPTION;
    private S2_OPTION_HL;
    multiple: boolean;
    optionValues: Array<string>;
    optionsDict: any;
    selection: Array<any>;
    width: number;
    top: number;
    left: number;
    close: EventEmitter<boolean>;
    toggleSelect: EventEmitter<string>;
    input: any;
    optionsList: any;
    optionValuesFiltered: Array<string>;
    _highlighted: any;
    constructor(diacriticsService: DiacriticsService);
    /***************************************************************************
     * Event handlers.
     **************************************************************************/
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    ngAfterViewInit(): void;
    onInputClick(event: any): void;
    onOptionsMouseMove(event: any): void;
    onOptionsWheel(event: any): void;
    onOptionsClick(event: any): void;
    onKeydown(event: any): void;
    onInput(event: any): void;
    /***************************************************************************
     * Initialization.
     **************************************************************************/
    private init();
    /***************************************************************************
     * Highlight.
     **************************************************************************/
    readonly highlighted: any;
    private initHighlight();
    private highlight(optionValue);
    private ensureHighlightedVisible();
    private highlightIndex();
    /***************************************************************************
     * Filter.
     **************************************************************************/
    filter(term: string): void;
    /***************************************************************************
     * Keys/scroll.
     **************************************************************************/
    private KEYS;
    private handleKeyDown(event);
    private handleOptionsWheel(event);
    highlightPrevious(): void;
    highlightNext(): void;
    /***************************************************************************
     * Classes.
     **************************************************************************/
    private getOptionClass(optionValue);
    /***************************************************************************
     * Util functions.
     **************************************************************************/
    private filteredOptionsIndex(optionValue);
}
