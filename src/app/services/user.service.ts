import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { User } from './../shared/models/user';
import { CrudService } from './crud.service';

@Injectable({
    providedIn: 'root'
  })
  export class UserService extends CrudService<User, number> {
  
    constructor(protected _http: HttpClient) {
        super(_http, environment.apiUrl + '/users')
    }

    getPosts(userId: number): Observable<any> {
      return this._http.get<any>(this._base + '/posts/' + userId);
    }
}
  