import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { Course, Faculty } from '@app/_models';

import { CoursesService, FacultiesService } from '@app/_services';

@Component({ selector: 'dashboard-new-course', templateUrl: 'dashboard-new-course.component.html'})
export class DashboardNewCourseComponent implements OnInit {
    courseForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    coursesData: Course[] = [];
    facultiesData: Faculty[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private coursesService: CoursesService,
        private facultiesService: FacultiesService
    ) { }

    ngOnInit() {
        this.courseForm = this.formBuilder.group({
            "course_name": ['', Validators.required],
            "course_degree": [null, Validators.required],
            "course_faculty": [null, Validators.required],
            "course_language": ['', Validators.required],
            "course_period": [null, Validators.required],
            "course_cfu": [0, Validators.required],
            "course_year": [null, Validators.required],
            "course_type": ['', Validators.required],
            "course_scientific_area": ['', Validators.required],
            "course_mandatory": [false, Validators.required],
            "course_start_date": ['', Validators.required],
            "course_end_date": ['', Validators.required],
            "course_description": ['', Validators.required]
        })

        this.facultiesService.getFaculties()
        .pipe(first())
        .subscribe(
            data => {
                this.facultiesData = data;
            },
            error => {
                this.error = error;
                this.loading = false;
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.courseForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.courseForm.invalid) {
            return;
        }

        this.loading = true;
        this.coursesService.createCourse({
            "course_name": this.f["course_name"].value,
            "course_degree": this.f["course_degree"].value,
            "course_faculty": this.f["course_faculty"].value,
            "course_language":this.f["course_language"].value,
            "course_period": this.f["course_period"].value,
            "course_cfu": this.f["course_cfu"].value,
            "course_year": this.f["course_year"].value,
            "course_type": this.f["course_type"].value,
            "course_scientific_area": this.f["course_scientific_area"].value,
            "course_mandatory": this.f["course_mandatory"].value,
            "course_start_date": this.f["course_start_date"].value,
            "course_end_date": this.f["course_end_date"].value,
            "course_description": this.f["course_description"].value
        })
        .subscribe(
            data => {
                this.loading = false;
                this.router.navigate(['/']);
            },
            error => {
                this.error = error;
                this.loading = false;
            }
        );
    }
}
