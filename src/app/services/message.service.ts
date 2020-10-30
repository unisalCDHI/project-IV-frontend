import { NewMessage } from './../shared/models/new-message';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Message } from './../shared/models/message';
import { CrudService } from './crud.service';

@Injectable({
    providedIn: 'root'
  })
  export class MessageService extends CrudService<Message, number> {
  
    constructor(protected _http: HttpClient) {
        super(_http, environment.apiUrl + '/messages')
    }

    send(msg: NewMessage): Observable<any> {
      return this._http.post<any>(this._base, msg);
    }
}