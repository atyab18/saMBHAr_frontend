import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Order } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>{{ mode === 'active' ? 'Active Orders' : 'Order History' }}</h2>
      <div class="card" *ngIf="orders.length === 0">No orders.</div>
      <div class="card" *ngFor="let o of orders">
        <div class="row">
          <div>
            <h3>{{ o.userName }}</h3>
            <p style="margin:4px 0;">Mobile: {{ o.userMobile }}</p>
            <p style="margin:4px 0;">Address: {{ o.userAddress }}</p>
            <p style="margin:4px 0;">Combo: <strong>{{ o.comboName }}</strong> × {{ o.quantity }}</p>
            <p style="margin:4px 0;">Total: ₹{{ o.totalPrice }}</p>
            <p style="margin:4px 0;font-size:12px;color:#888;">Placed: {{ o.createdAt | date:'medium' }}</p>
          </div>
          <div style="min-width:220px;">
            <span class="badge" [ngClass]="{active: o.status === 'ACTIVE', done: o.status === 'COMPLETED'}">{{ o.status }}</span>
            <div *ngIf="mode === 'active'" style="margin-top:12px;">
              <label>Enter OTP to confirm delivery</label>
              <input maxlength="4" [(ngModel)]="otpInput[o.orderId]" placeholder="4-digit OTP" />
              <button class="small" (click)="verify(o)">Confirm Delivery</button>
              <div *ngIf="errors[o.orderId]" class="error">{{ errors[o.orderId] }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  mode: 'active' | 'history' = 'active';
  otpInput: { [id: number]: string } = {};
  errors: { [id: number]: string } = {};

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
    const u = this.auth.currentUser();
    if (!u || !u.messId) return;
    const obs = this.mode === 'active'
      ? this.api.messActive(u.messId)
      : this.api.messHistory(u.messId);
    obs.subscribe(o => this.orders = o);
  }

  verify(o: Order) {
    const otp = (this.otpInput[o.orderId] || '').trim();
    if (otp.length !== 4) {
      this.errors[o.orderId] = 'Please enter a 4-digit OTP';
      return;
    }
    this.errors[o.orderId] = '';
    this.api.verifyOtp(o.orderId, otp).subscribe({
      next: () => this.load(),
      error: e => this.errors[o.orderId] = e.error?.error || 'Verification failed'
    });
  }
}
