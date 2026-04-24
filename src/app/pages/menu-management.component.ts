import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, MenuItem } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Menu Management</h2>

      <div class="card">
        <h3>{{ editing ? 'Update Combo' : 'Add Combo' }}</h3>
        <div class="row">
          <div>
            <label>Combo name</label>
            <input [(ngModel)]="form.comboName" />
          </div>
          <div>
            <label>Items (comma separated)</label>
            <input [(ngModel)]="form.items" />
          </div>
          <div>
            <label>Price</label>
            <input type="number" [(ngModel)]="form.price" />
          </div>
        </div>
        <div *ngIf="error" class="error">{{ error }}</div>
        <button (click)="save()">{{ editing ? 'Update' : 'Add' }}</button>
        <button class="secondary" (click)="reset()" *ngIf="editing" style="margin-left:8px;">Cancel</button>
      </div>

      <div class="card">
        <h3>Current Menu</h3>
        <table *ngIf="menu.length > 0">
          <thead>
            <tr><th>Combo</th><th>Items</th><th>Price</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of menu">
              <td>{{ m.comboName }}</td>
              <td>{{ m.items }}</td>
              <td>₹{{ m.price }}</td>
              <td>
                <button class="small" (click)="edit(m)">Edit</button>
                <button class="small danger" (click)="remove(m)" style="margin-left:6px;">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="menu.length === 0">No combos yet.</div>
      </div>
    </div>
  `
})
export class MenuManagementComponent implements OnInit {
  menu: MenuItem[] = [];
  form: Partial<MenuItem> = { comboName: '', items: '', price: 0 };
  editing = false;
  error = '';

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    const u = this.auth.currentUser();
    if (!u || !u.messId) return;
    this.api.getMenuByMess(u.messId).subscribe(m => this.menu = m);
  }

  save() {
    const u = this.auth.currentUser();
    if (!u || !u.messId) return;
    this.error = '';
    const payload = { ...this.form, messId: u.messId };
    const obs = this.editing && this.form.id
      ? this.api.updateMenu(this.form.id, payload)
      : this.api.addMenu(payload);
    obs.subscribe({
      next: () => { this.reset(); this.load(); },
      error: e => this.error = e.error?.error || 'Save failed'
    });
  }

  edit(m: MenuItem) {
    this.editing = true;
    this.form = { ...m };
  }

  remove(m: MenuItem) {
    if (!confirm(`Delete "${m.comboName}"?`)) return;
    this.api.deleteMenu(m.id).subscribe(() => this.load());
  }

  reset() {
    this.editing = false;
    this.form = { comboName: '', items: '', price: 0 };
  }
}
