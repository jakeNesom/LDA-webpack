import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Dataset } from './definitions/dataset';

@Injectable ()
export class LoggerService {

    private loggerUrl = 'api/loggerData';

    constructor(private http: Http) {}

    getClients(): Promise<any> {
        return 
    }

    getLoggerData(): Promise <Dataset[]> {
        
        
        return this.http.get(this.loggerUrl)
            .toPromise()
            .then(response => response.json().data as Dataset[])   //do i need to declare a type for the data?
            .catch(this.handleError);
    }

    

    private handleError(error: any): Promise <any> {
        console.error('An error occured', error);
        return Promise.reject(error.message || error );
    }
}