import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {PageResponse} from './equipe.service';
import {Intervention} from '../core/interface/intervention.interface';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private apiUrl = 'http://localhost:8080/api/interventions';

  constructor(private http: HttpClient) {}

  getInterventions(page: number, size: number): Observable<PageResponse<Intervention>> {
    return this.http.get<PageResponse<Intervention>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getIntervention(id: string): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.apiUrl}/${id}`);
  }

  createIntervention(intervention: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(this.apiUrl, intervention);
  }

  updateIntervention(id: string, intervention: Intervention): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.apiUrl}/${id}`, intervention);
  }

  deleteIntervention(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
