import {Pipe, PipeTransform} from "@angular/core";
import {Config} from "../providers/config";

@Pipe({name: "translate"})

export class Translate implements PipeTransform {

    constructor(private config: Config) {
    }

    transform(str: string): string {
        try {
            let translated = str;
            if (this.config.translations) {
                let translations = this.config.translations[this.config.language];
                let translated = '';
                let words = str.split(' ');
                for (let i = 0; i < words.length; i++) {
                    let word = words[i];
                    translated += (i > 0 ? ' ' : '') + (translations[word] ? translations[word] : word);
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