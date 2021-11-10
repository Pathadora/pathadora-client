import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/auth`, { user_username: username, user_password: password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    register(name: string,
        lastname: string,
        gender: string,
        birthdate: string,
        username: string,
        email: string,
        password: string,
        role: string,
        education: string,
        languages: string[],
        degree: string,
        future_degree: string,
        passions: string[],
        goal: string,
        disabilities: {
            name?: string;
            level?: number;
        }[],
        courses: string[] = []) {
        return this.http.post<any>(`${environment.apiUrl}/users/register`, { 
            user_name: name,
            user_lastname: lastname,
            user_gender: gender,
            user_birthDate: birthdate,
            user_username: username,
            user_email: email,
            user_password: password,
            user_role: role,
            user_profile: {
                user_education: education,
                user_languages: languages,
                user_degree: degree,
                user_future_degree: future_degree,
                user_passions: passions,
                user_goal: goal,
                user_disabilities: disabilities
            },
            user_courses: courses
        })
        .pipe(mergeMap(user => {
            if (role === "user") {
                this.http.post<any>(`${environment.recommenderUrl}/pathadora`, {
                    "action": "add", 
                    "type": "learner",
                    "class": "Learner",
                    "annotation_properties": {
                        "id": `Learner_${name}_${lastname}`,
                        "hasName": name,
                        "hasSurname": lastname,
                        "hasEducation": education,
                        "birthdate": birthdate
                    },
                    "object_properties": {
                        "gender": gender,
                        "speaks": languages,
                        "hasGoals": goal,
                        "degree": degree,
                        "future_degree": future_degree,
                        "passionateOf": passions,
                        "hasDisability": disabilities.map(d => d.name)
                     },
                     "data_properties": {
                        "autismSpectrumLevel": disabilities.filter(d => d.name === "Disability_Autism_Spectrum").map(d => d.level).reduce((x,y) => x),
                        "blindnessLevel": disabilities.filter(d => d.name === "Disability_Blindness").map(d => d.level).reduce((x,y) => x),
                        "brainInjuryLevel": disabilities.filter(d => d.name === "Disability_Brain_Injury").map(d => d.level).reduce((x,y) => x),
                        "developmentDelayLevel": disabilities.filter(d => d.name === "Disability_Development_Delay").map(d => d.level).reduce((x,y) => x),
                        "downSyndromeLevel": disabilities.filter(d => d.name === "Disability_Down_Syndrome").map(d => d.level).reduce((x,y) => x),
                        "FASDLevel": disabilities.filter(d => d.name === "Disability_FASD").map(d => d.level).reduce((x,y) => x),
                        "hearingLossLevel": disabilities.filter(d => d.name === "Disability_Hearing_loss").map(d => d.level).reduce((x,y) => x),
                        "multipleSclerosisLevel": disabilities.filter(d => d.name === "Disability_Multiple_Sclerosis").map(d => d.level).reduce((x,y) => x),
                        "SCILevel": disabilities.filter(d => d.name === "Disability_SCI").map(d => d.level).reduce((x,y) => x),
                        "sensoryProcessingDisabilityLevel": disabilities.filter(d => d.name === "Disability_Sensory_processing").map(d => d.level).reduce((x,y) => x),
                        "XSyndromeLevel": disabilities.filter(d => d.name === "Disability_X_Syndrome").map(d => d.level).reduce((x,y) => x)
                     }
                })
            }
            return this.login(username, password);
        }));
    }
}