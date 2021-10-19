import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { User, Course, Faculty, Department } from '@app/_models';
import { UserService, CoursesService } from '@app/_services';
import { RecommenderService } from '@app/_services/recommender.service';

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
        private userService: UserService,
        private coursesService: CoursesService,
        private recommenderService: RecommenderService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
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

        // stop here if form is invalid
        if (this.secondStepForm.invalid) {
            return;
        }

        this.loading = true;
        this.recommenderService.sendRequest({

        }).subscribe(
            data => {
                this.loading = false;
                this.currentStep = 2;
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }
    /*
    secondStepSubmit() {
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
                this.currentStep = 3;
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }

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