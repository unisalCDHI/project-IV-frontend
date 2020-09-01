import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
    providedIn: 'root'
  })
  export class UserService extends CrudService<User, number> {
  
    constructor(protected _http: HttpClient) {
        super(_http, environment.apiUrl + '/users')
    }
}
  