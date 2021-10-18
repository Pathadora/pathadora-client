import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Faculty } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class FacultiesService {
    constructor(private http: HttpClient) { }

    getFaculties() {
        return this.http.get<Faculty[]>(`${environment.apiUrl}/faculties`);
    }

    getFacultiesByDepartment(department_id: string) {
        return this.http.get<Faculty[]>(`${environment.apiUrl}/faculties/department/${department_id}`);
    }
}