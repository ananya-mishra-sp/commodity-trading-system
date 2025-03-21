import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommodityService {
  private apiUrl = 'http://localhost:8080/api/commodities';

  constructor(private http: HttpClient) {}

  getCommodities(sortBy: string = 'name', order: string = 'asc'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?sortBy=${sortBy}&order=${order}`);
  }
  // searchCommodities(query: string): Observable<string[]> {
  //   return this.http.get<string[]>(`${this.apiUrl}/search?query=${query}`);
  // }

  getCommodityByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-name?name=${name}`);
  }
}
