import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PageResponse} from './equipe.service';
import {Tache} from '../core/interface/tache.interface';


@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private apiUrl = 'http://localhost:8080/api/taches';

  constructor(private http: HttpClient) {
  }

  getTaches(page: number, size: number, sortBy: string = 'nom'): Observable<PageResponse<Tache>> {
    return this.http.get<PageResponse<Tache>>(`${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}`);
  }

  getTache(id: string): Observable<Tache> {
    return this.http.get<Tache>(`${this.apiUrl}/${id}`);
  }

  createTache(Tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(this.apiUrl, Tache);
  }

  updateTache(id: string, Tache: Tache): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/${id}`, Tache);
  }

  deleteTache(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
