import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService, CoursesService } from '@app/_services';
import { Course } from '@app/_models';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    coursesData: Course[] = [];
    error = '';

    genders = [
        {id: "male", label: "Maschio"},
        {id: "female", label: "Femmina"},
        {id: "other", label: "Altro"}
    ];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private coursesService: CoursesService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            lastname: ['', Validators.required],
            gender: ['', Validators.required],
            birthdate: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.required],
            courses: new FormArray([], minSelectedCheckboxes(0)),
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });

        this.route.data.subscribe(data => {
            if (data.role === "teacher") {
                this.coursesService.getCourses()
                .pipe(first())
                .subscribe(
                    data => {
                        this.coursesData = data;
                        data.forEach(() => this.coursesFormArray.push(new FormControl(false)));
                    },
                    error => {
                        this.error = error;
                        this.loading = false;
                    });
            }
        })


        // go to home
        this.returnUrl = '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    get coursesFormArray() {
        return this.registerForm.controls.courses as FormArray;
      }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        
        this.route.data.subscribe(data => {
            let selectedCoursesIds : string[] = [] 
            if (data.role === "teacher") {
                selectedCoursesIds = this.registerForm.value.courses
                .map((checked, i) => checked ? this.coursesData[i]._id : null)
                .filter(v => v !== null);
            }
            this.loading = true;
            this.authenticationService.register(this.f.name.value, this.f.lastname.value, this.f.gender.value, this.f.birthdate.value, this.f.username.value, this.f.email.value, this.f.password.value, data.role, selectedCoursesIds)
                .pipe(first())
                .subscribe(
                    data => {
                        this.router.navigate([this.returnUrl]);
                    },
                    error => {
                        this.error = error;
                        this.loading = false;
                    });
        })
    }
}

export function minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        // get a list of checkbox values (boolean)
        .map(control => control.value)
        // total up the number of checked checkboxes
        .reduce((prev, next) => next ? prev + next : prev, 0);
  
      // if the total is not greater than the minimum, return the error message
      return totalSelected >= min ? null : { required: true };
    };
  
    return validator;
  }