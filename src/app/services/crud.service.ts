import { PageableResponse } from '../shared/models/pageable-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class CrudService<T, ID> {

  constructor(protected _http: HttpClient, protected _base: string) { }

  save(t: T): Observable<T> {
    return this._http.post<T>(this._base, t);
  }

  update(id: ID, t: T): Observable<T> {
    return this._http.put<T>(this._base + '/' + id, t, {});
  }

  findOne(id: ID): Observable<T> {
    return this._http.get<T>(this._base + '/' + id);
  }

  findByPage(page = 0, size = 1000): Observable<PageableResponse<T>> {
    const options = {
      params: new HttpParams().set('page', String(page)).set('size', String(size))
    };
    return this._http.get<PageableResponse<T>>(this._base, options);
  }

  findAll(id?): Observable<T[]> {
    if (id !== undefined)
      return this._http.get<T[]>(this._base + '/' + id);
    return this._http.get<T[]>(this._base);
  }
}
