import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="max-width:480px;">
      <div class="card">
        <h2>My Profile</h2>
        <form (submit)="$event.preventDefault(); save()">
          <label>Name</label>
          <input [(ngModel)]="data.name" name="name" />
          <label>Mobile number</label>
          <input [(ngModel)]="data.mobileNo" name="mobileNo" />
          <label>Password (leave blank to keep current)</label>
          <input type="password" [(ngModel)]="data.password" name="password" />
          <label>Address</label>
          <input [(ngModel)]="data.address" name="address" />
          <div *ngIf="error" class="error">{{ error }}</div>
          <div *ngIf="saved" class="success">Profile updated.</div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  data = { name: '', mobileNo: '', password: '', address: '' };
  error = '';
  saved = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    const u = this.auth.currentUser();
    if (u) {
      this.data.name = u.name;
      this.data.mobileNo = u.mobileNo;
      this.data.address = u.address || '';
    }
  }

  save() {
    this.error = '';
    this.saved = false;
    const u = this.auth.currentUser();
    if (!u) return;
    this.auth.updateProfile(u.userId, {
      name: this.data.name,
      mobileNo: this.data.mobileNo,
      password: this.data.password || undefined,
      address: this.data.address
    } as any).subscribe({
      next: () => { this.saved = true; this.data.password = ''; },
      error: e => this.error = e.error?.error || 'Update failed'
    });
  }
}
