import {Injectable} from "@angular/core";

@Injectable()
export class Globals {
    public tabMode: string = 'normal';
    public static isProduction: boolean = true;
    public debug: boolean = false;
    public showLoading: boolean = false;

    public readonly STATUS_ERROR = 'error';
    public readonly STATUS_SUCCESS = 'success';
    public readonly STATUS_WARNING = 'warning';
    public readonly STATUS_INFO = 'info';

    public readonly URL_API = '/assets/api/';
    public readonly MESSAGE_DURATION = 14000;

    public alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
}