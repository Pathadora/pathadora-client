import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { Course, Faculty } from '@app/_models';

import { AuthenticationService, CoursesService, FacultiesService } from '@app/_services';

@Component({ selector: 'dashboard-courses', templateUrl: 'dashboard-courses.component.html', providers: [DatePipe] })
export class DashboardCoursesComponent implements OnInit {
    courseForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    coursesData: Course[] = [];
    facultiesData: Faculty[] = [];
    readOnly = true;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private coursesService: CoursesService,
        private facultiesService: FacultiesService,
        private datePipe: DatePipe
    ) { }

    ngOnInit() {
        this.courseForm = this.formBuilder.group({
            courses: new FormArray([]),
        })

        this.readOnly = (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.user_role === "admin") ? false : true

        this.coursesService.getCourses()
        .pipe(first())
        .subscribe(
            data => {
                this.coursesData = data;
                data.forEach(c => {
                    this.coursesFormArray.push(this.formBuilder.group({
                        "course_name": c.course_name,
                        "course_degree": c.course_degree,
                        "course_faculty": c.course_faculty,
                        "course_language": c.course_language,
                        "course_period": c.course_period,
                        "course_cfu": c.course_cfu,
                        "course_year": c.course_year,
                        "course_type": c.course_type,
                        "course_scientific_area": c.course_scientific_area,
                        "course_mandatory": c.course_mandatory,
                        "course_start_date": this.datePipe.transform(c.course_start_date, 'yyyy-MM-dd'),
                        "course_end_date": this.datePipe.transform(c.course_end_date, 'yyyy-MM-dd'),
                        "course_description": c.course_description
                    }));
                });
            },
            error => {
                this.error = error;
                this.loading = false;
        });

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

    get coursesFormArray() {
        return this.courseForm.controls.courses as FormArray;
    }

    courseFormGroup(i) {
        return (this.coursesFormArray.controls[i] as FormGroup).controls
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.courseForm.invalid) {
            return;
        }

        this.coursesData.forEach((c, i) => {
            this.loading = true;
            this.coursesService.updateCourse(c._id, {
                "course_name": this.courseFormGroup(i)["course_name"].value,
                "course_degree": this.courseFormGroup(i)["course_degree"].value,
                "course_faculty": this.courseFormGroup(i)["course_faculty"].value,
                "course_language":this.courseFormGroup(i)["course_language"].value,
                "course_period": this.courseFormGroup(i)["course_period"].value,
                "course_cfu": this.courseFormGroup(i)["course_cfu"].value,
                "course_year": this.courseFormGroup(i)["course_year"].value,
                "course_type": this.courseFormGroup(i)["course_type"].value,
                "course_scientific_area": this.courseFormGroup(i)["course_scientific_area"].value,
                "course_mandatory": this.courseFormGroup(i)["course_mandatory"].value,
                "course_start_date": this.courseFormGroup(i)["course_start_date"].value,
                "course_end_date": this.courseFormGroup(i)["course_end_date"].value,
                "course_description": this.courseFormGroup(i)["course_description"].value
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
        })
    }
}
