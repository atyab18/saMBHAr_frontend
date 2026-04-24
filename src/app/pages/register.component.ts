import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="container" style="max-width: 480px; margin-top: 40px;">
      <div class="card">
        <h2>Register</h2>
        <form (submit)="$event.preventDefault(); submit()">
          <label>Name</label>
          <input [(ngModel)]="data.name" name="name" required />
          <label>Mobile number</label>
          <input [(ngModel)]="data.mobileNo" name="mobileNo" required />
          <label>Password</label>
          <input type="password" [(ngModel)]="data.password" name="password" required />
          <label>Address</label>
          <input [(ngModel)]="data.address" name="address" />
          <label>Role</label>
          <select [(ngModel)]="data.role" name="role">
            <option value="USER">User</option>
            <option value="ADMIN">Mess Admin</option>
          </select>
          <div *ngIf="data.role === 'ADMIN'">
            <label>Mess Name</label>
            <input [(ngModel)]="data.messName" name="messName" />
            <label>Mess Address (optional)</label>
            <input [(ngModel)]="data.messAddress" name="messAddress" />
          </div>
          <div *ngIf="error" class="error">{{ error }}</div>
          <button type="submit">Register</button>
        </form>
        <p style="margin-top:16px;font-size:14px;">
          Already have an account? <a routerLink="/login">Login</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  data = {
    name: '',
    mobileNo: '',
    password: '',
    address: '',
    role: 'USER' as 'USER' | 'ADMIN',
    messName: '',
    messAddress: ''
  };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.auth.register(this.data).subscribe({
      next: u => this.router.navigate([u.role === 'ADMIN' ? '/admin' : '/user']),
      error: e => this.error = e.error?.error || 'Registration failed'
    });
  }
}
