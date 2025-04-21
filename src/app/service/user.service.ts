import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import {User} from '../core/interface/user.interface';
import {PageResponse} from '../core/interface/page-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  // user.service.ts
  getUsers(page: number = 0, size: number = 3): Observable<PageResponse<User>> {
    return this.http.get<PageResponse<User>>(`${this.BASE_URL}?page=${page}&size=${size}`).pipe(
      tap(data => console.log('Users data:', data))
    );
  }

  updateUserRole(role: string, id: string): Observable<User> {
    if (!id) {
      throw new Error('User ID is required');
    }
    console.log(`Sending PUT request to update role to '${role}' for user ID: ${id}`);
    return this.http.put<User>(`${this.BASE_URL}/${id}/role`, { role: role });
  }

  deleteUser(id: string): Observable<void>{
    if(!id){
      throw new Error('User ID is required');
    }
    console.log("id: "+id);
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  getUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.BASE_URL}/profile`).pipe(
      tap(user => console.log('User Data:', user))
    );
  }

  updateUser(data: User, id: string): Observable<User> {
    return this.http.put<User>(`${this.BASE_URL}/${id}`, data);
  }

}
