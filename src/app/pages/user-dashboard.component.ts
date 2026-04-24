import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Mess } from '../services/api.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h2>Available Messes</h2>
      <div *ngIf="messes.length === 0" class="card">No messes registered yet.</div>
      <div class="row">
        <div class="card" *ngFor="let m of messes" style="min-width: 280px;">
          <h3>{{ m.name }}</h3>
          <p style="color:#666;">{{ m.address }}</p>
          <a [routerLink]="['/user/mess', m.id]"><button>View Menu</button></a>
        </div>
      </div>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  messes: Mess[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getAllMess().subscribe(m => this.messes = m);
  }
}
