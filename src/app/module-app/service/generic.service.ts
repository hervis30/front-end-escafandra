import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Generic } from '../domain/generic';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  private http = inject(HttpClient);
  private url = environment.API_URL + "/Generic";
  constructor() { }


  create(generic: Generic): Observable<Generic> {
    return this.http.post<Generic>(`${this.url}/create`, generic);
  }

  update(generic: Generic): Observable<Generic> {
    return this.http.put<Generic>(`${this.url}/update`, generic);
  }

  delete(generic: Generic): Observable<Generic> {
    return this.http.post<Generic>(`${this.url}/delete`, generic);
  }

  list(): Observable<Generic[]> {
    return this.http.get<Generic[]>(`${this.url}/listall`);
  }

  read(id: number): Observable<Generic> {
    return this.http.get<Generic>(`${this.url}/readgeneric`, {
      params: { id }
    });
  }

  isGenericInUse(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/IsGenericInUse`, {
      params: { id }
    });
  }
}
