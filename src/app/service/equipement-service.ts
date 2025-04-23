import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Equipement} from '../core/interface/equipement-interface';
import {PageResponse} from './equipe.service';

@Injectable({
  providedIn: 'root'
})
export class EquipementService {
  private apiUrl = 'http://localhost:8080/api/equipements';

  constructor(private http: HttpClient) {}

  getEquipements(page: number, size: number, sortBy: string = 'nom'): Observable<PageResponse<Equipement>> {
    return this.http.get<PageResponse<Equipement>>(`${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}`);
  }

  getEquipement(id: string): Observable<Equipement> {
    return this.http.get<Equipement>(`${this.apiUrl}/${id}`);
  }

  createEquipement(equipement: Equipement): Observable<Equipement> {
    return this.http.post<Equipement>(this.apiUrl, equipement);
  }

  updateEquipement(id: string, equipement: Equipement): Observable<Equipement> {
    return this.http.put<Equipement>(`${this.apiUrl}/${id}`, equipement);
  }

  deleteEquipement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
