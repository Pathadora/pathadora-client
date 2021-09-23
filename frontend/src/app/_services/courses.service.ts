import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Course } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CoursesService {
    constructor(private http: HttpClient) { }

    getCourses() {
        return this.http.get<Course[]>(`${environment.apiUrl}/courses`);
    }

    addTeacherCourse(courses : string[]) {
        return this.http.post<any>(`${environment.apiUrl}/users/courses`, { 
            user_courses: courses
        })
    }
}