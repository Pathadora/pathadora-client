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
    passionsData: string[] = [];
    languagesData: string[] = [];
    error = '';
    role = '';

    genders = [
        {id: "Gender_Male", label: "Maschio"},
        {id: "Gender_Female", label: "Femmina"},
        {id: "Gender_Other", label: "Altro"}
    ];

    languages = [
        {id: "Language_English", label: "Inglese"},
        {id: "Language_Italian", label: "Italiano"},
        {id: "Language_Spanish", label: "Spagnolo"},
        {id: "Language_German", label: "Tedesco"},
        {id: "Language_Hindu", label: "Hindu"}
    ];

    goals = [
        {id: "Goal_PathDriven", label: "Path Driven"},
        {id: "Goal_ScoreDriven", label: "Score Driven"},
        {id: "Goal_TimeDriven", label: "Time Driven"},
    ];

    degrees = [
        {id: "Degree_Bachelor", label: "Triennale"},
        {id: "Degree_Master", label: "Magistrale"},
        {id: "Degree_Doctoral", label: "Dottorato"}
    ];

    passions = [
        {id: "Passion_Animals", label: "Animali"},
        {id: "Passion_Art", label: "Arte"},
        {id: "Passion_Astrology", label: "Astrologia"},
        {id: "Passion_Entrepreneurship", label: "Imprenditoria"},
        {id: "Passion_Fitness", label: "Fitness"},
        {id: "Passion_Math", label: "Matematica"},
        {id: "Passion_Nature", label: "Natura"},
        {id: "Passion_Tech", label: "Tecnologia"}
    ];

    disabilities = [
        {id: "Disability_Autism_Spectrum", label: "Spettro di autismo", level: "autismSpectrumLevel", levelLabel: "Spettro di autismo"},
        {id: "Disability_Blindness", label: "Cecità", level: "blindnessLevel", levelLabel: "Cecità"},
        {id: "Disability_Brain_Injury", label: "Danni cerebrali", level: "brainInjuryLevel", levelLabel: "Danni cerebrali"},
        {id: "Disability_Development_Delay", label: "Ritardo nello sviluppo", level: "developmentDelayLevel", levelLabel: "Ritardo nello sviluppo"},
        {id: "Disability_Down_Syndrome", label: "Sindrome di Down", level: "downSyndromeLevel", levelLabel: "Sindrome di Down"},
        {id: "Disability_FASD", label: "FASD", level: "FASDLevel", levelLabel: "FASD" },
        {id: "Disability_Hearing_loss", label: "Perdita di udito", level: "hearingLossLevel", levelLabel: "Perdita di udito"},
        {id: "Disability_Multiple_Sclerosis", label: "Sclerosi multipla", level: "multipleSclerosisLevel", levelLabel: "Sclerosi multipla"},
        {id: "Disability_SCI", label: "SCI", level: "SCILevel", levelLabel: "SCI"},
        {id: "Disability_Sensory_processing", label: "Disturbi sensoriali", level: "sensoryProcessingDisabilityLevel", levelLabel: "Disturbi sensoriali"},
        {id: "Disability_X_Syndrome", label: "Sindrome X", level: "XSyndromeLevel", levelLabel: "Sindrome X" }
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
            education: ['', Validators.required],
            languages: new FormArray([], minSelectedCheckboxes(0)),
            degree: null,
            future_degree: null,
            passions: new FormArray([], minSelectedCheckboxes(0)),
            goal: null,
            disabilities: new FormArray([]),
            disabilityLevels: new FormArray([]),
            courses: new FormArray([], minSelectedCheckboxes(0)),
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });

        this.languages.forEach(() => this.languagesFormArray.push(new FormControl(false)));
        this.passions.forEach(() => this.passionsFormArray.push(new FormControl(false)));
        this.disabilities.forEach(() => {
            this.disabilitiesFormArray.push(new FormControl(false))
            this.disabilityLevelsFormArray.push(new FormControl(1))
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
    get languagesFormArray() {
        return this.registerForm.controls.languages as FormArray;
    }
    get passionsFormArray() {
        return this.registerForm.controls.passions as FormArray;
    }
    get disabilitiesFormArray() {
        return this.registerForm.controls.disabilities as FormArray;
    }
    get disabilityLevelsFormArray() {
        return this.registerForm.controls.disabilityLevels as FormArray;
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
            let selectedLanguages : string[] = this.registerForm.value.languages
                .map((checked, i) => checked ? this.languages[i].id : null)
                .filter(v => v !== null);
            let selectedPassions : string[] = this.registerForm.value.passions
                .map((checked, i) => checked ? this.passions[i].id : null)
                .filter(v => v !== null);
            let selectedDisabilities : { name?: string; level?: number; }[] = this.registerForm.value.disabilities
                .map((checked, i) => checked ? {
                    "name": this.disabilities[i].id,
                    "level": this.registerForm.value.disabilityLevels.at(i).value
                } : null)
                .filter(v => v !== null);
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
                this.f.education.value,
                selectedLanguages,
                this.f.degree.value,
                this.f.future_degree.value,
                selectedPassions,
                this.f.goal.value,
                selectedDisabilities,
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