import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { User, Course, Faculty, Department, Resource } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { RecommenderService } from '@app/_services/recommender.service';

@Component({ selector: 'dashboard-user', templateUrl: 'dashboard-user.component.html' })
export class DashboardUserComponent {
    secondStepForm: FormGroup;
    thirdStepForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    facultiesData: Faculty[] = [];
    departmentsData: Department[] = [];
    coursesData: Course[] = [];
    resourcesData: Resource[] = [];
    //users: User[];
    currentUser: User;
    selectedFaculty;
    selectedYear;
    currentStep = 1;

    constructor(
        private authenticationService: AuthenticationService,
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
        
        this.thirdStepForm = this.formBuilder.group({
            "course": [null, Validators.required]
        });     
    }

    // convenience getter for easy access to form fields
    get f() { return this.secondStepForm.controls; }

    get thirdStepF() { return this.thirdStepForm.controls; }

    firstStepSubmit() {
        this.submitted = true;

        this.loading = true;
        this.recommenderService.sendRequest({
            "action": "faculties_generation",
            "degree": this.currentUser.user_profile.user_degree,
            "learner": "Learner_"+ this.currentUser.user_name + "_" + this.currentUser.user_lastname
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
            "learner": "Learner_"+ this.currentUser.user_name + "_" + this.currentUser.user_lastname,
            "degree": this.currentUser.user_profile.user_degree,
            "faculty": this.f.faculty.value,
            "department": this.f.department.value,
            "year": this.f.year.value
        }).subscribe(
            data => {
                this.loading = false;
                this.selectedFaculty = this.f.faculty.value;
                this.selectedYear = this.f.year.value;
                this.currentStep = 3;
                if (data.courses) {
                    data.courses.forEach((c) => {
                        this.coursesData.push({
                            course_name: c.course,
                            course_degree: data.degree,
                            course_faculty: this.selectedFaculty,
                            course_language: c.language,
                            course_period: c.period,
                            course_cfu: c.cfu,
                            course_year: c.year,
                            course_type: c.type,
                            course_scientific_area: c.ssd,
                            course_mandatory: c.isObbligatory
                        })
                    })
                }
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
        if (this.thirdStepForm.invalid) {
            return;
        }

        this.loading = true;
        this.recommenderService.sendRequest({
            "action": "resource_generation",
            "learner": "Learner_"+ this.currentUser.user_name + "_" + this.currentUser.user_lastname,
            "degree": this.currentUser.user_profile.user_degree,
            "faculty": this.selectedFaculty,
            "year": this.selectedYear
        }).subscribe(
            data => {                
                this.loading = false;
                this.currentStep = 4;
                if (data.resources) {
                    data.resources.forEach(r => {
                        this.resourcesData.push({
                            resourceExtension: r.extension,
                            name: r.resource,
                            resourceCheckRatio: r.checkRatio,
                            resourceFontSize: r.fontSize,
                            resourceType: r.type,
                            resourceReadingEase: r.readingEase
                        })
                    })
                }
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }
}