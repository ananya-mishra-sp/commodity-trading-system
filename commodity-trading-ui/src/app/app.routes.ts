// import { Routes } from '@angular/router';
// import { HomeComponent } from './pages/home/home.component';
// import { LoginComponent } from './pages/login/login.component';
// import { RegisterComponent } from './pages/register/register.component';
// import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
// import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
// import { ReportsComponent } from './pages/reports/reports.component'; // ✅ Import Reports Component

// export const routes: Routes = [
//   { path: '', component: HomeComponent },  
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'admin-dashboard', component: AdminDashboardComponent },
//   { path: 'user-dashboard', component: UserDashboardComponent },
//   { path: 'reports', component: ReportsComponent }, // ✅ Added Reports Route
//   { path: '**', redirectTo: '', pathMatch: 'full' }  
// ];

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user-dashboard', component: UserDashboardComponent }, // User Dashboard
  { path: 'admin-dashboard', component: AdminDashboardComponent }, // Admin Dashboard
];
