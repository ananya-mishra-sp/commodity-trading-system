import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { TradeCommoditiesComponent } from './pages/trade-commodities/trade-commodities.component';
import { PastTradesComponent } from './pages/past-trades/past-trades.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user-dashboard', component: UserDashboardComponent,
    children: [
      { path: 'trade-commodities', component: TradeCommoditiesComponent },
      { path: 'past-trades', component: PastTradesComponent },
      { path: 'reports', component: ReportsComponent },
      { path: '', redirectTo: 'trade-commodities', pathMatch: 'full' } // Default view
    ]
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminAuthGuard], // ✅ Protects the admin route
  }, // Admin Dashboard
  { path: '**', redirectTo: '/', pathMatch: 'full' } // Redirect unknown routes to home
];
