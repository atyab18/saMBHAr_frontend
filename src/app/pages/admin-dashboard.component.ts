import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Order } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h2>Admin Dashboard</h2>
      <div class="row">
        <div class="card">
          <h3>{{ activeCount }}</h3>
          <p>Active orders</p>
          <a routerLink="/admin/orders/active"><button class="small">View</button></a>
        </div>
        <div class="card">
          <h3>{{ historyCount }}</h3>
          <p>Completed orders</p>
          <a routerLink="/admin/orders/history"><button class="small">View</button></a>
        </div>
        <div class="card">
          <h3>Menu</h3>
          <p>Manage your combos</p>
          <a routerLink="/admin/menu"><button class="small">Manage</button></a>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  activeCount = 0;
  historyCount = 0;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    const u = this.auth.currentUser();
    if (!u || !u.messId) return;
    this.api.messActive(u.messId).subscribe(o => this.activeCount = o.length);
    this.api.messHistory(u.messId).subscribe(o => this.historyCount = o.length);
  }
}
