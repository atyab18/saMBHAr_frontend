import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="navbar" *ngIf="auth.currentUser() as u">
      <div>
        <a [routerLink]="u.role === 'ADMIN' ? '/admin' : '/user'">🍴 Mess Management</a>
        <ng-container *ngIf="u.role === 'USER'">
          <a routerLink="/user">Dashboard</a>
          <a routerLink="/user/orders/active">Active Orders</a>
          <a routerLink="/user/orders/history">History</a>
          <a routerLink="/user/profile">Profile</a>
        </ng-container>
        <ng-container *ngIf="u.role === 'ADMIN'">
          <a routerLink="/admin">Dashboard</a>
          <a routerLink="/admin/menu">Menu</a>
          <a routerLink="/admin/orders/active">Active Orders</a>
          <a routerLink="/admin/orders/history">History</a>
        </ng-container>
      </div>
      <div>
        <span>Hi, {{ u.name }} ({{ u.role }})</span>
        <button class="secondary small" (click)="logout()">Logout</button>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
