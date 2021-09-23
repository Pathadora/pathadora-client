import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        // redirect to home if current user is not a teacher
        if (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.user_role !== "teacher") { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.resourceForm = // TODO

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.resourceForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.resourceForm.invalid) {
            return;
        }

        this.loading = true;
        // TODO UPLOAD
    }
}
