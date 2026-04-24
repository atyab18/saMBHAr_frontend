import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="container" style="max-width: 420px; margin-top: 60px;">
      <div class="card">
        <h2>Login</h2>
        <form (submit)="$event.preventDefault(); submit()">
          <label>Mobile number</label>
          <input [(ngModel)]="mobileNo" name="mobileNo" required />
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" required />
          <div *ngIf="error" class="error">{{ error }}</div>
          <button type="submit">Login</button>
        </form>
        <p style="margin-top:16px;font-size:14px;">
          New user? <a routerLink="/register">Register here</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  mobileNo = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.auth.login(this.mobileNo, this.password).subscribe({
      next: u => this.router.navigate([u.role === 'ADMIN' ? '/admin' : '/user']),
      error: e => this.error = e.error?.error || 'Login failed'
    });
  }
}
