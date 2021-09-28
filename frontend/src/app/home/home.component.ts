import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { User, Course } from '@app/_models';
import { UserService, CoursesService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    learningPathForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    coursesData: Course[] = [];
    //users: User[];
    currentUser: User;

    constructor(
        private userService: UserService,
        private coursesService: CoursesService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.learningPathForm = this.formBuilder.group({
            "passion": '',
            "period": '',
            "language": '',
            "presence": '',
            "max-courses": '',
            "courses-to-avoid": new FormArray([]),
            "courses-to-include": new FormArray([]),
            "active-reflective": '',
            "sensing-intuitive": '',
            "visual-veral": '',
            "sequential-global": '',
            "knowledge-background": '',
            "user-goal": ''
        });

        this.coursesService.getCourses()
        .pipe(first())
        .subscribe(
            data => {
                this.coursesData = data;
                data.forEach(() => {
                    this.coursesToAvoidFormArray.push(new FormControl(false))
                    this.coursesToIncludeFormArray.push(new FormControl(false))
                });
            },
            error => {
                this.error = error;
                this.loading = false;
            });

        this.loading = true;
        /*  this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        }); */
        this.userService.getCurrentUser().pipe(first()).subscribe(user => {
            this.loading = false;
            this.currentUser = user;
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.learningPathForm.controls; }

    get coursesToAvoidFormArray() {
        return this.learningPathForm.controls["courses-to-avoid"] as FormArray;
    }

    get coursesToIncludeFormArray() {
        return this.learningPathForm.controls["courses-to-include"] as FormArray;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.learningPathForm.invalid) {
            return;
        }

        this.loading = true;
        // TODO learning path
    }
}