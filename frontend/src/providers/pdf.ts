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
                let img: any = <HTMLImageElement>this; // does not seem to remember this from creation!
                let canvas = <HTMLCanvasElement>document.getElementById('assessmentPdf');
                let context = canvas.getContext('2d');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                context.fillStyle = '#FFF';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0);
                cb(canvas.toDataURL('image/png'));
            }
            catch (exception) {
                console.error('pdf getDataUri', exception);
            }
        };
        image.src = url;
    }
}