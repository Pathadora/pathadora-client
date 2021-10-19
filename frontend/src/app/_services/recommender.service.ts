import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Course } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class RecommenderService {
    constructor(private http: HttpClient) { }

    sendRequest(body: any) {
        return this.http.post<any>(`${environment.recommenderUrl}/pathadora`, body);
    }

}