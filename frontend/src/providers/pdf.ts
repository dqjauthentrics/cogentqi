import {Injectable} from "@angular/core";

declare let jsPDF;

@Injectable()
export class PDF {
    doc: any;

    constructor() {
    }

    create() {
        this.doc = new jsPDF({orientation: 'portrait', unit: 'px'});
        return this.doc;
    }

    getDataUri(url, cb) {
        let image: HTMLImageElement = new Image();
        image.onload = function () {
            try {
                let canvas = <HTMLCanvasElement>document.getElementById('assessmentPdf');
                let ctx = canvas.getContext('2d');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                ctx.fillStyle = '#FFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                canvas.getContext('2d').drawImage(this, 0, 0);
                cb(canvas.toDataURL('image/png'));
            }
            catch (exception) {
                console.error(exception);
            }
        };
        image.src = url;
    }

}