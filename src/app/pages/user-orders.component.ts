import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Order } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>{{ mode === 'active' ? 'Active Orders' : 'Order History' }}</h2>
      <div class="card" *ngIf="orders.length === 0">No orders.</div>
      <div class="card" *ngFor="let o of orders">
        <div class="row">
          <div>
            <h3>{{ o.messName }}</h3>
            <p style="color:#666;margin:4px 0;">{{ o.userAddress }}</p>
            <p style="margin:4px 0;">Combo: <strong>{{ o.comboName }}</strong> × {{ o.quantity }}</p>
            <p style="margin:4px 0;">Total: ₹{{ o.totalPrice }}</p>
            <p style="margin:4px 0;font-size:12px;color:#888;">Placed: {{ o.createdAt | date:'medium' }}</p>
          </div>
          <div style="text-align:right;">
            <span class="badge" [ngClass]="{active: o.status === 'ACTIVE', done: o.status === 'COMPLETED'}">{{ o.status }}</span>
            <div *ngIf="mode === 'active'" style="margin-top:10px;">
              <p style="margin:4px 0;">Mobile: {{ o.userMobile }}</p>
              <p style="margin:4px 0;">OTP for delivery:</p>
              <h2 style="margin:0;color:#2563eb;">{{ o.otp }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];
  mode: 'active' | 'history' = 'active';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(d => {
      this.mode = (d['mode'] as 'active' | 'history') || 'active';
      this.load();
    });
  }

  load() {
    const user = this.auth.currentUser();
    if (!user) return;
    const obs = this.mode === 'active'
      ? this.api.userActive(user.userId)
      : this.api.userHistory(user.userId);
    obs.subscribe(o => this.orders = o);
  }
}
