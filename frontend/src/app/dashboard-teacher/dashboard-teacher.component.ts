import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { Course } from '@app/_models';

import { AuthenticationService, CoursesService } from '@app/_services';

@Component({ templateUrl: 'dashboard-teacher.component.html' })
export class DashboardTeacherComponent implements OnInit {
    resourceForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    coursesData: Course[] = [];
    files: File[] = [];
    choosen = false;

    constructor(
        private formBuilder: FormBuilder,
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
         this.resourceForm = this.formBuilder.group({
            courses: new FormArray([]),
         })

         this.coursesService.getCurrentTeacherCourses()
        .pipe(first())
        .subscribe(
            data => {
                this.coursesData = data;
                data.forEach(c => {
                    this.files.push( new File([""], "filename", { type: 'text/html' }))
                    this.coursesFormArray.push(new FormControl(""));
                });
            },
            error => {
                this.error = error;
                this.loading = false;
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.resourceForm.controls; }

    get coursesFormArray() {
        return this.resourceForm.controls.courses as FormArray;
    }

    fileChoosen(event: any, i: number) {
        if (event.target.value) {
            this.files[i] = <File>event.target.files[0];
            this.choosen = true;
        }
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.resourceForm.invalid) {
            return;
        }

        this.loading = true;

        this.coursesData.forEach((c, i) => {
            console.log(this.resourceForm.value.courses)
            let fd = new FormData();
            if (this.files[i]) {
                fd.append('file', this.files[i], this.files[i].name);
                this.coursesService.addResource(c._id, fd)
                .subscribe(
                    data => {
                        this.router.navigate([this.returnUrl]);
                    },
                    error => {
                        this.error = error;
                        this.loading = false;
                    });
            }
        })
    }
}
