import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Medicine } from '../domain/medicine';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalService {
  private http = inject(HttpClient);
  private url = environment.API_URL + "/Medicine";
  constructor() { }


  create(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(`${this.url}/create`, medicine);
  }

  update(medicine: Medicine): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.url}/update`, medicine);
  }

  delete(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(`${this.url}/delete`, medicine);
  }

  list(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.url}/listall`);
  }

  read(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.url}/readmedicine`, {
      params: { id }
    });
  }

  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.url}/exporttoexcel`, {
      responseType: 'blob'
    });
  }

  exportToPdf(): Observable<Blob> {
    return this.http.get(`${this.url}/exporttopdf`, {
      responseType: 'blob'
    });
  }
}
