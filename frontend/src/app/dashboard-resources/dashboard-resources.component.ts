import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from '@environments/environment';

import { Course } from '@app/_models';

import { AuthenticationService, CoursesService } from '@app/_services';

@Component({ selector: 'dashboard-resources', templateUrl: 'dashboard-resources.component.html' })
export class DashboardResourcesComponent implements OnInit {
    coursesForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    coursesData: Course[] = [];
    files: File[] = [];
    choosen = false;
    apiUrl = environment.apiUrl;
    readOnly = true;

    adaptionTypes = [
        "alternativeText",
        "audioDescription",
        "auditory_caption",
        "captions",
        "e-book",
        "haptic",
        "highContrast",
        "longDescription",
        "signLanguage",
        "transcript",
        "visual_alternativeText",
        "visual_audioDescription"
    ]

    displayTransformabilities = [
        "backgroundColour",
        "cursorPresentation",
        "fontFace",
        "fontSize",
        "fontWeight",
        "foregroundColour",
        "highlightPresentation",
        "layout",
        "letterSpacing",
        "lineHeight",
        "structurePresentation",
        "wordSpacing"
    ]

    accessModes = [
        "auditory",
        "color",
        "itemsize",
        "olfactory",
        "orientation",
        "position",
        "tactile",
        "textOnImage",
        "textual",
        "visual"
    ]

    resourceTypes = [
        "Acc_ResourceType_Audio",
        "Acc_ResourceType_Textual",
        "Acc_ResourceType_Video",
        "Acc_ResourceType_Visual",
    ]

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private coursesService: CoursesService
    ) { }

    ngOnInit() {
         this.coursesForm = this.formBuilder.group({
            resources: new FormArray([]),
         })

         this.readOnly = (this.authenticationService.currentUserValue && (this.authenticationService.currentUserValue.user_role === "admin" || this.authenticationService.currentUserValue.user_role === "teacher")) ? false : true
        
         let coursesObservable: Observable<Course[]> = EMPTY
         if (this.authenticationService.currentUserValue) {
            if (this.authenticationService.currentUserValue.user_role === "admin") {
                coursesObservable = this.coursesService.getCourses()
            } else if (this.authenticationService.currentUserValue.user_role === "teacher") {
                coursesObservable = this.coursesService.getCurrentTeacherCourses()
            }
         }

        coursesObservable
        .pipe(first())
        .subscribe(
            data => {
                this.coursesData = data;
                data.forEach(c => {
                    this.resourcesFormArray.push(this.formBuilder.group({
                        resource: new FormControl(""),
                        resourceTopic: "",
                        adaptionType: new FormArray(this.adaptionTypes.map(e => new FormControl(false))),
                        displayTransformability: new FormArray(this.displayTransformabilities.map(e => new FormControl(false))),
                        accessMode: new FormArray(this.accessModes.map(e => new FormControl(false))),
                        resourceType: null
                     }))
                    this.files.push( new File([""], "filename", { type: 'text/html' }))
                });
            },
            error => {
                this.error = error;
                this.loading = false;
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.coursesForm.controls; }

    get resourcesFormArray() {
        return this.coursesForm.controls.resources as FormArray;
    }

    resourceF(resourceIndex) {
        return (this.resourcesFormArray.controls[resourceIndex] as FormGroup).controls
    }

    resourceFValues(resourceIndex) {
        return (this.resourcesFormArray.controls[resourceIndex] as FormGroup).value
    }

    /*
    adaptionF(resourceIndex) {
        return this.resourcesFormArray.controls[resourceIndex].value.adaptionType as FormArray;
    }*/

    fileChoosen(event: any, i: number) {
        if (event.target.value) {
            this.files[i] = <File>event.target.files[0];
            this.choosen = true;
        }
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.coursesForm.invalid) {
            return;
        }

        this.coursesData.forEach((c, i) => {
            this.loading = true;
            let fd = new FormData();
            if (this.files[i]) {
                fd.append('file', this.files[i], this.files[i].name);

                let selectedAdaptionTypes = this.resourceFValues(i).adaptionType
                .map((checked, i) => checked ? this.adaptionTypes[i] : null)
                .filter(v => v !== null);
                let selectedDisplayTransformabilities = this.resourceFValues(i).displayTransformability
                .map((checked, i) => checked ? this.displayTransformabilities[i] : null)
                .filter(v => v !== null);
                let selectedAccessModes = this.resourceFValues(i).accessMode
                .map((checked, i) => checked ? this.accessModes[i] : null)
                .filter(v => v !== null);

                fd.append('courseName', c.course_name)
                fd.append('fileName', this.files[i].name)
                fd.append('resourceTopic', this.resourceFValues(i).resourceTopic)
                fd.append('adaptionType', selectedAdaptionTypes)
                fd.append('displayTransformability', selectedDisplayTransformabilities)
                fd.append('accessMode', selectedAccessModes)
                fd.append('resourceType', this.resourceFValues(i).resourceType)

                this.coursesService.addResource(c._id, fd)
                .subscribe(
                    data => {
                        this.loading = false;
                        this.router.navigate(['/']);
                    },
                    error => {
                        this.error = error;
                        this.loading = false;
                    });
            }
        })
    }
}
