import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { UserDashboardComponent } from './pages/user-dashboard.component';
import { MessMenuComponent } from './pages/mess-menu.component';
import { UserOrdersComponent } from './pages/user-orders.component';
import { ProfileComponent } from './pages/profile.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { MenuManagementComponent } from './pages/menu-management.component';
import { AdminOrdersComponent } from './pages/admin-orders.component';
import { authGuard, roleGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'user', component: UserDashboardComponent, canActivate: [authGuard, roleGuard('USER')] },
  { path: 'user/mess/:id', component: MessMenuComponent, canActivate: [authGuard, roleGuard('USER')] },
  { path: 'user/orders/active', component: UserOrdersComponent, data: { mode: 'active' }, canActivate: [authGuard, roleGuard('USER')] },
  { path: 'user/orders/history', component: UserOrdersComponent, data: { mode: 'history' }, canActivate: [authGuard, roleGuard('USER')] },
  { path: 'user/profile', component: ProfileComponent, canActivate: [authGuard, roleGuard('USER')] },

  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, roleGuard('ADMIN')] },
  { path: 'admin/menu', component: MenuManagementComponent, canActivate: [authGuard, roleGuard('ADMIN')] },
  { path: 'admin/orders/active', component: AdminOrdersComponent, data: { mode: 'active' }, canActivate: [authGuard, roleGuard('ADMIN')] },
  { path: 'admin/orders/history', component: AdminOrdersComponent, data: { mode: 'history' }, canActivate: [authGuard, roleGuard('ADMIN')] },

  { path: '**', redirectTo: 'login' }
];
