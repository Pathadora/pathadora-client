import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { User, Course, Faculty, Department } from '@app/_models';
import { AuthenticationService, UserService, CoursesService } from '@app/_services';
import { RecommenderService } from '@app/_services/recommender.service';
import { ObjectUnsubscribedError } from 'rxjs';

@Component({ selector: 'dashboard-user', templateUrl: 'dashboard-user.component.html' })
export class DashboardUserComponent {
    secondStepForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    facultiesData: Faculty[] = [];
    departmentsData: Department[] = [];
    coursesData: Course[] = [];
    //users: User[];
    currentUser: User;
    currentStep = 1;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private coursesService: CoursesService,
        private recommenderService: RecommenderService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.currentUser = this.authenticationService.currentUserValue;

        this.secondStepForm = this.formBuilder.group({
            "faculty": [null, Validators.required],
            "department": [null, Validators.required],
            "year": [null, Validators.required],
        });        
    }

    // convenience getter for easy access to form fields
    get f() { return this.secondStepForm.controls; }


    firstStepSubmit() {
        this.submitted = true;

        this.loading = true;
        this.recommenderService.sendRequest({
            "action": "faculties_generation",
            "degree": this.currentUser.user_profile.user_degree,
            "learner": this.currentUser.user_name + " " + this.currentUser.user_lastname
        }).subscribe(
            data => {
                this.loading = false;
                this.currentStep = 2;
                if (data.data) {
                    data.data.forEach((d) => {
                        this.departmentsData.push({
                            department_name: d.department
                        })
                        if (d.faculties) {
                            d.faculties.forEach((f) => {
                                this.facultiesData.push({
                                    faculty_name: f,
                                    faculty_department: d.department
                                })
                            })
                        }
                    })
                }
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }

    secondStepSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.secondStepForm.invalid) {
            return;
        }

        this.loading = true;
        this.recommenderService.sendRequest({
            "action": "course_generation",
            "learner": this.currentUser.user_name + " " + this.currentUser.user_lastname,
            "faculty": this.f.faculty.value,
            "department": this.f.department.value,
            "year": this.f.year.value
        }).subscribe(
            data => {
                this.loading = false;
                this.currentStep = 3;
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }
/*
    thirdStepSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.learningPathForm.invalid) {
            return;
        }

        this.loading = true;
        this.recommenderService.sendRequest({

        }).subscribe(
            data => {
                this.loading = false;
                this.currentStep = 4;
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        ); 
    }*/
}