import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  userId: number;
  name: string;
  mobileNo: string;
  address: string;
  role: 'USER' | 'ADMIN';
  messId?: number;
}

export interface RegisterPayload {
  name: string;
  mobileNo: string;
  password: string;
  address: string;
  role: 'USER' | 'ADMIN';
  messName?: string;
  messAddress?: string;
}

const STORAGE_KEY = 'mess_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://localhost:8082/api/auth';
  currentUser = signal<AuthUser | null>(this.load());

  constructor(private http: HttpClient) {}

  private load(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private save(user: AuthUser | null) {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
    this.currentUser.set(user);
  }

  register(payload: RegisterPayload): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.base}/register`, payload)
      .pipe(tap(u => this.save(u)));
  }

  login(mobileNo: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.base}/login`, { mobileNo, password })
      .pipe(tap(u => this.save(u)));
  }

  updateProfile(userId: number, payload: Partial<RegisterPayload>): Observable<AuthUser> {
    return this.http.put<AuthUser>(`${this.base}/profile/${userId}`, payload)
      .pipe(tap(u => this.save(u)));
  }

  logout() {
    this.save(null);
  }
}
