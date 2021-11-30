import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Course } from '@app/_models';

import { RecommenderService } from '@app/_services';


@Injectable({ providedIn: 'root' })
export class CoursesService {
    constructor(private http: HttpClient, private recommenderService: RecommenderService) { }

    getCourses() {
        return this.http.get<Course[]>(`${environment.apiUrl}/courses`);
    }

    updateCourse(course_id: string, body) {
        return this.http.post<Course[]>(`${environment.apiUrl}/courses/${course_id}`, body);
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

    addResource(courseId: string, formData: FormData) {
        return this.http.post<any>(`${environment.apiUrl}/courses/resource/${courseId}`, formData)
        .pipe(mergeMap(resource => {
            return this.recommenderService.sendRequest({
    			"action": "add", 
    			"type": "resource",
    			"class": "LearningObject",
    			"annotation_properties":{
        			"id": formData.get('fileName'),
        			"resourceTopic": formData.get('resourceTopic')
       			},                    
    			"object_properties": {
				    "resourceOfCourse": "Course_" + formData.get('courseName') ? formData.get('courseName').toString().replace(/ /g,"_") : "",
        			"adaptionType": JSON.parse(formData.get('adaptionType').toString()),
        			"displayTransformability": JSON.parse(formData.get('displayTransformability').toString()),
				    "AccessMode" : JSON.parse(formData.get('accessMode').toString()),
        			"resourceType": formData.get('resourceType'),
     			},
                "data_properties":{
                    "resourceFontSize" : resource.metadata.fontSize,
                    "resourceExtension": resource.metadata.extension,
                    "resourceReadingEase" : resource.metadata.readingEase,
                    "resourceContrastRatio" : resource.metadata.contrastRatio
                } 
		  })
        }));
    }

    createCourse(body: any) {
        return this.http.post<Course[]>(`${environment.apiUrl}/courses`, body)
            .pipe(mergeMap(course => {
                return this.recommenderService.sendRequest({
                        "action": "add", 
                        "type": "course",
                        "class": body.course_name.replaceAll(' ', '_'),
                        "annotation_properties":{
                            "id": body.course_name.replaceAll(' ', '_'),
                        },
                        "object_properties": {
                            "isCourseObligatory" : body.course_mandatory ? "yes" : "no",
                            "courseType": body.course_type,
                            "courseSSD": body.course_scientific_area,
                            "courseLanguage": body.course_language
                         },
                        "data_properties":{
                            "courseYear": body.course_year,
                            "coursePeriod": body.course_period,
                            "courseCFU": body.course_cfu
                        } 
                });
            }));
    }
}