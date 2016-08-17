import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "round"
})

export class Round implements PipeTransform {
    transform(num: number): number {
        return Math.round(num);
    }
}
