import {Pipe, PipeTransform} from '@angular/core';
import {Config} from '../providers/config';
import {isUndefined} from 'util';

@Pipe({name: "translate"})

export class Translate implements PipeTransform {

    constructor(private config: Config) {
    }

    transform(str: string): string {
        try {
            let translated = str;
            if (!isUndefined(str) && str && this.config.translations) {
                let translations = this.config.translations[this.config.language];
                translated = str;
                for (let key in translations) {
                    if (translations.hasOwnProperty(key)) {
                        translated = translated.replace(key, translations[key]);
                    }
                }
            }
            return translated;
        }
        catch (exception) {
            console.error('TRANSLATION ERROR', exception);
        }
        if (str) {
            return str;
        }
        return '';
    }
}