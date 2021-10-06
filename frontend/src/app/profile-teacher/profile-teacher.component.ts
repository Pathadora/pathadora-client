import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { Course } from '@app/_models';

import { AuthenticationService, CoursesService } from '@app/_services';

@Component({ selector: 'profile-teacher', templateUrl: 'profile-teacher.component.html' })
export class ProfileTeacherComponent implements OnInit {
    selectedCourse: string = "";
    loading = false;
    returnUrl: string;
    error = '';
    coursesData: Course[] = [];
    coursesTeacherData: Course[] = [];
    selectableCourses: Course[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private coursesService: CoursesService
    ) { 
        // redirect to home if current user is not a teacher
        if (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.user_role !== "teacher") { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {

        this.coursesService.getCourses()
        .pipe(first())
        .subscribe(
            data => {
                this.coursesData = data;
            },
            error => {
                this.error = error;
                this.loading = false;
        });

         this.coursesService.getCurrentTeacherCourses()
        .pipe(first())
        .subscribe(
            data => {
                this.coursesTeacherData = data;
                this.selectableCourses = this.coursesData.filter(c => !this.coursesTeacherData.find(c2 => c2._id == c._id))
            },
            error => {
                this.error = error;
                this.loading = false;
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    remove(id) {
        this.loading = true;

        this.coursesService.deleteTeacherCourse(id).pipe(first())
        .subscribe(
            data => {
                this.coursesTeacherData = data;
                this.selectableCourses = this.coursesData.filter(c => !this.coursesTeacherData.find(c2 => c2._id == c._id))
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }

    add() {
        this.loading = true;

        this.coursesService.addTeacherCourse([this.selectedCourse]).pipe(first())
        .subscribe(
            data => {
                this.coursesTeacherData = data;
                this.selectableCourses = this.coursesData.filter(c => !this.coursesTeacherData.find(c2 => c2._id == c._id))
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }
}
