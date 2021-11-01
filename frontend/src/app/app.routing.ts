import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { DashboardCoursesComponent } from './dashboard-courses';
import { ProfileTeacherComponent } from './profile-teacher';
import { DashboardNewCourseComponent } from './dashboard-new-course';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent, data : {
        "role" : "user"
    } },
    { path: 'register-teacher', component: RegisterComponent, data : {
        "role" : "teacher"
    }  },
    { path: 'profile-teacher', component: ProfileTeacherComponent, canActivate: [AuthGuard], data : {
        "role" : "teacher"
    }  },
    { path: 'dashboard-courses', component: DashboardCoursesComponent, canActivate: [AuthGuard] },
    { path: 'new-course', component: DashboardNewCourseComponent, canActivate: [AuthGuard], data : {
        "role" : "admin"
    } },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' });