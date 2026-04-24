import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mess { id: number; name: string; address: string; ownerId: number; }
export interface MenuItem { id: number; messId: number; comboName: string; items: string; price: number; }
export interface Order {
  orderId: number;
  userId: number;
  userName: string;
  userMobile: string;
  userAddress: string;
  messId: number;
  messName: string;
  comboId: number;
  comboName: string;
  quantity: number;
  totalPrice: number;
  status: string;
  otp: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  // Mess
  getAllMess(): Observable<Mess[]> { return this.http.get<Mess[]>(`${this.base}/mess`); }
  getMess(id: number): Observable<Mess> { return this.http.get<Mess>(`${this.base}/mess/${id}`); }

  // Menu
  getMenuByMess(messId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.base}/menu/mess/${messId}`);
  }
  addMenu(payload: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.base}/menu`, payload);
  }
  updateMenu(id: number, payload: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.base}/menu/${id}`, payload);
  }
  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/menu/${id}`);
  }

  // Orders
  placeOrder(payload: { userId: number; messId: number; comboId: number; quantity: number; }): Observable<Order> {
    return this.http.post<Order>(`${this.base}/orders`, payload);
  }
  verifyOtp(orderId: number, otp: string): Observable<Order> {
    return this.http.post<Order>(`${this.base}/orders/verify-otp`, { orderId, otp });
  }
  userActive(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/orders/user/${userId}/active`);
  }
  userHistory(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/orders/user/${userId}/history`);
  }
  messActive(messId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/orders/mess/${messId}/active`);
  }
  messHistory(messId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/orders/mess/${messId}/history`);
  }
}
