import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { DashboardTeacherComponent } from './dashboard-teacher';
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
    { path: 'dashboard-teacher', component: DashboardTeacherComponent, canActivate: [AuthGuard], data : {
        "role" : "teacher"
    } },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);