import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { SignUpRequest } from '../core/interface/auth/signup-request.interface';
import { LoginRequest } from '../core/interface/auth/login-request.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(this.getUserRoleFromToken());
  userRole$ = this.userRoleSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string | null>(this.getUsernameFromToken());
  username$ = this.usernameSubject.asObservable();

  private readonly BASE_URL = 'http://localhost:8031/api/auth';

  constructor(private http: HttpClient, private router: Router) {
    this.checkTokenValidity();
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('jwt');
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  private checkTokenValidity() {
    if (this.hasValidToken()) {
      this.isLoggedInSubject.next(true);
    } else {
      this.logout();
    }
  }

  register(data: SignUpRequest): Observable<void> {
    return this.http.post<void>(`${this.BASE_URL}/register`, data).pipe(
      catchError(this.handleError)
    );
  }

  login(data: LoginRequest): Observable<string> {
    return this.http.post<string>(`${this.BASE_URL}/login`, data, { responseType: 'text' as 'json' }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return throwError(() => new Error('Invalid credentials'));
        } else if (error.status === 403) {
          return throwError(() => new Error('Account not verified'));
        }
        return throwError(() => new Error('An unknown error occurred'));
      }),
      tap((token: string) => {
        localStorage.setItem('jwt', token);
        this.isLoggedInSubject.next(true);
        const userRole = this.extractRoleFromToken(token);
        this.userRoleSubject.next(userRole);
      })
    );
  }

  logout() {
    localStorage.removeItem('jwt');
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error.message || 'Server error';
    }
    return throwError(() => ({
      error: {
        message: errorMessage,
      },
    }));
  }

  // ---------------------- extract Role
  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  private extractRoleFromToken(token: string): string | null {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.role || null;
      }
    } catch (error) {
      console.error('Error extracting role from token:', error);
    }
    return null;
  }

  private getUserRoleFromToken(): string | null {
    const token = localStorage.getItem('jwt');
    return token ? this.extractRoleFromToken(token) : null;
  }


  // --------------- extract UserName

  private extractUsernameFromToken(token: string): string | null {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.sub || null; // 'sub' is commonly used for username in JWTs
      }
    } catch (error) {
      console.error('Error extracting username from token:', error);
    }
    return null;
  }

  private getUsernameFromToken(): string | null {
    const token = localStorage.getItem('jwt');
    return token ? this.extractUsernameFromToken(token) : null;
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }

}
