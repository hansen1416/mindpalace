/**
 * Created by hlz on 17-2-13.
 */
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

let webWorkerService = require('angular2-web-worker');

@Injectable()
export class WebSpaceService {

    constructor(
        private http: Http
    ) {}


    private contentBody: any;

    
    getContent(url: string) {

        console.log(webWorkerService.WebWorkerService);

        let doctype = document.implementation.createDocumentType('html', '', '');
        let doc    = document.implementation.createDocument('', 'html', doctype);

        doc.documentElement.innerHTML = '<head></head><body></body>';

        this.contentBody = doc.documentElement.querySelector('body');

        this.http.get(url)
            .catch((error: any) => Observable.throw(error.json() || 'request url failed'))
            .subscribe(
                (response) => {
                    this.analyzeContent(response);
                }
            )
    }


    private analyzeContent(response) {

        /**
         * request successful
         */
        if (response.status = 200) {

            let text = response.text();

            // console.log(text);
            
            let match = text.match(/<body(.*?)<\/body>/gi);

            console.log(match);


            // this.contentBody.innerHTML = response.text();
            //
            // console.log(this.contentBody);
        } else {
            throw new Error('request failed, code ' + response.status + ' ' + response.statusText);
        }
    }

}