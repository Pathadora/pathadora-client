import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class RecommenderService {
    constructor(private http: HttpClient) { }

    sendRequest(body: any) {
        return this.http.post<any>(`${environment.recommenderUrl}/pathadora`, JSON.stringify(body), { headers: { "Content-Type": "text/plain" }});
    }

}