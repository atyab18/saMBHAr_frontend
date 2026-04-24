import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Mess, MenuItem } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mess-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="card" *ngIf="mess">
        <h2>{{ mess.name }}</h2>
        <p style="color:#666;">{{ mess.address }}</p>
      </div>

      <div class="card">
        <h3>Menu</h3>
        <div *ngIf="menu.length === 0">No combos available.</div>
        <table *ngIf="menu.length > 0">
          <thead>
            <tr><th>Combo</th><th>Items</th><th>Price</th><th>Qty</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of menu">
              <td><strong>{{ m.comboName }}</strong></td>
              <td>{{ m.items }}</td>
              <td>₹{{ m.price }}</td>
              <td style="width:80px;">
                <input type="number" [(ngModel)]="qty[m.id]" min="1" value="1" style="width:70px;margin:0;" />
              </td>
              <td>
                <button class="small" (click)="select(m)">Select</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card" *ngIf="selected">
        <h3>Checkout</h3>
        <p>Combo: <strong>{{ selected.comboName }}</strong></p>
        <p>Quantity: <strong>{{ selectedQty }}</strong></p>
        <p>Total: <strong>₹{{ selected.price * selectedQty }}</strong></p>
        <div *ngIf="error" class="error">{{ error }}</div>
        <div *ngIf="successOtp" class="success">
          Order placed! Your OTP is <strong>{{ successOtp }}</strong>. Share with mess on delivery.
        </div>
        <button (click)="placeOrder()" [disabled]="!!successOtp">Place Order</button>
      </div>
    </div>
  `
})
export class MessMenuComponent implements OnInit {
  messId!: number;
  mess: Mess | null = null;
  menu: MenuItem[] = [];
  qty: { [id: number]: number } = {};
  selected: MenuItem | null = null;
  selectedQty = 1;
  error = '';
  successOtp = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.messId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getMess(this.messId).subscribe(m => this.mess = m);
    this.api.getMenuByMess(this.messId).subscribe(m => {
      this.menu = m;
      m.forEach(x => this.qty[x.id] = 1);
    });
  }

  select(m: MenuItem) {
    this.selected = m;
    this.selectedQty = this.qty[m.id] || 1;
    this.successOtp = '';
    this.error = '';
  }

  placeOrder() {
    if (!this.selected) return;
    const user = this.auth.currentUser();
    if (!user) return;
    this.api.placeOrder({
      userId: user.userId,
      messId: this.messId,
      comboId: this.selected.id,
      quantity: this.selectedQty
    }).subscribe({
      next: o => this.successOtp = o.otp,
      error: e => this.error = e.error?.error || 'Failed to place order'
    });
  }
}
