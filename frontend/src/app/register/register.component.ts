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
    role = '';

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
            gender: [null, Validators.required],
            birthdate: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.required],
            language: '',
            degree: null,
            future_degree: null,
            passion: '',
            active_reflective: null,
            sensing_intuitive: null,
            visual_veral: null,
            sequential_global: null,
            goal: null,
            disability: '',
            courses: new FormArray([], minSelectedCheckboxes(0)),
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });

        this.route.data.subscribe(data => {
            this.role = data.role
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
            this.authenticationService.register(
                this.f.name.value,
                this.f.lastname.value,
                this.f.gender.value,
                this.f.birthdate.value,
                this.f.username.value,
                this.f.email.value,
                this.f.password.value,
                data.role,
                this.f.language.value,
                this.f.degree.value,
                this.f.future_degree.value,
                this.f.passion.value,
                this.f.active_reflective.value,
                this.f.sensing_intuitive.value,
                this.f.visual_veral.value,
                this.f.sequential_global.value,
                this.f.goal.value,
                this.f.disability.value,
                selectedCoursesIds)
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