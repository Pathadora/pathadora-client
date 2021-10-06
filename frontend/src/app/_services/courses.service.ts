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

    getCurrentTeacherCourses() {
        return this.http.get<Course[]>(`${environment.apiUrl}/users/courses`);
    }

    addTeacherCourse(courses_ids: string[]) {
        return this.http.post<any>(`${environment.apiUrl}/users/courses`, { 
            user_courses_ids: courses_ids
        })
    }

    deleteTeacherCourse(course_id: string) {
        return this.http.delete<any>(`${environment.apiUrl}/users/courses/${course_id}`)
    }

    addResource(courseId: string, file: any) {
        return this.http.post<any>(`${environment.apiUrl}/courses/resource/${courseId}`, file);
    }
}