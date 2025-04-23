import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Equipe } from '../core/interface/equipe.interface';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export interface EquipeDetail {
  id: string;
  responsable: User;
  operateur: User;
  techniciens: User[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private BASE_URL = 'http://localhost:8080/api/equipes';

  constructor(private http: HttpClient) { }

  private apiUrl = '/api/equipes';

  getAllEquipes(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(this.apiUrl);
  }

  getEquipeById(id: string): Observable<Equipe> {
    return this.http.get<Equipe>(`${this.apiUrl}/${id}`);
  }

  createEquipe(equipe: Equipe): Observable<Equipe> {
    return this.http.post<Equipe>(this.BASE_URL, equipe);
  }

  updateEquipe(id: string, equipe: Equipe): Observable<Equipe> {
    return this.http.put<Equipe>(`${this.apiUrl}/${id}`, equipe);
  }

  deleteEquipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère la liste paginée des équipes avec tous les détails (responsable, opérateur, techniciens)
   * @param page Le numéro de la page (commence à 0)
   * @param size Le nombre d'éléments par page
   * @returns Observable contenant la page d'équipes avec leurs détails
   */
  getEquipesWithDetails(page: number = 0, size: number = 10): Observable<PageResponse<EquipeDetail>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<EquipeDetail>>(`${this.BASE_URL}/with-details`, { params });
  }



}
