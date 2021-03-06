import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { User } from './../shared/models/user';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends CrudService<any, number> {

  constructor(protected _http: HttpClient) {
    super(_http, environment.apiUrl + '/login')
  }

  login(t: User) {
    return this._http.post<any>(this._base, t, { observe: 'response' as 'body' })
      .pipe(map(user => {
        return user;
      }));
  }
}
