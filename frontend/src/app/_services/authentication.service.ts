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
        language: string,
        degree: string,
        future_degree: string,
        passion: string,
        active_reflective: string,
        sensing_intuitive: string,
        visual_veral: string,
        sequential_global: string,
        goal: string,
        disability: string,
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
                user_language: language,
                user_degree: degree,
                user_future_degree: future_degree,
                user_passion: passion,
                user_learning_style: {
                    active_reflective: active_reflective,
                    sensing_intuitive: sensing_intuitive,
                    visual_veral: visual_veral,
                    sequential_global: sequential_global,
                },
                user_goal: goal,
                user_disability: disability
            },
            user_courses: courses
        })
        .pipe(mergeMap(user => {
            if (role === "user") {
                this.http.post<any>(`${environment.recommenderUrl}/pathadora`, {
                    "action": "add", 
                    "type": "learner",
                    "class": "Learner",
                    "annotation_properties":{
                        "name": name,
                        "last_name": lastname,
                        "birthdate": birthdate,
                        "gender": gender,
                        "language": language,
                        "degree": degree,
                        "future_degree": future_degree,
                        "passion": passion,
                        "learning_style": {
                            "1": active_reflective,
                            "2": sensing_intuitive,
                            "3": visual_veral,
                            "4": sequential_global,
                        },
                        "goal": goal,
                        "disability": disability
                    },
                    "object_properties":{
                        "canRead": "yes",
                        "canWrite": "yes"
                    } 
                })
            }
            return this.login(username, password);
        }));
    }
}