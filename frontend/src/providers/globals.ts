import {Injectable} from "@angular/core";

@Injectable()
export class GlobalsProvider {
    public tabMode: string = 'normal';
    public static isProduction: boolean = true;
    public debug: boolean = false;
    public showLoading: boolean = false;

    public alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
}