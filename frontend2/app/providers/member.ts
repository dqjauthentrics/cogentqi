import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class MemberData {
    data: any;

    constructor(private http: Http) {
    }

    load() {
        if (this.data) {
            //console.log('loading members');
            return Promise.resolve(this.data);
        }
        return new Promise(resolve => {
            this.http.get('/api3/member/index/2/1/0').subscribe(res => {
                var jsonResponse = res.json();
                this.data = jsonResponse.data;
                //console.log('members retrieved:', this.data);
                resolve(this.data);
            });
        });
    }

    getMembers() {
        return this.load().then(data => this.data);
    }

    loadProfile(memberId) {
        console.log('loading member:', memberId);
        return new Promise(resolve => {
            this.http.get('/api3/member/getProfile/' + memberId).subscribe(res => {
                //console.log('parsing', res);
                var jsonResponse = res.json();
                //console.log('done parsing');
                this.data = jsonResponse.data;
                //console.log('member retrieved:', this.data);
                resolve(this.data);
            });
        });
    }

    getProfile(memberId) {
        return this.loadProfile(memberId).then(data => this.data);
    }

}
